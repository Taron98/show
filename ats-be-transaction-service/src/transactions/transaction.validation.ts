/** @format */
import * as Joi from 'joi';
import * as _ from 'lodash';
import { AdditionalFieldsValidation } from './transactions.models';
const bankDeposit = (obj, helpers) => {
  const { deliverVia } = obj;
  for (const [key, value] of Object.entries(AdditionalFieldsValidation)) {
    let valid =
      !_.has(obj, value.path) || _.get(obj, value.path) === '' || _.get(obj, value.path) === null;
    if (value.deliverVia.includes(deliverVia)) {
      if (valid) {
        return helpers.message(`"${value.path}" is required`);
      }
    } else {
      if (!valid) {
        return helpers.message(`"${value.path}" should be null`);
      }
    }
  }
  return obj;
};
export const createTransactionJoi = Joi.object({
  receivingCountryId: Joi.string().required(),
  transferType: Joi.string().valid('PICKUP', 'DEPOSIT').required(),
  deliverVia: Joi.string().min(1).max(50).required(),
  amount: Joi.number().min(10).max(9999999999.999).required(),
  sendingCurrency: Joi.string().required(),
  receivingCurrency: Joi.string().required(),
  rate: Joi.number().required(),
  fee: Joi.number().min(0.001).required(),
  senderId: Joi.string().min(1).max(50).required(),
  receiverId: Joi.string().min(1).max(50).required(),
  bankInfo: Joi.when('transferType', {
    is: 'DEPOSIT',
    then: Joi.object({
      bank: Joi.string().min(1).max(50).required(),
      bankBranch: Joi.string().allow('', null),
      accountNumber: Joi.string().min(8).max(20).regex(/^\d+$/).required(),
      IFSC: Joi.string().min(8).allow('', null),
    }),
    otherwise: Joi.valid(null).default(null),
  }),
  purpose: Joi.string()
    .valid(
      'SUPPORT_OR_GIFT',
      'PAYMENT_PERFORMED_FOREIGN_RESIDENT',
      'OVERALL_TRANSFER',
      'AGGREGATE_TRANSFER',
      'DEPOSIT_MY_BANK_ACCOUNT',
      'DEPOSIT_OTHERS_BANK_ACCOUNT',
      'TRANSFER_TO_NOT_RELATIVE',
    )
    .required(),
  declarationDocuments: Joi.array().items({
    type: Joi.string().valid('PROOF_OF_ADDRESS', 'PURPOSE_OF_REMITTANCE', 'SOURCE_OF_FUNDS'),
    documentPath: Joi.string(),
  }),
})
  .custom(bankDeposit)
  .unknown();

export const updateTransactionJoi = Joi.object({
  status: Joi.string().required(),
  comment: Joi.string().min(1).max(100).required(),
}).unknown();
