"use strict";
/** @format */
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
exports.createTransactionChangeNameRequest = exports.createTransactionCancelRequest = void 0;
const common_1 = require("@atservicesv2/common");
const createTransactionCancelRequest = (cancelRequest) => __awaiter(void 0, void 0, void 0, function* () {
    return new common_1.TransactionChangeRequestSchema({
        type: 'CANCEL',
        transactionId: cancelRequest.transactionId,
        currentStatus: cancelRequest.currentStatus,
        clerkId: cancelRequest.clerkId,
        comment: cancelRequest.comment,
    }).save();
});
exports.createTransactionCancelRequest = createTransactionCancelRequest;
const createTransactionChangeNameRequest = (changeNameRequest, oldData) => __awaiter(void 0, void 0, void 0, function* () {
    return new common_1.TransactionChangeRequestSchema({
        type: 'CHANGE_NAME',
        transactionId: changeNameRequest.transactionId,
        currentStatus: changeNameRequest.currentStatus,
        clerkId: changeNameRequest.clerkId,
        firstName: changeNameRequest.firstName,
        middleName: changeNameRequest.middleName,
        lastName: changeNameRequest.lastName,
        old: oldData,
    }).save();
});
exports.createTransactionChangeNameRequest = createTransactionChangeNameRequest;
