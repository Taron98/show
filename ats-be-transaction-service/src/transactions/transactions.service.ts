/** @format */

import {
  getTransactions,
  countTransactions,
  getDeliverViaByIdCountryTransferType,
  getDistinctTransferTypeByCountryAndId,
  getLastRecordedId,
  populateCountryByDeliverViaIds,
  insertTransaction,
  banksByCountry,
  getBankById,
  getDeliverViaById,
  addCancelRequest,
  addChangeNameRequest,
  getById,
  update,
  getDeliverViaByShortCode,
  getCountryById,
  getTransactionsAmountByDate,
  getCountryByIsoCode2,
} from './transactions.manager';
import * as transactionsCRManager from './transactions-cr.manager';
import { partnerInfo } from '../test/dummyData'; ///TODO Need to Remove this after testing
import {
  TransactionReportResponse,
  ITransaction,
  ResponseGetReceivingCountries,
  CountryType,
  ResponseGetTransferType,
  ResponseGetDeliverVia,
  RequestCreateTransaction,
  ResponseCreateTransaction,
  SenderItemResponse,
  DeliverViaType,
  ResponseCalculateAmount,
  accountClient,
  StatusError,
  Bank,
  DeliverViaItemResponse,
  AllowedStatusesResponse,
  TransactionCancelRequest,
  TransactionCrResponse,
  TransactionChangeNameRequest,
  AllowedStatuses,
  TransactionResponse,
  roundNumber,
  ChangeNameValues,
  ReceiverType,
  UserType,
  Currency,
  ObligoDepositWithdraw,
  obligoClient,
  customerClient,
  agentClient,
  DeliverVia,
  TransactionStatus,
  TransactionType,
  ICountry,
  CancelTransactionRequestType,
  ChangeDetailsRequestType,
  rateClient,
  TransactionCountType,
  CountTypeStatuses,
  complianceClient,
  createKafka,
  CheckComplianceRulesRequest,
  ComplianceRuleErrorsResponse,
  ComplianceCheckRequest,
} from '@atservicesv2/common';
import * as _ from 'lodash';

const kafka = createKafka();

export const getTransactionsByFilter = async (filter): Promise<TransactionReportResponse> => {
  const transactions: ITransaction[] = await getTransactions(filter);

  // in the case of search by transactionId no need to query transaction count
  const count: number = filter.transactionId
    ? transactions.length
    : await countTransactions(filter);

  return {
    items: transactions,
    count: count,
  } as TransactionReportResponse;
};

// Dummy data until the task regarding Rate service
export const getRate = async (): Promise<number | null> => {
  return 3.2;
};

// Dummy data until the task regarding Fee service
export const getFee = async (): Promise<number> => {
  return 22;
};

//dummy function which will be moved to rates service
export const callToRateService = async (
  amount,
  sendingCurrency,
  receivingCurrency,
): Promise<number> => {
  const rate = await getRate();
  if (rate && amount) {
    return rate * amount;
  }
  return 1;
};

export const getReceivingCountries = async (filter): Promise<ResponseGetReceivingCountries> => {
  const { countries } = await agentClient.getAgentReceivingCountries(filter);
  let receivingCountryArray: CountryType[] = [];
  countries.map(item => {
    let tempCasted = item as CountryType;
    receivingCountryArray.push({
      _id: tempCasted._id,
      name: tempCasted.name,
      currency: tempCasted.currency,
      ISOCode: tempCasted.ISOCode,
      ISOCode2: tempCasted.ISOCode2,
      phoneCode: tempCasted.phoneCode,
    });
  });
  return { countryList: receivingCountryArray };
};

export const getTransferTypesForCountry = async (
  country: string,
): Promise<ResponseGetTransferType> => {
  let deliverViaIds: Array<string> = [];
  partnerInfo.deliverWith.map(item => deliverViaIds.push(item.id));
  let transferTypes;
  if (country !== null) {
    transferTypes = await getDistinctTransferTypeByCountryAndId(country, deliverViaIds);
  }
  return { types: transferTypes } || [];
};

export const getDeliverVia = async (
  country?: string,
  transferType?: string,
): Promise<ResponseGetDeliverVia> => {
  let deliverViaIds: Array<string> = [];
  let deliverViasListCurr = {};

  partnerInfo.deliverWith.forEach(item => {
    deliverViaIds.push(item.id);
    deliverViasListCurr[item.id] = item.currencies;
  });

  const deliverVias = await getDeliverViaByIdCountryTransferType(
    deliverViaIds,
    country,
    transferType,
  );
  let deliverViasList: Array<DeliverViaType> = [];
  deliverVias.forEach(item => {
    deliverViasList.push({
      _id: item._id,
      name: item.name,
      shortCode: item.shortCode,
      transferType: item.transferType,
      currencies: deliverViasListCurr[item.id],
    });
  });

  return { deliverVias: deliverViasList } as ResponseGetDeliverVia;
};

export const calculateAmount = async (
  deliverVia: string,
  sendingCurrency: string,
  receivingCurrency: string,
  amount: number,
): Promise<ResponseCalculateAmount> => {
  const fee = await getFee();
  const amountToCollect = amount + fee;
  const calculatedReceivingAmount = await callToRateService(
    amount,
    sendingCurrency,
    receivingCurrency,
  );
  return { receivingAmount: calculatedReceivingAmount, amountToCollect: amountToCollect };
};

export const getBanksByCountry = async (countryId: string): Promise<Array<Bank> | null> => {
  return await banksByCountry(countryId);
};

export const generateTransactionId = async () => {
  const lastTransactionId = (await getLastRecordedId())?.transactionId || '88938300033';
  let lastTransactionIdSliced: string = lastTransactionId.toString().slice(0, -3);
  let increment = Number(lastTransactionIdSliced) + 1;
  const min: number = 100;
  const max: number = 999;
  const randomPart = Math.floor(Math.random() * (max - min + 1)) + min;
  return increment.toString() + randomPart.toString();
};

export const create = async (
  transaction: RequestCreateTransaction,
  userId: string,
  userType: UserType,
  agentId?: string,
  branchId?: string,
): Promise<ResponseCreateTransaction | ComplianceRuleErrorsResponse> => {
  const sender: SenderItemResponse = await customerClient.getSenderById(transaction.senderId);
  const receiver: ReceiverType = await customerClient.getReceiverById(transaction.receiverId);
  const activeDocument = sender?.identificationDocuments?.find(item => item.status === 'ACTIVE');

  if (!sender) {
    throw new StatusError(404, 'SENDER_NOT_FOUND', 'Sender not found.');
  } else if (sender.status !== 'ACTIVE') {
    throw new StatusError(404, 'SENDER_INACTIVE', 'The sender is inactive.');
  } else if (!activeDocument) {
    throw new StatusError(
      404,
      'SENDER_DOCUMENT_EXPIRED',
      'The sender`s identification document has been expired.',
    );
  }

  await customerClient.validateAndRetrieve(transaction.senderId, transaction.deliverVia);

  if (!receiver) {
    throw new StatusError(404, 'RECEIVER_NOT_FOUND', 'Receiver not found.');
  }

  let bank;
  if (transaction.transferType === 'DEPOSIT') {
    bank = await getBankById(transaction.bankInfo?.bank);
    if (!bank) throw new StatusError(404, 'BANK_NOT_FOUND', 'Bank not found.');
  }

  const deliverVia = await getDeliverViaByShortCode(transaction.deliverVia);
  if (!deliverVia) {
    throw new StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
  }

  await checkPhoneByCountry(receiver.phone, transaction.receivingCountryId);
  transaction.deliverVia = deliverVia._id;

  let agentInfo, branchInfo;
  const user = await accountClient.getUsersById(userId);
  const userInfo = { id: user._id, fullName: `${user.firstName} ${user.lastName}` };

  if (userType === 'REGULAR') {
    const [agent, branch] = await Promise.all([
      agentClient.getClientById(agentId!),
      agentClient.getBranchById(branchId!),
    ]);

    agentInfo = { id: agent._id, fullName: agent.name };
    branchInfo = { id: branch._id, fullName: branch.name };
  }

  const transactionId = await generateTransactionId();
  let status = 'WAIT';

  const averageBuyRate = await rateClient.getAverageBuyRate(
    transaction.receivingCountryId,
    transaction.sendingCurrency as Currency,
  );

  const query: ITransaction = await prepareTransactionData(
    transaction,
    sender,
    activeDocument,
    receiver,
    bank,
    deliverVia,
    agentInfo,
    branchInfo,
    userInfo,
    status,
    transactionId,
    averageBuyRate,
  );
  const declarationDocuments = [] as string[];
  if (transaction.declarationDocuments && transaction.declarationDocuments.length) {
    for (const doc of transaction.declarationDocuments) {
      declarationDocuments.push(doc.type);
    }
  }
  const transactionDataForCompliance = {
    nationality: sender.nationality,
    senderId: transaction.senderId,
    receiverId: transaction.receiverId,
    receivingCountry: transaction.receivingCountryId,
    transferType: transaction.transferType,
    deliverVia: transaction.deliverVia,
    amount: transaction.amount,
    currency: transaction.sendingCurrency,
    receivingAmount: roundNumber(transaction.amount * transaction.rate, 3),
    declarationDocuments,
  };
  const checkComplianceRulesData = await prepareComplianceData(transactionDataForCompliance);
  const checkComplianceRules: any = await complianceClient.checkComplianceRules(
    checkComplianceRulesData,
  );
  const complianceErrorsResult = Object.values(checkComplianceRules).find((arr: any) => arr.length);
  if (complianceErrorsResult) {
    return checkComplianceRules;
  }
  let createdTransaction = await insertTransaction(query);
  if (userType === 'REGULAR') {
    status = await withdrawObligo(
      agentInfo.id,
      +transaction.amount + transaction.fee,
      transaction.sendingCurrency as Currency,
      userId,
      transactionId,
      createdTransaction.id,
    );
    await update(createdTransaction.id, { status });
  }

  await customerClient.updateRelationSender(transaction.receiverId, transaction.senderId);

  if (createdTransaction.transferType === 'DEPOSIT' && createdTransaction.bankInfo) {
    await customerClient.addReceiverBankAccount(
      transaction.receiverId,
      createdTransaction.bankInfo,
    );
  }

  const transactionToReturn = await getById(createdTransaction.id);
  if (!transactionToReturn) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found.');
  }

  if (transactionToReturn.status === 'WAIT' || transactionToReturn.status === 'PENDING') {
    const receivingCountry = await getCountryById(createdTransaction.receivingCountry.toString());
    createdTransaction.receivingCountry = receivingCountry as ICountry;
    const transactionCreateRequestMsg = mapITransactionToTransactionType(
      createdTransaction,
      deliverVia.shortCode,
      sender,
      receiver,
    );
    publishKafkaMessage(
      'transaction-create-request',
      'create',
      transactionCreateRequestMsg,
      transactionCreateRequestMsg.transactionId,
    );
  }

  return {
    transaction: transactionToReturn,
    message: `Transaction submitted successfully. ${createdTransaction.transactionId}`,
  };
};

export const prepareTransactionData = async (
  transaction,
  sender,
  activeDocument,
  receiver,
  bankInfo,
  deliverVia,
  agent,
  branch,
  user,
  status,
  transactionId,
  averageBuyRate,
): Promise<ITransaction> => {
  let newTransaction = {
    transactionId: transactionId,
    receivingCountry: transaction.receivingCountryId,
    transferType: transaction.transferType,
    deliverVia: transaction.deliverVia,
    amount: transaction.amount,
    receivingAmount: roundNumber(transaction.amount * transaction.rate, 3),
    sendingCurrency: transaction.sendingCurrency,
    receivingCurrency: transaction.receivingCurrency,
    rate: transaction.rate,
    fee: transaction.fee,
    status: status,
    purpose: transaction.purpose,
    refNumber: '',
    deliverViaName: deliverVia.name,
    comment: '',
    reason: '',
    agent,
    branch,
    user,
  };

  newTransaction = {
    ...newTransaction,
    ...{
      reportData: {
        buyRate: averageBuyRate,
        currencyProfit: 0.2,
        agentCommission: 15,
        atsCommission: 7,
      },
      senderData: {
        sender: transaction.senderId,
        fullName: sender.fullName,
        city: sender.city,
        address: sender.address,
        nationality: sender.nationality,
        idType: activeDocument.idType,
        idNumber: activeDocument.idNumber,
        idExpDate: activeDocument.expirationDate,
        phoneNumber: sender.phoneNumber,
        dateOfBirth: sender.dateOfBirth,
      },
      receiverData: {
        receiver: transaction.receiverId,
        fullName: receiver.fullName,
        idNumber: receiver.idNumber,
        address: receiver.address,
        phone: receiver.phone,
        city: receiver.city,
      },
    },
  };

  if (transaction.transferType === 'DEPOSIT') {
    newTransaction = {
      ...newTransaction,
      ...{
        bankInfo: {
          bank: transaction.bankInfo?.bank,
          bankName: bankInfo?.name,
          bankBranch: transaction.bankInfo?.bankBranch,
          accountNumber: transaction.bankInfo?.accountNumber,
          IFSC: transaction.bankInfo?.IFSC,
        },
      },
    };
  }

  return newTransaction as ITransaction;
};
export const getDeliverViaByID = async (deliverViaId): Promise<DeliverViaItemResponse | null> => {
  const deliverVia = await getDeliverViaById(deliverViaId);
  if (!deliverVia) {
    throw new StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
  }
  return deliverVia as DeliverViaItemResponse;
};
export const getTransactionById = async (transactionId: string): Promise<ITransaction> => {
  const transaction = await getById(transactionId);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found.');
  }
  return transaction;
};

export const createTransactionCancelRequest = async (
  cancelRequest: TransactionCancelRequest,
): Promise<TransactionCrResponse> => {
  const transaction = await getTransactionById(cancelRequest.transactionId);
  if (transaction.status !== 'PENDING' && transaction.status !== 'POSTED') {
    throw new StatusError(404, 'TRANSACTION_WRONG_STATUS', 'Transaction wrong status.');
  }

  cancelRequest.currentStatus = transaction.status;

  const result = await transactionsCRManager.createTransactionCancelRequest(cancelRequest);
  if (transaction.status === 'PENDING') {
    await update(cancelRequest.transactionId, { status: 'FAILED' });
  } else {
    await addCancelRequest(cancelRequest.transactionId, result._id);
    const deliverVia = await getDeliverViaById(transaction.deliverVia.toString());

    const cancelTransactionRequestType: CancelTransactionRequestType = {
      transactionId: transaction.transactionId,
      deliverViaShortCode: deliverVia?.shortCode || '',
    };
    publishKafkaMessage(
      'transaction-cancel-request',
      'cancel',
      cancelTransactionRequestType,
      transaction._id.toString(),
    );
  }
  return result;
};

export const createTransactionChangeNameRequest = async (
  changeNameRequest: TransactionChangeNameRequest,
): Promise<TransactionCrResponse> => {
  const transaction = await getTransactionById(changeNameRequest.transactionId);
  const receiver = await customerClient.getReceiverById(transaction.receiverData.receiver);
  if (transaction.status !== 'PENDING' && transaction.status !== 'POSTED') {
    throw new StatusError(404, 'TRANSACTION_WRONG_STATUS', 'Transaction wrong status.');
  }
  const oldData: ChangeNameValues = {
    firstName: receiver.firstName,
    middleName: receiver.middleName,
    lastName: receiver.lastName,
  };
  const newData: ChangeNameValues = {
    firstName: changeNameRequest.firstName,
    middleName: changeNameRequest.middleName,
    lastName: changeNameRequest.lastName,
  };
  changeNameRequest.currentStatus = transaction.status;

  const result = await transactionsCRManager.createTransactionChangeNameRequest(
    changeNameRequest,
    oldData,
  );
  if (transaction.status === 'PENDING') {
    const updatedReceiver = await customerClient.requestUpdateReceiver(receiver._id, newData);
    await update(changeNameRequest.transactionId, {
      'receiverData.fullName': updatedReceiver.fullName,
    });
  } else {
    await addChangeNameRequest(changeNameRequest.transactionId, result._id);
    const deliverVia = await getDeliverViaById(transaction.deliverVia.toString());
    const changeDetailsRequestType: ChangeDetailsRequestType =
      mapITransactionToChangeDetailsRequestType(transaction, receiver, deliverVia?.shortCode);

    publishKafkaMessage(
      'transaction-change-name-request',
      'change',
      changeDetailsRequestType,
      transaction.id,
    );
  }
  return result;
};

export const getAllowedStatuses = (status): AllowedStatusesResponse => {
  if (!_.has(AllowedStatuses, status)) {
    throw new StatusError(400, 'INVALID_STATUS', 'Invalid status');
  }
  return { statuses: AllowedStatuses[status] };
};

export const updateTransaction = async (id, userId, data): Promise<TransactionResponse | null> => {
  let transaction = await getById(id);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
  }
  const user = await accountClient.getUsersById(userId || ''); //Need to fix this in the future
  if (!user) {
    throw new StatusError(404, 'USER_NOT_FOUND', 'User not found');
  }
  const { statuses } = getAllowedStatuses(transaction.status);
  if (!statuses.includes(data.status)) {
    throw new StatusError(404, 'NOT_ALLOWED_STATUS', 'Not allowed status');
  }
  transaction.status = data.status;
  transaction.comment = data.comment;
  await update(id, transaction);
  if (['FAILED', 'ABORTED'].includes(transaction.status) && user.type !== 'BACKOFFICE') {
    const obligoCredit = {
      transaction: transaction._id,
      transactionId: transaction.transactionId,
      user: userId,
      comment: data.comment,
      amount: +transaction.amount + +transaction.fee,
      currency: transaction.sendingCurrency as Currency,
      description: 'Refunded',
    } as ObligoDepositWithdraw;
    await obligoClient.withdraw(transaction.agent?.id, obligoCredit);
  }
  return transaction;
};

export const checkPhoneByCountry = async (phone, countryId): Promise<CountryType> => {
  const receivingCountry = await getCountryById(countryId);
  if (!receivingCountry) {
    throw new StatusError(404, 'COUNTRY_NOT_FOUND', 'Country not found.');
  }
  if (!phone.startsWith(receivingCountry.phoneCode)) {
    throw new StatusError(404, 'WRONG_PHONE_CODE', 'Wrong  phone code.');
  }
  return receivingCountry;
};

export const countryById = async (id): Promise<CountryType> => {
  const country = await getCountryById(id);
  if (!country) {
    throw new StatusError(404, 'COUNTRY_NOT_FOUND', 'Country not found.');
  }
  return country;
};

const withdrawObligo = async (
  agentId: string,
  amount: number,
  currency: Currency,
  userId: string,
  transactionId: string,
  transaction: string,
): Promise<string> => {
  const req = {
    amount,
    currency,
    comment: '',
    description: 'Transaction',
    user: userId,
    transactionId,
    transaction,
  } as ObligoDepositWithdraw;
  const { balance } = await obligoClient.withdraw(agentId, req);
  let status = 'PENDING';

  if (balance < 0) {
    status = 'WAIT_FOR_PROCESS_OBLIGO';
  }
  return status;
};

export const deliverViaByShortCode = async (shortCode: string): Promise<DeliverVia> => {
  const deliverVia = await getDeliverViaByShortCode(shortCode);
  if (!deliverVia) {
    throw new StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
  }
  return deliverVia as DeliverVia;
};

const complianceTypeToStartDate = (dayCount: number): Date => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - dayCount);
  return currentDate;
};

export const updateStatus = async (transactionId: string, status: TransactionStatus) => {
  let transaction = await getById(transactionId);
  if (!transaction) {
    throw new StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
  }
  transaction.status = status;
  await update(transactionId, transaction);
  return 'Updated';
};

const mapITransactionToTransactionType = (
  transaction: ITransaction,
  deliverViaShortCode: string,
  sender: SenderItemResponse,
  receiver: ReceiverType,
): TransactionType => {
  const receivingCountry = transaction.receivingCountry as ICountry;

  return {
    senderData: {
      firstName: sender.firstName,
      lastName: sender.lastName,
      middleName: sender.middleName || '',
      city: sender.city,
      address: sender.address,
      nationality: sender.nationality,
      idType: transaction.senderData.idType,
      idNumber: transaction.senderData.idNumber,
      phoneNumber: sender.phoneNumber,
      dateOfBirth: new Date(transaction.senderData.dateOfBirth).toLocaleDateString(),
    },
    receiverData: {
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      middleName: receiver.middleName || '',
      city: receiver.city,
      address: receiver.address,
      idNumber: receiver.idNumber,
      phone: receiver.phone,
    },
    transactionId: transaction.id,
    receivingCountry: {
      name: receivingCountry.name,
      ISOCode: receivingCountry.ISOCode,
      currency: receivingCountry.currency,
      phoneCode: receivingCountry.phoneCode,
    },
    bankInfo: {
      name: transaction.bankInfo?.bankName,
      branch: transaction.bankInfo?.bankBranch,
      accountNumber: transaction.bankInfo?.accountNumber,
      IFSC: transaction.bankInfo?.IFSC,
    },
    transferType: transaction.transferType,
    amount: transaction.amount,
    receivingAmount: transaction.receivingAmount,
    sendingCurrency: transaction.sendingCurrency,
    receivingCurrency: transaction.receivingCurrency,
    rate: transaction.rate,
    fee: transaction.fee,
    status: transaction.status,
    purpose: transaction.purpose,
    deliverViaShortCode: deliverViaShortCode,
    comment: transaction.comment,
    user: transaction.user?.id,
    agent: transaction.agent?.id,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  } as TransactionType;
};

const mapITransactionToChangeDetailsRequestType = (
  transaction: ITransaction,
  receiver: ReceiverType,
  deliverViaShortCode?: string,
): ChangeDetailsRequestType => {
  const receivingCountry = transaction.receivingCountry as ICountry;

  return {
    transactionId: transaction.transactionId,
    refNum: transaction.refNumber,
    receiverData: {
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      middleName: receiver.middleName || '',
      address: receiver.address,
      phone: receiver.phone,
    },
    deliverViaShortCode: deliverViaShortCode,
    bankInfo: {
      name: transaction.bankInfo?.bankName,
      accountNumber: transaction.bankInfo?.accountNumber,
    },
  } as ChangeDetailsRequestType;
};

export const publishKafkaMessage = async (topic, name, msg, transactionId): Promise<void> => {
  kafka.publish({
    topic: topic,
    message: {
      key: JSON.stringify({ name: name, retryCount: 0 }),
      value: JSON.stringify(msg),
      headers: {
        'correlation-id': transactionId,
      },
    },
  });
};

export const getTransactionCount = async (query, type: TransactionCountType) => {
  query = { ...query, from: new Date().setUTCHours(0, 0, 0, 0) };
  if (CountTypeStatuses[type]) {
    query = { ...query, ...{ status: CountTypeStatuses[type] } };
  }
  const trans = await getTransactions(query);
  return trans.length;
};

export const checkComplianceRules = async (transactionData: ComplianceCheckRequest) => {
  const checkComplianceRulesData = await prepareComplianceData(transactionData);
  return await complianceClient.checkComplianceRules(checkComplianceRulesData);
};

const prepareComplianceData = async (complianceData): Promise<CheckComplianceRulesRequest> => {
  const senderCountry = await getCountryByIsoCode2(complianceData.nationality);
  const monthTransactionAmount = await getTransactionsAmountByDate({
    senderId: complianceData.senderId,
    startDate: complianceTypeToStartDate(30),
  });
  const monthTotalAmount = monthTransactionAmount.length
    ? monthTransactionAmount[0].totalAmount + complianceData.amount
    : complianceData.amount;
  const monthTotalCount = monthTransactionAmount.length ? monthTransactionAmount[0].count + 1 : 1;
  const yearTransactionAmount = await getTransactionsAmountByDate({
    senderId: complianceData.senderId,
    startDate: complianceTypeToStartDate(365),
  });
  const yearTotalAmount = yearTransactionAmount.length
    ? yearTransactionAmount[0].totalAmount + complianceData.amount
    : complianceData.amount;
  const beneficiaries = await customerClient.getSenderReceiversCount(complianceData.senderId);
  const beneficiariesCount =
    beneficiaries.filter(item => item._id !== complianceData.receiverId).length + 1;
  return {
    localRule: {
      country: '615305247372a7f4d73f58d2',
      singleTransactionAmount: complianceData.amount,
      monthTransactionsAmount: monthTotalAmount,
      yearTransactionsAmount: yearTotalAmount,
      declarationDocuments: complianceData.declarationDocuments ?? [],
    },
    destinationRule: {
      country: complianceData.receivingCountry,
      transferType: complianceData.transferType,
      senderType: 'INDIVIDUAL',
      deliverVia: complianceData.deliverVia,
      maxReceiveAmount: complianceData.receivingAmount,
    },
    internalRule: {
      transactionNumberPerMonth: monthTotalCount,
      numberOfBeneficiaries: beneficiariesCount,
      cumulativeTransactionAmountPerMonth: yearTotalAmount,
      currency: complianceData.currency,
      senderCountry: senderCountry!._id,
      receivingCountry: complianceData.receivingCountry,
    },
  };
};
