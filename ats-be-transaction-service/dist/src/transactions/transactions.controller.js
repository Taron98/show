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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.TransactionsController = void 0;
/** @format */
const express = __importStar(require("express"));
const tsoa_1 = require("tsoa");
const transactions_service_1 = require("./transactions.service");
const common_1 = require("@atservicesv2/common");
const transaction_validation_1 = require("./transaction.validation");
const transaction_cr_validation_1 = require("./transaction-cr.validation");
let TransactionsController = class TransactionsController extends tsoa_1.Controller {
    getTransactions(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transactions_service_1.getTransactionsByFilter)(request.query);
        });
    }
    getRate() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transactions_service_1.getRate)();
        });
    }
    getFee() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transactions_service_1.getFee)();
        });
    }
    getReceivingCountries(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getReceivingCountries)(request.query);
        });
    }
    getTransactionTypesForCountry(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getTransferTypesForCountry)(countryId);
        });
    }
    getDeliverVia(countryId, transferType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getDeliverVia)(countryId, transferType);
        });
    }
    getDeliverViaByShortCode(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.deliverViaByShortCode)(shortCode);
        });
    }
    calculateAmount(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deliverVia, sendingCurrency, receivingCurrency, amount } = body;
            return yield (0, transactions_service_1.calculateAmount)(deliverVia, sendingCurrency, receivingCurrency, amount);
        });
    }
    createTransaction(reqBody, userId, userType, agentId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, common_1.validate)(reqBody, transaction_validation_1.createTransactionJoi);
            return yield (0, transactions_service_1.create)(reqBody, userId, userType, agentId, branchId);
        });
    }
    getBanksByCountry(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getBanksByCountry)(countryId);
        });
    }
    getDeliverViaById(deliverViaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getDeliverViaByID)(deliverViaId);
        });
    }
    createTransactionCancelRequest(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, common_1.validate)(reqBody, transaction_cr_validation_1.reateTransactionCancelJoi);
            return yield (0, transactions_service_1.createTransactionCancelRequest)(reqBody);
        });
    }
    createTransactionChangeNameRequest(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, common_1.validate)(reqBody, transaction_cr_validation_1.createTransactionChangeNameRequestJoi);
            return yield (0, transactions_service_1.createTransactionChangeNameRequest)(reqBody);
        });
    }
    getApplicableStatuses(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getAllowedStatuses)(status);
        });
    }
    update(id, reqBody, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, common_1.validate)(reqBody, transaction_validation_1.updateTransactionJoi);
            return yield (0, transactions_service_1.updateTransaction)(id, userId, reqBody);
        });
    }
    checkComplianceRules(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId, country, currency, deliverVia, amount } = body;
            yield (0, transactions_service_1.checkComplianceRules)(amount, country, senderId, receiverId, deliverVia, currency);
            return 'OK';
        });
    }
    updateStatus(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, transactions_service_1.updateStatus)(transactionId, status);
            return 'OK';
        });
    }
    getTransactionCount(request, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.getTransactionCount)(request.query, type);
        });
    }
    getCountryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, transactions_service_1.countryById)(id);
        });
    }
};
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)(''),
    (0, tsoa_1.Security)('api_jwt', ['TRANSACTION_REPORTS']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactions", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('rate'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getRate", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('fee'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getFee", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('receivingCountries'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getReceivingCountries", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('{countryId}/transferTypes'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionTypesForCountry", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('getDeliverVia'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Query)('countryId')),
    __param(1, (0, tsoa_1.Query)('transferType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getDeliverVia", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('deliver-via/{shortCode}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getDeliverViaByShortCode", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Post)('calculateAmount'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "calculateAmount", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Post)('create'),
    (0, tsoa_1.Security)('jwt', ['SEND_MONEY']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)('user-id')),
    __param(2, (0, tsoa_1.Header)('user-type')),
    __param(3, (0, tsoa_1.Header)('user-agent-id')),
    __param(4, (0, tsoa_1.Header)('user-branch-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('{countryId}/banks'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getBanksByCountry", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('deliverVia/{deliverViaId}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getDeliverViaById", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Post)('cancel-request'),
    (0, tsoa_1.Security)('jwt', ['SEND_MONEY']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransactionCancelRequest", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Post)('change-name-request'),
    (0, tsoa_1.Security)('jwt', ['SEND_MONEY']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransactionChangeNameRequest", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('allowed-statuses/{status}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getApplicableStatuses", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Put)('{id}/update'),
    (0, tsoa_1.Security)('jwt', ['SEND_MONEY']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Header)('user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Post)('check-compliance'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "checkComplianceRules", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Put)('update-status/{transactionId}/{status}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateStatus", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('reports-count/{type}'),
    (0, tsoa_1.Security)('jwt', ['TRANSACTION_REPORTS']),
    (0, tsoa_1.Tags)('Transaction'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionCount", null);
__decorate([
    (0, tsoa_1.SuccessResponse)('200', 'Success'),
    (0, tsoa_1.Get)('/country/{id}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Tags)('Transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getCountryById", null);
TransactionsController = __decorate([
    (0, tsoa_1.Route)('api/transactions')
], TransactionsController);
exports.TransactionsController = TransactionsController;
