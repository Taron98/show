"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionJoi = exports.createTransactionJoi = void 0;
/** @format */
const Joi = __importStar(require("joi"));
const _ = __importStar(require("lodash"));
const transactions_models_1 = require("./transactions.models");
const bankDeposit = (obj, helpers) => {
    const { deliverVia } = obj;
    for (const [key, value] of Object.entries(transactions_models_1.AdditionalFieldsValidation)) {
        let valid = !_.has(obj, value.path) || _.get(obj, value.path) === '' || _.get(obj, value.path) === null;
        if (value.deliverVia.includes(deliverVia)) {
            if (valid) {
                return helpers.message(`"${value.path}" is required`);
            }
        }
        else {
            if (!valid) {
                return helpers.message(`"${value.path}" should be null`);
            }
        }
    }
    return obj;
};
exports.createTransactionJoi = Joi.object({
    receivingCountryId: Joi.string().required(),
    transferType: Joi.string().valid('PICKUP', 'DEPOSIT').required(),
    deliverVia: Joi.string().min(1).max(50).required(),
    amount: Joi.number().min(10).max(9999999999.999).required(),
    sendingCurrency: Joi.string().required(),
    receivingCurrency: Joi.string().required(),
    rate: Joi.number().required(),
    fee: Joi.number().min(1).max(50).required(),
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
        .valid('SUPPORT_OR_GIFT', 'PAYMENT_PERFORMED_FOREIGN_RESIDENT', 'OVERALL_TRANSFER', 'AGGREGATE_TRANSFER', 'DEPOSIT_MY_BANK_ACCOUNT', 'DEPOSIT_OTHERS_BANK_ACCOUNT', 'TRANSFER_TO_NOT_RELATIVE')
        .required(),
})
    .custom(bankDeposit)
    .unknown();
exports.updateTransactionJoi = Joi.object({
    status: Joi.string().required(),
    comment: Joi.string().min(1).max(50).required(),
}).unknown();
