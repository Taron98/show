/** @format */

import {
  FilterHelper,
  FilterType,
  TransactionSchema,
  ITransaction,
  ICountry,
  DeliverViaModel,
  BankModel,
  Bank,
  CountryModel,
} from '@atservicesv2/common';
import mongoose from 'mongoose';

export const getDeliverViaByIdCountryTransferType = async (
  deliverViaIds: Array<string>,
  country?: string,
  transferType?: string,
) => {
  let query: any = { _id: { $in: deliverViaIds } };

  FilterHelper.query(query, 'country', FilterType.EQUALS, country);
  FilterHelper.query(query, 'transferType', FilterType.EQUALS, transferType);

  return DeliverViaModel.find(query).select('name shortCode transferType');
};

export const getDeliverViaById = async (deliverViaId: string) => {
  return DeliverViaModel.findById(deliverViaId);
};

export const getCountryByIsoCode2 = async (ISOCode2: string) => {
  return CountryModel.findOne({ ISOCode2 });
};
export const getCountryById = async (id: string) => {
  return CountryModel.findById(id);
};
export const getDeliverViaByShortCode = async (shortCode: string) => {
  return DeliverViaModel.findOne({ shortCode: shortCode });
};

export const getDistinctTransferTypeByCountryAndId = async (
  country: ICountry | string,
  deliverViaIds: Array<string>,
) => {
  return DeliverViaModel.distinct('transferType', {
    country: country,
    _id: { $in: deliverViaIds },
  });
};

export const populateCountryByDeliverViaIds = async (deliverViaIds: Array<string>) => {
  return DeliverViaModel.find({
    _id: { $in: deliverViaIds },
  }).populate('country');
};

export const getLastRecordedId = async (): Promise<ITransaction | null> => {
  return TransactionSchema.findOne({}, ['transactionId'], { sort: { createdAt: -1 } });
};

export const insertTransaction = async (query): Promise<ITransaction> => {
  return new TransactionSchema(query).save();
};

export const banksByCountry = async (countryId): Promise<Array<Bank> | null> => {
  return await BankModel.find({ country: countryId, partner: false });
};

export const getTransactions = async (filter: any = {}): Promise<ITransaction[]> => {
  const query = buildGetTransactionsQuery(filter);
  const queryOptions = FilterHelper.getPagingAndSorting(
    filter,
    [
      'createdAt',
      'updatedAt',
      'amount',
      'receivingAmount',
      'status',
      'agent',
      'branch',
      'user',
      'agent._id',
      'user._id',
    ],
    'createdAt',
  );

  return TransactionSchema.find(query, {}, queryOptions).populate('receivingCountry');
};

export const countTransactions = async (filter: any = {}): Promise<number> => {
  const query = buildGetTransactionsQuery(filter);
  return TransactionSchema.count(query);
};

export const getById = async (transactionId): Promise<ITransaction | null> => {
  return TransactionSchema.findOne({ _id: transactionId });
};

const buildGetTransactionsQuery = filter => {
  const query = {};
  if (filter.transactionId) {
    FilterHelper.query(query, 'transactionId', FilterType.EQUALS, filter.transactionId);
    FilterHelper.query(query, 'deliverVia', FilterType.EQUALS, filter.deliverVia);
    if (filter.status) {
      FilterHelper.query(query, 'status', FilterType.IN, filter.status.toString().split(','));
    }
  } else {
    FilterHelper.query(query, 'createdAt', FilterType.BETWEEN, {
      from: filter.from,
      to: filter.to,
    });
    FilterHelper.query(query, 'receivingCountry', FilterType.EQUALS, filter.receivingCountry);
    FilterHelper.query(query, 'transferType', FilterType.EQUALS, filter.transferType);
    FilterHelper.query(query, 'deliverVia', FilterType.EQUALS, filter.deliverVia);
    FilterHelper.query(query, 'agent.fullName', FilterType.EQUALS, filter.agentName);
    FilterHelper.query(query, 'user.fullName', FilterType.EQUALS, filter.userName);
    FilterHelper.query(query, 'user.id', FilterType.EQUALS, filter.createdBy);
    FilterHelper.query(query, 'agent.id', FilterType.EQUALS, filter.agent);
    if (filter.status) {
      FilterHelper.query(query, 'status', FilterType.IN, filter.status.toString().split(','));
    }
    FilterHelper.query(query, 'sendingCurrency', FilterType.EQUALS, filter.sendingCurrency);
    FilterHelper.query(
      query,
      [
        'transactionId',
        'senderData.fullName',
        'senderData.idNumber',
        'senderData.phoneNumber',
        'receiverData.fullName',
        'receiverData.idNumber',
        'receiverData.phone',
        'bankInfo.accountNumber',
        'agent.fullName',
        'user.fullName',
      ],
      FilterType.SEARCH_MULTI_EXPR_CONTAINS,
      filter.search,
    );
  }

  if (filter.currentUserType === 'REGULAR') {
    FilterHelper.query(query, 'agent.id', FilterType.EQUALS, filter.agent);
    if (filter.currentUserRole !== 'MANAGER') {
      FilterHelper.query(query, 'user.id', FilterType.EQUALS, filter.user);
    }
  }

  return query;
};
export const getBankById = async (bankId: string | undefined) => {
  return BankModel.findById(bankId);
};

export const addCancelRequest = async (
  transactionId: string,
  cancelRequestId: string,
): Promise<void> => {
  await TransactionSchema.updateOne(
    { _id: transactionId },
    {
      status: 'REQUEST_CANCEL',
      cancelRequest: cancelRequestId,
    },
  );
};

export const addChangeNameRequest = async (
  transactionId: string,
  changeNameRequestId: string,
): Promise<void> => {
  await TransactionSchema.updateOne(
    { _id: transactionId },
    {
      status: 'REQUEST_CHANGE',
      changeNameRequest: changeNameRequestId,
    },
  );
};

export const update = async (id, data): Promise<ITransaction | null> => {
  return TransactionSchema.findOneAndUpdate({ _id: id }, data);
};

export const getTransactionsAmountByDate = async (filter: any = {}): Promise<any[]> => {
  const query = {};
  FilterHelper.query(
    query,
    'receivingCountry',
    FilterType.EQUALS,
    FilterHelper.makeObjectId(filter.receivingCountryId),
  );
  FilterHelper.query(
    query,
    'senderData.sender',
    FilterType.EQUALS,
    FilterHelper.makeObjectId(filter.senderId),
  );
  FilterHelper.query(
    query,
    'receiverData.receiver',
    FilterType.EQUALS,
    FilterHelper.makeObjectId(filter.receiverId),
  );
  FilterHelper.query(query, 'createdAt', FilterType.GREATER, filter.startDate);

  return TransactionSchema.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
};
