/** @format */

import {
  ITransaction,
  StatusError,
  integrationClient,
  IDeliverVia,
  TransactionType,
} from '@atservicesv2/common';
import {
  getById,
  update,
  getPenddingTransactions,
  updateTransactionChangeRequest,
} from './transactions.manager';
import * as _ from 'lodash';

import { createKafka } from '@atservicesv2/common';
import { Logger } from '@atservicesv2/common';
import config from 'config';

const logger = Logger({
  service: __filename,
});

const kafka = createKafka();
const subscribtions = config.get('kafka.subscriptions');

export const getTransactionById = async (transactionId: string): Promise<ITransaction> => {
  const transaction = await getById(transactionId);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found.');
  }
  return transaction;
};

export const updateStatus = async (transactionId: string, status: string) => {
  let transaction = await getById(transactionId);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
  }
  await update(transactionId, { status });
  return 'Updated';
};

export const updateTransactionCRStatus = async (
  transactionId: string,
  type: string,
  currentStatus: string,
) => {
  let transaction = await getById(transactionId);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
  }

  await updateTransactionChangeRequest(
    { transactionId: transactionId, type: type },
    { currentStatus },
  );
  return 'Updated';
};

export const publishKafkaMessage = async (
  topic: string,
  key: any,
  value: any,
  correlationId: string,
  delay?: number,
): Promise<void> => {
  await kafka.publish({
    topic: topic,
    message: {
      key: JSON.stringify(key),
      value: JSON.stringify(value),
      headers: {
        'correlation-id': correlationId,
      },
    },
    delay,
  });
};

export const intitKafkaSubscriptions = async () => {
  try {
    if (subscribtions.transactionStatusCheck) {
      await subscribeToKafka(
        subscribtions.transactionStatusCheck.topic,
        subscribtions.transactionStatusCheck.groupId,
        processTransactionStatusCheckMessage,
      );

      await publishKafkaMessage(
        subscribtions.transactionStatusCheck.topic,
        { name: 'status-check', retryCount: 0 },
        '',
        '0',
      );
    }
    if (subscribtions.transactionCreate) {
      await subscribeToKafka(
        subscribtions.transactionCreate.topic,
        subscribtions.transactionCreate.groupId,
        processTransactionCreateMessage,
      );
    }
    if (subscribtions.transactionCancel) {
      await subscribeToKafka(
        subscribtions.transactionCancel.topic,
        subscribtions.transactionCancel.groupId,
        processTransactionCancelMessage,
      );
    }
    if (subscribtions.transactionChangeName) {
      await subscribeToKafka(
        subscribtions.transactionChangeName.topic,
        subscribtions.transactionChangeName.groupId,
        processTransactionChangeNameMessage,
      );
    }
  } catch (e) {
    logger.error(`Error subscribing to kafka topic:`, e);
  }
};

const processTransactionCreateMessage = async (key, value, correlationId): Promise<void> => {
  logger.info(
    ` ${subscribtions.transactionCreate.topic} message recived: ${JSON.stringify(value)}`,
  );
  try {
    const createRequest = value as TransactionType;
    const createResponse = await integrationClient.sendTransaction(createRequest);
    try {
      await update(createRequest.transactionId, {
        refNumber: createResponse.refNum,
        status: createResponse.status,
      });
    } catch (error) {
      logger.error(error);
    }
  } catch (e) {
    logger.error(` ${subscribtions.transactionCreate.topic} message  processing failed.`, e);
    republishMessage(
      subscribtions.transactionCreate.topic,
      key,
      value,
      correlationId,
      subscribtions.transactionCreate.maxRetryCount,
      subscribtions.transactionCreate.delay,
      onCreateTransactionError,
    );
  }
};

const processTransactionCancelMessage = async (key, value, correlationId): Promise<void> => {
  logger.info(
    ` ${subscribtions.transactionCancel.topic} message recived: ${JSON.stringify(value)}`,
  );
  try {
    await integrationClient.cancel(value);

    // await updateTransactionCRStatus(correlationId, 'CANCEL', 'POSTED');

    await updateStatus(correlationId, 'FAILED');
  } catch (e) {
    logger.error(` ${subscribtions.transactionCancel.topic} message  processing failed.`, e);
    republishMessage(
      subscribtions.transactionCancel.topic,
      key,
      value,
      correlationId,
      subscribtions.transactionCancel.maxRetryCount,
      subscribtions.transactionCancel.delay,
      onCancelTransactionError,
    );
  }
};

const processTransactionChangeNameMessage = async (key, value, correlationId): Promise<void> => {
  logger.info(
    ` ${subscribtions.transactionChangeName.topic} message recived: ${JSON.stringify(value)}`,
  );
  try {
    await integrationClient.changeDetails(value);
    // await updateTransactionCRStatus(correlationId, 'CHANGE_NAME', 'POSTED');
  } catch (e) {
    logger.error(` ${subscribtions.transactionChangeName.topic} message  processing failed.`, e);
    republishMessage(
      subscribtions.transactionChangeName.topic,
      key,
      value,
      correlationId,
      subscribtions.transactionChangeName.maxRetryCount,
      subscribtions.transactionChangeName.delay,
      onChangeTransactionNameError,
    );
  }
};
const processTransactionStatusCheckMessage = async (key, value, correlationId): Promise<void> => {
  // logger.info(` ${subscribtions.transactionStatusCheck.topic} message recived.`);
  try {
    const transactions: ITransaction[] = await getPenddingTransactions();

    if (!_.isEmpty(transactions)) {
      for (let transaction of transactions) {
        try {
          const deliverVia = transaction.deliverVia as IDeliverVia;
          const checkStatusResp = await integrationClient.checkStatus({
            transactionId: transaction.refNumber,
            deliverViaShortCode: deliverVia.shortCode,
          });
          if (checkStatusResp && checkStatusResp.status !== transaction.status) {
            await updateStatus(transaction.id, checkStatusResp.status);
          }
        } catch (error) {
          // logger.error(` Failed to check transaction status: ${transaction.refNumber} `, error);
        }
      }
    }
    publishKafkaMessage(
      subscribtions.transactionStatusCheck.topic,
      key,
      value,
      correlationId,
      subscribtions.transactionStatusCheck.delay,
    );
  } catch (e) {
    logger.error(` ${subscribtions.transactionStatusCheck.topic} message  processing failed.`);
    await publishKafkaMessage(
      subscribtions.transactionStatusCheck.topic,
      { name: 'status-check', retryCount: 0 },
      '',
      '0',
    );
  }
};

const onCreateTransactionError = async (
  key: string,
  data: any,
  transactionId: string,
): Promise<void> => {
  logger.error(
    ` Failed to process message: ${JSON.stringify(data)} 'topic: ' ${
      subscribtions.transactionCreate.topic
    }`,
  );
  await update(transactionId, {
    status: 'FAILED',
  });
};
const onCancelTransactionError = async (
  key: string,
  data: any,
  transactionId: string,
): Promise<void> => {
  logger.error(
    ` Failed to process message: ${JSON.stringify(data)} 'topic: ' ${
      subscribtions.transactionCancel.topic
    }`,
  );
  // await updateTransactionCRStatus(transactionId, 'CANCEL', 'FAILED');
};
const onChangeTransactionNameError = async (
  key: string,
  data: any,
  transactionId: string,
): Promise<void> => {
  logger.error(
    ` Failed to process message: ${JSON.stringify(data)} 'topic: ' ${
      subscribtions.transactionChangeName.topic
    }`,
  );
  await updateTransactionCRStatus(transactionId, 'CHANGE_NAME', 'FAILED');
};

export const subscribeToKafka = async (
  topic: string,
  groupId: string,
  messageHandler: (key: string, data: string, correlationId: string) => any,
): Promise<void> => {
  const kafkaClient = createKafka();
  await kafkaClient.subscribe<any>({
    groupId: groupId,
    topic: topic,

    onMessage: async (key, data, correlationId) => {
      await messageHandler(key, data, correlationId);
    },
  });
};

export const republishMessage = async (
  topic: string,
  key: any,
  value: any,
  correlationId: string,
  maxRetryCount: number,
  delay: number,
  messageProcessiongErrorHandler: (key: string, data: string, correlationId: string) => any,
): Promise<void> => {
  try {
    logger.info(`Republishing ${topic} message : ${JSON.stringify(value)}`);
    if (key && key.retryCount < maxRetryCount) {
      key.retryCount++;
      await publishKafkaMessage(topic, key, value, correlationId, delay);
    } else {
      messageProcessiongErrorHandler(key, value, correlationId);
    }
  } catch (error) {
    logger.error(`Failed to republish ${topic} message.`);
    messageProcessiongErrorHandler(key, value, correlationId);
  }
};
