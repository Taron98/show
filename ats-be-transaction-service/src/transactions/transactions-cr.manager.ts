/** @format */

import {
  TransactionChangeRequestSchema,
  ITransactionChangeRequest,
  TransactionCancelRequest,
  TransactionChangeNameRequest,
  TransactionCrResponse,
  ChangeNameValues,
} from '@atservicesv2/common';

export const createTransactionCancelRequest = async (
  cancelRequest: TransactionCancelRequest,
): Promise<TransactionCrResponse> => {
  return new TransactionChangeRequestSchema({
    type: 'CANCEL',
    transactionId: cancelRequest.transactionId,
    currentStatus: cancelRequest.currentStatus,
    clerkId: cancelRequest.clerkId,
    comment: cancelRequest.comment,
  } as ITransactionChangeRequest).save();
};

export const createTransactionChangeNameRequest = async (
  changeNameRequest: TransactionChangeNameRequest,
  oldData: ChangeNameValues,
): Promise<TransactionCrResponse> => {
  return new TransactionChangeRequestSchema({
    type: 'CHANGE_NAME',
    transactionId: changeNameRequest.transactionId,
    currentStatus: changeNameRequest.currentStatus,
    clerkId: changeNameRequest.clerkId,
    firstName: changeNameRequest.firstName,
    middleName: changeNameRequest.middleName,
    lastName: changeNameRequest.lastName,
    old: oldData,
  } as ITransactionChangeRequest).save();
};
