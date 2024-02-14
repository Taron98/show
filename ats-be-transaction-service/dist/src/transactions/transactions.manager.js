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
exports.getTransactionsAmountByDate = exports.update = exports.addChangeNameRequest = exports.addCancelRequest = exports.getBankById = exports.getById = exports.countTransactions = exports.getTransactions = exports.banksByCountry = exports.insertTransaction = exports.getLastRecordedId = exports.populateCountryByDeliverViaIds = exports.getDistinctTransferTypeByCountryAndId = exports.getDeliverViaByShortCode = exports.getCountryById = exports.getDeliverViaById = exports.getDeliverViaByIdCountryTransferType = void 0;
const common_1 = require("@atservicesv2/common");
const getDeliverViaByIdCountryTransferType = (deliverViaIds, country, transferType) => __awaiter(void 0, void 0, void 0, function* () {
    let query = { _id: { $in: deliverViaIds } };
    common_1.FilterHelper.query(query, 'country', common_1.FilterType.EQUALS, country);
    common_1.FilterHelper.query(query, 'transferType', common_1.FilterType.EQUALS, transferType);
    return common_1.DeliverViaModel.find(query).select('name shortCode');
});
exports.getDeliverViaByIdCountryTransferType = getDeliverViaByIdCountryTransferType;
const getDeliverViaById = (deliverViaId) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.DeliverViaModel.findById(deliverViaId);
});
exports.getDeliverViaById = getDeliverViaById;
const getCountryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.CountryModel.findById(id);
});
exports.getCountryById = getCountryById;
const getDeliverViaByShortCode = (shortCode) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.DeliverViaModel.findOne({ shortCode: shortCode });
});
exports.getDeliverViaByShortCode = getDeliverViaByShortCode;
const getDistinctTransferTypeByCountryAndId = (country, deliverViaIds) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.DeliverViaModel.distinct('transferType', {
        country: country,
        _id: { $in: deliverViaIds },
    });
});
exports.getDistinctTransferTypeByCountryAndId = getDistinctTransferTypeByCountryAndId;
const populateCountryByDeliverViaIds = (deliverViaIds) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.DeliverViaModel.find({
        _id: { $in: deliverViaIds },
    }).populate('country');
});
exports.populateCountryByDeliverViaIds = populateCountryByDeliverViaIds;
const getLastRecordedId = () => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.TransactionSchema.findOne({}, ['transactionId'], { sort: { createdAt: -1 } });
});
exports.getLastRecordedId = getLastRecordedId;
const insertTransaction = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return new common_1.TransactionSchema(query).save();
});
exports.insertTransaction = insertTransaction;
const banksByCountry = (countryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield common_1.BankModel.find({ country: countryId, partner: false });
});
exports.banksByCountry = banksByCountry;
const getTransactions = (filter = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const query = buildGetTransactionsQuery(filter);
    const queryOptions = common_1.FilterHelper.getPagingAndSorting(filter, [
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
    ], 'createdAt');
    return common_1.TransactionSchema.find(query, {}, queryOptions).populate('receivingCountry');
});
exports.getTransactions = getTransactions;
const countTransactions = (filter = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const query = buildGetTransactionsQuery(filter);
    return common_1.TransactionSchema.count(query);
});
exports.countTransactions = countTransactions;
const getById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.TransactionSchema.findOne({ _id: transactionId });
});
exports.getById = getById;
const buildGetTransactionsQuery = filter => {
    const query = {};
    if (filter.transactionId) {
        common_1.FilterHelper.query(query, 'transactionId', common_1.FilterType.EQUALS, filter.transactionId);
        common_1.FilterHelper.query(query, 'deliverVia', common_1.FilterType.EQUALS, filter.deliverVia);
        if (filter.status) {
            common_1.FilterHelper.query(query, 'status', common_1.FilterType.IN, filter.status.toString().split(','));
        }
    }
    else {
        common_1.FilterHelper.query(query, 'createdAt', common_1.FilterType.BETWEEN, {
            from: filter.from,
            to: filter.to,
        });
        common_1.FilterHelper.query(query, 'receivingCountry', common_1.FilterType.EQUALS, filter.receivingCountry);
        common_1.FilterHelper.query(query, 'transferType', common_1.FilterType.EQUALS, filter.transferType);
        common_1.FilterHelper.query(query, 'deliverVia', common_1.FilterType.EQUALS, filter.deliverVia);
        common_1.FilterHelper.query(query, 'agent.fullName', common_1.FilterType.EQUALS, filter.agentName);
        common_1.FilterHelper.query(query, 'user.fullName', common_1.FilterType.EQUALS, filter.userName);
        common_1.FilterHelper.query(query, 'user.id', common_1.FilterType.EQUALS, filter.createdBy);
        common_1.FilterHelper.query(query, 'agent.id', common_1.FilterType.EQUALS, filter.agent);
        if (filter.status) {
            common_1.FilterHelper.query(query, 'status', common_1.FilterType.IN, filter.status.toString().split(','));
        }
        common_1.FilterHelper.query(query, 'sendingCurrency', common_1.FilterType.EQUALS, filter.sendingCurrency);
        common_1.FilterHelper.query(query, [
            'senderData.fullName',
            'senderData.idNumber',
            'senderData.phoneNumber',
            'receiverData.fullName',
            'receiverData.idNumber',
            'receiverData.phone',
            'bankInfo.accountNumber',
            'agent.fullName',
            'user.fullName',
        ], common_1.FilterType.SEARCH_MULTI_EXPR_CONTAINS, filter.search);
    }
    if (filter.currentUserType === 'REGULAR') {
        common_1.FilterHelper.query(query, 'agent.id', common_1.FilterType.EQUALS, filter.agent);
        if (filter.currentUserRole !== 'MANAGER') {
            common_1.FilterHelper.query(query, 'user.id', common_1.FilterType.EQUALS, filter.user);
        }
    }
    return query;
};
const getBankById = (bankId) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.BankModel.findById(bankId);
});
exports.getBankById = getBankById;
const addCancelRequest = (transactionId, cancelRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.TransactionSchema.updateOne({ _id: transactionId }, {
        status: 'REQUEST_CANCEL',
        cancelRequest: cancelRequestId,
    });
});
exports.addCancelRequest = addCancelRequest;
const addChangeNameRequest = (transactionId, changeNameRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    yield common_1.TransactionSchema.updateOne({ _id: transactionId }, {
        status: 'REQUEST_CHANGE',
        changeNameRequest: changeNameRequestId,
    });
});
exports.addChangeNameRequest = addChangeNameRequest;
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return common_1.TransactionSchema.findOneAndUpdate({ _id: id }, data);
});
exports.update = update;
const getTransactionsAmountByDate = (filter = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    common_1.FilterHelper.query(query, 'receivingCountry', common_1.FilterType.EQUALS, common_1.FilterHelper.makeObjectId(filter.receivingCountryId));
    common_1.FilterHelper.query(query, 'senderData.sender', common_1.FilterType.EQUALS, common_1.FilterHelper.makeObjectId(filter.senderId));
    common_1.FilterHelper.query(query, 'receiverData.receiver', common_1.FilterType.EQUALS, common_1.FilterHelper.makeObjectId(filter.receiverId));
    common_1.FilterHelper.query(query, 'createdAt', common_1.FilterType.GREATER, filter.startDate);
    return common_1.TransactionSchema.aggregate([
        {
            $match: query,
        },
        {
            $group: {
                _id: '$deliverVia',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
    ]);
});
exports.getTransactionsAmountByDate = getTransactionsAmountByDate;
