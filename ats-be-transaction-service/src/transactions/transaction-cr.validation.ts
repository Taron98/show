/** @format */
import * as Joi from 'joi';

export const reateTransactionCancelJoi = Joi.object({
  transactionId: Joi.string().required(),
  comment: Joi.string().min(4).max(100).required(),
}).unknown();

export const createTransactionChangeNameRequestJoi = Joi.object({
  transactionId: Joi.string().required(),
  firstName: Joi.string()
    .min(1)
    .max(50)
    .regex(/^[ a-zA-Z]+$/)
    .required(),
  middleName: Joi.string()
    .min(1)
    .max(50)
    .regex(/^[ a-zA-Z]+$/)
    .allow('', null),
  lastName: Joi.string()
    .min(1)
    .max(50)
    .regex(/^[ a-zA-Z]+$/)
    .required(),
}).unknown();
