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
exports.createTransactionChangeNameRequestJoi = exports.reateTransactionCancelJoi = void 0;
/** @format */
const Joi = __importStar(require("joi"));
exports.reateTransactionCancelJoi = Joi.object({
    transactionId: Joi.string().required(),
    comment: Joi.string().min(4).max(100).required(),
}).unknown();
exports.createTransactionChangeNameRequestJoi = Joi.object({
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
