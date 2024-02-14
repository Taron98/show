/** @format */

import {
  TransactionSchema,
  TransactionChangeRequestSchema,
  ITransaction,
  ITransactionChangeRequest,
} from "@atservicesv2/common";

export const getById = async (transactionId): Promise<ITransaction | null> => {
  return TransactionSchema.findOne({ _id: transactionId });
};

export const update = async (id, data): Promise<ITransaction | null> => {
  return TransactionSchema.findOneAndUpdate({ _id: id }, data);
};

export const updateTransactionChangeRequest = async (
  filter,
  data
): Promise<ITransactionChangeRequest | null> => {
  return TransactionChangeRequestSchema.findOneAndUpdate(filter, data);
};

export const getPenddingTransactions = async (): Promise<ITransaction[]> => {
  let transactions = await TransactionSchema.find({
    $and: [
      {
        refNumber: {
          $ne: "",
        },
      },
      {
        refNumber: {
          $ne: null,
        },
      },
      {
        status: {
          $in: ["POSTED", "FOR_VERIFICATION"],
        },
      },
    ],
  }).populate("deliverVia");
  return transactions;
};
