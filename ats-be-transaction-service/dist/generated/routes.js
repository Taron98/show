"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const transactions_controller_1 = require("./../src/transactions/transactions.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const transactions_internal_controller_1 = require("./../src/transactions/transactions.internal.controller");
const auth_config_1 = require("./../auth.config");
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "CountryResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "phoneCode": { "dataType": "string", "required": true }, "ISOCode2": { "dataType": "string", "required": true }, "ISOCode": { "dataType": "string", "required": true }, "currency": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "_id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeliverVia": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "shortCode": { "dataType": "string", "required": true }, "transferType": { "dataType": "string", "required": true }, "country": { "dataType": "union", "subSchemas": [{ "ref": "CountryResponse" }, { "dataType": "string" }], "required": true }, "name": { "dataType": "string", "required": true }, "_id": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReportData": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "atsCommission": { "dataType": "double", "required": true }, "agentCommission": { "dataType": "double", "required": true }, "currencyProfit": { "dataType": "double", "required": true }, "buyRate": { "dataType": "double" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["ALL"] }, { "dataType": "enum", "enums": ["ABORTED"] }, { "dataType": "enum", "enums": ["CHECK_DOCUMENT"] }, { "dataType": "enum", "enums": ["CONFIRMED"] }, { "dataType": "enum", "enums": ["FAILED"] }, { "dataType": "enum", "enums": ["FOR_VERIFICATION"] }, { "dataType": "enum", "enums": ["PENDING"] }, { "dataType": "enum", "enums": ["POSTED"] }, { "dataType": "enum", "enums": ["REQUEST_CANCEL"] }, { "dataType": "enum", "enums": ["REQUEST_CHANGE"] }, { "dataType": "enum", "enums": ["WAIT"] }, { "dataType": "enum", "enums": ["WAIT_FOR_PROCESS_OBLIGO"] }, { "dataType": "enum", "enums": ["WAIT_FOR_PROCESS_COMPLIANCE"] }, { "dataType": "enum", "enums": ["UNPROCESSED"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SenderData": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "dateOfBirth": { "dataType": "double", "required": true }, "phoneNumber": { "dataType": "string", "required": true }, "idExpDate": { "dataType": "double", "required": true }, "idNumber": { "dataType": "string", "required": true }, "idType": { "dataType": "string", "required": true }, "nationality": { "dataType": "string", "required": true }, "address": { "dataType": "string", "required": true }, "city": { "dataType": "string", "required": true }, "fullName": { "dataType": "string", "required": true }, "sender": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReceiverData": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "city": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "phone": { "dataType": "string", "required": true }, "address": { "dataType": "string", "required": true }, "idNumber": { "dataType": "string", "required": true }, "fullName": { "dataType": "string", "required": true }, "receiver": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BankInfo": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "IFSC": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] }, "accountNumber": { "dataType": "string", "required": true }, "bankBranch": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] }, "bankName": { "dataType": "string" }, "bank": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionPurpose": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["SUPPORT_OR_GIFT"] }, { "dataType": "enum", "enums": ["PAYMENT_PERFORMED_FOREIGN_RESIDENT"] }, { "dataType": "enum", "enums": ["OVERALL_TRANSFER"] }, { "dataType": "enum", "enums": ["AGGREGATE_TRANSFER"] }, { "dataType": "enum", "enums": ["DEPOSIT_MY_BANK_ACCOUNT"] }, { "dataType": "enum", "enums": ["DEPOSIT_OTHERS_BANK_ACCOUNT"] }, { "dataType": "enum", "enums": ["TRANSFER_TO_NOT_RELATIVE"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClientInfo": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["AGENT"] }, { "dataType": "enum", "enums": ["PARTNER"] }], "required": true }, "fullName": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BranchInfo": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "fullName": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserInfo": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "fullName": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "updatedAt": { "dataType": "double" }, "createdAt": { "dataType": "double" }, "comment": { "dataType": "string" }, "deliverViaName": { "dataType": "string", "required": true }, "user": { "ref": "UserInfo" }, "branch": { "ref": "BranchInfo" }, "agent": { "ref": "ClientInfo" }, "refNumber": { "dataType": "string", "required": true }, "purpose": { "dataType": "union", "subSchemas": [{ "ref": "TransactionPurpose" }, { "dataType": "string" }], "required": true }, "bankInfo": { "ref": "BankInfo" }, "receiverData": { "ref": "ReceiverData", "required": true }, "senderData": { "ref": "SenderData", "required": true }, "status": { "ref": "TransactionStatus", "required": true }, "fee": { "dataType": "double", "required": true }, "rate": { "dataType": "double", "required": true }, "reportData": { "ref": "ReportData", "required": true }, "receivingCurrency": { "dataType": "string", "required": true }, "sendingCurrency": { "dataType": "string", "required": true }, "receivingAmount": { "dataType": "double", "required": true }, "reason": { "dataType": "string" }, "amount": { "dataType": "double", "required": true }, "deliverVia": { "dataType": "union", "subSchemas": [{ "ref": "DeliverVia" }, { "dataType": "string" }], "required": true }, "transferType": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["PICKUP"] }, { "dataType": "enum", "enums": ["DEPOSIT"] }], "required": true }, "receivingCountry": { "dataType": "union", "subSchemas": [{ "ref": "CountryResponse" }, { "dataType": "string" }], "required": true }, "transactionId": { "dataType": "string", "required": true }, "_id": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionReportResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true }, "items": { "dataType": "union", "subSchemas": [{ "dataType": "array", "array": { "dataType": "refAlias", "ref": "TransactionResponse" } }, { "dataType": "enum", "enums": [null] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CountryType": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "phoneCode": { "dataType": "string", "required": true }, "ISOCode2": { "dataType": "string", "required": true }, "ISOCode": { "dataType": "string", "required": true }, "currency": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "_id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseGetReceivingCountries": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "countryList": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "CountryType" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseGetTransferType": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "types": { "dataType": "array", "array": { "dataType": "double" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CurrenciesType": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "receiving": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "sending": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeliverViaType": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "currencies": { "ref": "CurrenciesType", "required": true }, "shortCode": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "_id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseGetDeliverVia": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "deliverVias": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "DeliverViaType" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseCalculateAmount": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "amountToCollect": { "dataType": "double", "required": true }, "receivingAmount": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestCalculateAmount": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "amount": { "dataType": "double", "required": true }, "receivingCurrency": { "dataType": "string", "required": true }, "sendingCurrency": { "dataType": "string", "required": true }, "deliverVia": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseCreateTransaction": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "message": { "dataType": "string", "required": true }, "transaction": { "ref": "TransactionResponse", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestCreateTransaction": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "purpose": { "dataType": "string", "required": true }, "bankInfo": { "ref": "BankInfo" }, "receiverId": { "dataType": "string", "required": true }, "senderId": { "dataType": "string", "required": true }, "fee": { "dataType": "double", "required": true }, "rate": { "dataType": "double", "required": true }, "receivingCurrency": { "dataType": "string", "required": true }, "sendingCurrency": { "dataType": "string", "required": true }, "amount": { "dataType": "double", "required": true }, "deliverVia": { "dataType": "string", "required": true }, "transferType": { "dataType": "string", "required": true }, "receivingCountryId": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["BACKOFFICE"] }, { "dataType": "enum", "enums": ["REGULAR"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Bank": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "partner": { "dataType": "boolean", "required": true }, "country": { "dataType": "union", "subSchemas": [{ "ref": "CountryResponse" }, { "dataType": "string" }], "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeliverViaItemResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "transferType": { "dataType": "string", "required": true }, "country": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "_id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionChangeRequestType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["CHANGE_NAME"] }, { "dataType": "enum", "enums": ["CANCEL"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionCrResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "comment": { "dataType": "string" }, "lastName": { "dataType": "string", "required": true }, "middleName": { "dataType": "string" }, "firstName": { "dataType": "string", "required": true }, "clerkId": { "dataType": "string", "required": true }, "currentStatus": { "ref": "TransactionStatus", "required": true }, "type": { "ref": "TransactionChangeRequestType", "required": true }, "transactionId": { "dataType": "string", "required": true }, "_id": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionCancelRequest": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "comment": { "dataType": "string", "required": true }, "clerkId": { "dataType": "string" }, "currentStatus": { "ref": "TransactionStatus" }, "transactionId": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionChangeNameRequest": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lastName": { "dataType": "string", "required": true }, "middleName": { "dataType": "string" }, "firstName": { "dataType": "string", "required": true }, "clerkId": { "dataType": "string" }, "currentStatus": { "ref": "TransactionStatus" }, "transactionId": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AllowedStatusesResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "statuses": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestUpdateTransaction": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "comment": { "dataType": "string", "required": true }, "status": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Currency": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["USD"] }, { "dataType": "enum", "enums": ["HKD"] }, { "dataType": "enum", "enums": ["PHP"] }, { "dataType": "enum", "enums": ["INR"] }, { "dataType": "enum", "enums": ["NPR"] }, { "dataType": "enum", "enums": ["IDR"] }, { "dataType": "enum", "enums": ["LKR"] }, { "dataType": "enum", "enums": ["VND"] }, { "dataType": "enum", "enums": ["KHR"] }, { "dataType": "enum", "enums": ["CNY"] }, { "dataType": "enum", "enums": ["PKR"] }, { "dataType": "enum", "enums": ["THB"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ComplianceCheckRequest": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "amount": { "dataType": "double", "required": true }, "deliverVia": { "dataType": "string", "required": true }, "currency": { "ref": "Currency", "required": true }, "country": { "dataType": "string", "required": true }, "receiverId": { "dataType": "string", "required": true }, "senderId": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionCountType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["ALL"] }, { "dataType": "enum", "enums": ["NOT_PROCESSED"] }, { "dataType": "enum", "enums": ["HOLD"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/api/transactions', authenticateMiddleware([{ "api_jwt": ["TRANSACTION_REPORTS"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getTransactions)), function TransactionsController_getTransactions(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getTransactions.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/rate', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getRate)), function TransactionsController_getRate(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getRate.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/fee', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getFee)), function TransactionsController_getFee(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getFee.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/receivingCountries', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getReceivingCountries)), function TransactionsController_getReceivingCountries(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getReceivingCountries.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/:countryId/transferTypes', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getTransactionTypesForCountry)), function TransactionsController_getTransactionTypesForCountry(request, response, next) {
        const args = {
            countryId: { "in": "path", "name": "countryId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getTransactionTypesForCountry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/getDeliverVia', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getDeliverVia)), function TransactionsController_getDeliverVia(request, response, next) {
        const args = {
            countryId: { "in": "query", "name": "countryId", "dataType": "string" },
            transferType: { "in": "query", "name": "transferType", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getDeliverVia.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/deliver-via/:shortCode', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getDeliverViaByShortCode)), function TransactionsController_getDeliverViaByShortCode(request, response, next) {
        const args = {
            shortCode: { "in": "path", "name": "shortCode", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getDeliverViaByShortCode.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/transactions/calculateAmount', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.calculateAmount)), function TransactionsController_calculateAmount(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "RequestCalculateAmount" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.calculateAmount.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/transactions/create', authenticateMiddleware([{ "jwt": ["SEND_MONEY"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.createTransaction)), function TransactionsController_createTransaction(request, response, next) {
        const args = {
            reqBody: { "in": "body", "name": "reqBody", "required": true, "ref": "RequestCreateTransaction" },
            userId: { "in": "header", "name": "user-id", "required": true, "dataType": "string" },
            userType: { "in": "header", "name": "user-type", "required": true, "ref": "UserType" },
            agentId: { "in": "header", "name": "user-agent-id", "dataType": "string" },
            branchId: { "in": "header", "name": "user-branch-id", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.createTransaction.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/:countryId/banks', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getBanksByCountry)), function TransactionsController_getBanksByCountry(request, response, next) {
        const args = {
            countryId: { "in": "path", "name": "countryId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getBanksByCountry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/deliverVia/:deliverViaId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getDeliverViaById)), function TransactionsController_getDeliverViaById(request, response, next) {
        const args = {
            deliverViaId: { "in": "path", "name": "deliverViaId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getDeliverViaById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/transactions/cancel-request', authenticateMiddleware([{ "jwt": ["SEND_MONEY"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.createTransactionCancelRequest)), function TransactionsController_createTransactionCancelRequest(request, response, next) {
        const args = {
            reqBody: { "in": "body", "name": "reqBody", "required": true, "ref": "TransactionCancelRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.createTransactionCancelRequest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/transactions/change-name-request', authenticateMiddleware([{ "jwt": ["SEND_MONEY"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.createTransactionChangeNameRequest)), function TransactionsController_createTransactionChangeNameRequest(request, response, next) {
        const args = {
            reqBody: { "in": "body", "name": "reqBody", "required": true, "ref": "TransactionChangeNameRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.createTransactionChangeNameRequest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/allowed-statuses/:status', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getApplicableStatuses)), function TransactionsController_getApplicableStatuses(request, response, next) {
        const args = {
            status: { "in": "path", "name": "status", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getApplicableStatuses.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/transactions/:id/update', authenticateMiddleware([{ "jwt": ["SEND_MONEY"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.update)), function TransactionsController_update(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            reqBody: { "in": "body", "name": "reqBody", "required": true, "ref": "RequestUpdateTransaction" },
            userId: { "in": "header", "name": "user-id", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.update.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/transactions/check-compliance', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.checkComplianceRules)), function TransactionsController_checkComplianceRules(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "ComplianceCheckRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.checkComplianceRules.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/transactions/update-status/:transactionId/:status', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.updateStatus)), function TransactionsController_updateStatus(request, response, next) {
        const args = {
            transactionId: { "in": "path", "name": "transactionId", "required": true, "dataType": "string" },
            status: { "in": "path", "name": "status", "required": true, "ref": "TransactionStatus" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.updateStatus.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/reports-count/:type', authenticateMiddleware([{ "jwt": ["TRANSACTION_REPORTS"] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getTransactionCount)), function TransactionsController_getTransactionCount(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            type: { "in": "path", "name": "type", "required": true, "ref": "TransactionCountType" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getTransactionCount.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/transactions/country/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController)), ...((0, runtime_1.fetchMiddlewares)(transactions_controller_1.TransactionsController.prototype.getCountryById)), function TransactionsController_getCountryById(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_controller_1.TransactionsController();
            const promise = controller.getCountryById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getTransactions)), function TransactionsInternalController_getTransactions(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getTransactions.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/receivingCountries', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getReceivingCountries)), function TransactionsInternalController_getReceivingCountries(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getReceivingCountries.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/getDeliverVia', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getDeliverVia)), function TransactionsInternalController_getDeliverVia(request, response, next) {
        const args = {
            countryId: { "in": "query", "name": "countryId", "dataType": "string" },
            transferType: { "in": "query", "name": "transferType", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getDeliverVia.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/deliver-via/:shortCode', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getDeliverViaByShortCode)), function TransactionsInternalController_getDeliverViaByShortCode(request, response, next) {
        const args = {
            shortCode: { "in": "path", "name": "shortCode", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getDeliverViaByShortCode.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/deliverVia/:deliverViaId', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getDeliverViaById)), function TransactionsInternalController_getDeliverViaById(request, response, next) {
        const args = {
            deliverViaId: { "in": "path", "name": "deliverViaId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getDeliverViaById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/check-phone-by-country/:country/:phone', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.checkPhoneByCountry)), function TransactionsInternalController_checkPhoneByCountry(request, response, next) {
        const args = {
            phone: { "in": "path", "name": "phone", "required": true, "dataType": "string" },
            country: { "in": "path", "name": "country", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.checkPhoneByCountry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/country/:id', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getCountryById)), function TransactionsInternalController_getCountryById(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getCountryById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/internal/transactions/update-status/:transactionId/:status', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.updateStatus)), function TransactionsInternalController_updateStatus(request, response, next) {
        const args = {
            transactionId: { "in": "path", "name": "transactionId", "required": true, "dataType": "string" },
            status: { "in": "path", "name": "status", "required": true, "ref": "TransactionStatus" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.updateStatus.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/internal/transactions/reports-count/:type', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.getTransactionCount)), function TransactionsInternalController_getTransactionCount(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            type: { "in": "path", "name": "type", "required": true, "ref": "TransactionCountType" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.getTransactionCount.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/internal/transactions/:id/update/:userId', ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController)), ...((0, runtime_1.fetchMiddlewares)(transactions_internal_controller_1.TransactionsInternalController.prototype.update)), function TransactionsInternalController_update(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            reqBody: { "in": "body", "name": "reqBody", "required": true, "ref": "RequestUpdateTransaction" },
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactions_internal_controller_1.TransactionsInternalController();
            const promise = controller.update.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return function runAuthenticationMiddleware(request, _response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                // keep track of failed auth attempts so we can hand back the most
                // recent one.  This behavior was previously existing so preserving it
                // here
                const failedAttempts = [];
                const pushAndRethrow = (error) => {
                    failedAttempts.push(error);
                    throw error;
                };
                const secMethodOrPromises = [];
                for (const secMethod of security) {
                    if (Object.keys(secMethod).length > 1) {
                        const secMethodAndPromises = [];
                        for (const name in secMethod) {
                            secMethodAndPromises.push((0, auth_config_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                            .then(users => { return users[0]; }));
                    }
                    else {
                        for (const name in secMethod) {
                            secMethodOrPromises.push((0, auth_config_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                    }
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                try {
                    request['user'] = yield promiseAny(secMethodOrPromises);
                    next();
                }
                catch (err) {
                    // Show most recent error as response
                    const error = failedAttempts.pop();
                    error.status = error.status || 401;
                    next(error);
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            });
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
