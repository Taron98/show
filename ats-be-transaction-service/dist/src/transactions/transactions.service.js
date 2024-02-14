"use strict";
/** @format */
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
exports.getTransactionCount = exports.publishKafkaMessage = exports.updateStatus = exports.deliverViaByShortCode = exports.countryById = exports.checkComplianceRules = exports.checkPhoneByCountry = exports.updateTransaction = exports.getAllowedStatuses = exports.createTransactionChangeNameRequest = exports.createTransactionCancelRequest = exports.getTransactionById = exports.getDeliverViaByID = exports.prepareTransactionData = exports.create = exports.generateTransactionId = exports.getBanksByCountry = exports.calculateAmount = exports.getDeliverVia = exports.getTransferTypesForCountry = exports.getReceivingCountries = exports.callToRateService = exports.getFee = exports.getRate = exports.getTransactionsByFilter = void 0;
const transactions_manager_1 = require("./transactions.manager");
const transactionsCRManager = __importStar(require("./transactions-cr.manager"));
const dummyData_1 = require("../test/dummyData"); ///TODO Need to Remove this after testing
const common_1 = require("@atservicesv2/common");
const _ = __importStar(require("lodash"));
const kafka = (0, common_1.createKafka)();
const getTransactionsByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield (0, transactions_manager_1.getTransactions)(filter);
    // in the case of search by transactionId no need to query transaction count
    const count = filter.transactionId
        ? transactions.length
        : yield (0, transactions_manager_1.countTransactions)(filter);
    return {
        items: transactions,
        count: count,
    };
});
exports.getTransactionsByFilter = getTransactionsByFilter;
// Dummy data until the task regarding Rate service
const getRate = () => __awaiter(void 0, void 0, void 0, function* () {
    return 3.2;
});
exports.getRate = getRate;
// Dummy data until the task regarding Fee service
const getFee = () => __awaiter(void 0, void 0, void 0, function* () {
    return 22;
});
exports.getFee = getFee;
//dummy function which will be moved to rates service
const callToRateService = (amount, sendingCurrency, receivingCurrency) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield (0, exports.getRate)();
    if (rate && amount) {
        return rate * amount;
    }
    return 1;
});
exports.callToRateService = callToRateService;
const getReceivingCountries = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const { countries } = yield common_1.agentClient.getAgentReceivingCountries(filter);
    let receivingCountryArray = [];
    countries.map(item => {
        let tempCasted = item;
        receivingCountryArray.push({
            _id: tempCasted._id,
            name: tempCasted.name,
            currency: tempCasted.currency,
            ISOCode: tempCasted.ISOCode,
            ISOCode2: tempCasted.ISOCode2,
            phoneCode: tempCasted.phoneCode,
        });
    });
    return { countryList: receivingCountryArray };
});
exports.getReceivingCountries = getReceivingCountries;
const getTransferTypesForCountry = (country) => __awaiter(void 0, void 0, void 0, function* () {
    let deliverViaIds = [];
    dummyData_1.partnerInfo.deliverWith.map(item => deliverViaIds.push(item.id));
    let transferTypes;
    if (country !== null) {
        transferTypes = yield (0, transactions_manager_1.getDistinctTransferTypeByCountryAndId)(country, deliverViaIds);
    }
    return { types: transferTypes } || [];
});
exports.getTransferTypesForCountry = getTransferTypesForCountry;
const getDeliverVia = (country, transferType) => __awaiter(void 0, void 0, void 0, function* () {
    let deliverViaIds = [];
    let deliverViasListCurr = {};
    dummyData_1.partnerInfo.deliverWith.forEach(item => {
        deliverViaIds.push(item.id);
        deliverViasListCurr[item.id] = item.currencies;
    });
    const deliverVias = yield (0, transactions_manager_1.getDeliverViaByIdCountryTransferType)(deliverViaIds, country, transferType);
    let deliverViasList = [];
    deliverVias.forEach(item => {
        deliverViasList.push({
            _id: item._id,
            name: item.name,
            shortCode: item.shortCode,
            currencies: deliverViasListCurr[item.id],
        });
    });
    return { deliverVias: deliverViasList };
});
exports.getDeliverVia = getDeliverVia;
const calculateAmount = (deliverVia, sendingCurrency, receivingCurrency, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const fee = yield (0, exports.getFee)();
    const amountToCollect = amount + fee;
    const calculatedReceivingAmount = yield (0, exports.callToRateService)(amount, sendingCurrency, receivingCurrency);
    return { receivingAmount: calculatedReceivingAmount, amountToCollect: amountToCollect };
});
exports.calculateAmount = calculateAmount;
const getBanksByCountry = (countryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, transactions_manager_1.banksByCountry)(countryId);
});
exports.getBanksByCountry = getBanksByCountry;
const generateTransactionId = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const lastTransactionId = ((_a = (yield (0, transactions_manager_1.getLastRecordedId)())) === null || _a === void 0 ? void 0 : _a.transactionId) || '88938300033';
    let lastTransactionIdSliced = lastTransactionId.toString().slice(0, -3);
    let increment = Number(lastTransactionIdSliced) + 1;
    const min = 100;
    const max = 999;
    const randomPart = Math.floor(Math.random() * (max - min + 1)) + min;
    return increment.toString() + randomPart.toString();
});
exports.generateTransactionId = generateTransactionId;
const create = (transaction, userId, userType, agentId, branchId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const sender = yield common_1.customerClient.getSenderById(transaction.senderId);
    const receiver = yield common_1.customerClient.getReceiverById(transaction.receiverId);
    const activeDocument = (_b = sender === null || sender === void 0 ? void 0 : sender.identificationDocuments) === null || _b === void 0 ? void 0 : _b.find(item => item.status === 'ACTIVE');
    if (!sender) {
        throw new common_1.StatusError(404, 'SENDER_NOT_FOUND', 'Sender not found.');
    }
    else if (sender.status !== 'ACTIVE') {
        throw new common_1.StatusError(404, 'SENDER_INACTIVE', 'The sender is inactive.');
    }
    else if (!activeDocument) {
        throw new common_1.StatusError(404, 'SENDER_DOCUMENT_EXPIRED', 'The sender`s identification document has been expired.');
    }
    yield common_1.customerClient.validateAndRetrieve(transaction.senderId, transaction.deliverVia);
    if (!receiver) {
        throw new common_1.StatusError(404, 'RECEIVER_NOT_FOUND', 'Receiver not found.');
    }
    let bank;
    if (transaction.transferType === 'DEPOSIT') {
        bank = yield (0, transactions_manager_1.getBankById)((_c = transaction.bankInfo) === null || _c === void 0 ? void 0 : _c.bank);
        if (!bank)
            throw new common_1.StatusError(404, 'BANK_NOT_FOUND', 'Bank not found.');
    }
    const deliverVia = yield (0, transactions_manager_1.getDeliverViaByShortCode)(transaction.deliverVia);
    if (!deliverVia) {
        throw new common_1.StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
    }
    yield (0, exports.checkPhoneByCountry)(receiver.phone, transaction.receivingCountryId);
    transaction.deliverVia = deliverVia._id;
    // await checkComplianceRules(
    //   transaction.amount,
    //   transaction.receivingCountryId,
    //   transaction.senderId,
    //   transaction.receiverId,
    //   transaction.deliverVia.toString(),
    //   transaction.sendingCurrency,
    // );
    let agentInfo, branchInfo;
    const user = yield common_1.accountClient.getUsersById(userId);
    const userInfo = { id: user._id, fullName: `${user.firstName} ${user.lastName}` };
    if (userType === 'REGULAR') {
        const [agent, branch] = yield Promise.all([
            common_1.agentClient.getClientById(agentId),
            common_1.agentClient.getBranchById(branchId),
        ]);
        agentInfo = { id: agent._id, fullName: agent.name };
        branchInfo = { id: branch._id, fullName: branch.name };
    }
    const transactionId = yield (0, exports.generateTransactionId)();
    let status = 'WAIT';
    const averageBuyRate = yield common_1.rateClient.getAverageBuyRate(transaction.receivingCountryId, transaction.sendingCurrency);
    const query = yield (0, exports.prepareTransactionData)(transaction, sender, activeDocument, receiver, bank, deliverVia, agentInfo, branchInfo, userInfo, status, transactionId, averageBuyRate);
    let createdTransaction = yield (0, transactions_manager_1.insertTransaction)(query);
    if (userType === 'REGULAR') {
        status = yield withdrawObligo(agentInfo.id, +transaction.amount + transaction.fee, transaction.sendingCurrency, userId, transactionId, createdTransaction.id);
        yield (0, transactions_manager_1.update)(createdTransaction.id, { status });
    }
    yield common_1.customerClient.updateRelationSender(transaction.receiverId, transaction.senderId);
    if (createdTransaction.transferType === 'DEPOSIT' && createdTransaction.bankInfo) {
        yield common_1.customerClient.addReceiverBankAccount(transaction.receiverId, createdTransaction.bankInfo);
    }
    const transactionToReturn = yield (0, transactions_manager_1.getById)(createdTransaction.id);
    if (!transactionToReturn) {
        throw new common_1.StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found.');
    }
    if (transactionToReturn.status === 'WAIT' || transactionToReturn.status === 'PENDING') {
        const receivingCountry = yield (0, transactions_manager_1.getCountryById)(createdTransaction.receivingCountry.toString());
        createdTransaction.receivingCountry = receivingCountry;
        const transactionCreateRequestMsg = mapITransactionToTransactionType(createdTransaction, deliverVia.shortCode, sender, receiver);
        (0, exports.publishKafkaMessage)('transaction-create-request', 'create', transactionCreateRequestMsg, transactionCreateRequestMsg.transactionId);
    }
    return {
        transaction: transactionToReturn,
        message: `Transaction submitted successfully. ${createdTransaction.transactionId}`,
    };
});
exports.create = create;
const prepareTransactionData = (transaction, sender, activeDocument, receiver, bankInfo, deliverVia, agent, branch, user, status, transactionId, averageBuyRate) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    let newTransaction = {
        transactionId: transactionId,
        receivingCountry: transaction.receivingCountryId,
        transferType: transaction.transferType,
        deliverVia: transaction.deliverVia,
        amount: transaction.amount,
        receivingAmount: (0, common_1.roundNumber)(transaction.amount * transaction.rate, 3),
        sendingCurrency: transaction.sendingCurrency,
        receivingCurrency: transaction.receivingCurrency,
        rate: transaction.rate,
        fee: transaction.fee,
        status: status,
        purpose: transaction.purpose,
        refNumber: '',
        deliverViaName: deliverVia.name,
        comment: '',
        reason: '',
        agent,
        branch,
        user,
    };
    newTransaction = Object.assign(Object.assign({}, newTransaction), {
        reportData: {
            buyRate: averageBuyRate,
            currencyProfit: 0.2,
            agentCommission: 15,
            atsCommission: 7,
        },
        senderData: {
            sender: transaction.senderId,
            fullName: sender.fullName,
            city: sender.city,
            address: sender.address,
            nationality: sender.nationality,
            idType: activeDocument.idType,
            idNumber: activeDocument.idNumber,
            idExpDate: activeDocument.expirationDate,
            phoneNumber: sender.phoneNumber,
            dateOfBirth: sender.dateOfBirth,
        },
        receiverData: {
            receiver: transaction.receiverId,
            fullName: receiver.fullName,
            idNumber: receiver.idNumber,
            address: receiver.address,
            phone: receiver.phone,
            city: receiver.city,
        },
    });
    if (transaction.transferType === 'DEPOSIT') {
        newTransaction = Object.assign(Object.assign({}, newTransaction), {
            bankInfo: {
                bank: (_d = transaction.bankInfo) === null || _d === void 0 ? void 0 : _d.bank,
                bankName: bankInfo === null || bankInfo === void 0 ? void 0 : bankInfo.name,
                bankBranch: (_e = transaction.bankInfo) === null || _e === void 0 ? void 0 : _e.bankBranch,
                accountNumber: (_f = transaction.bankInfo) === null || _f === void 0 ? void 0 : _f.accountNumber,
                IFSC: (_g = transaction.bankInfo) === null || _g === void 0 ? void 0 : _g.IFSC,
            },
        });
    }
    return newTransaction;
});
exports.prepareTransactionData = prepareTransactionData;
const getDeliverViaByID = (deliverViaId) => __awaiter(void 0, void 0, void 0, function* () {
    const deliverVia = yield (0, transactions_manager_1.getDeliverViaById)(deliverViaId);
    if (!deliverVia) {
        throw new common_1.StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
    }
    return deliverVia;
});
exports.getDeliverViaByID = getDeliverViaByID;
const getTransactionById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield (0, transactions_manager_1.getById)(transactionId);
    if (!transaction) {
        throw new common_1.StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found.');
    }
    return transaction;
});
exports.getTransactionById = getTransactionById;
const createTransactionCancelRequest = (cancelRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield (0, exports.getTransactionById)(cancelRequest.transactionId);
    if (transaction.status !== 'PENDING' && transaction.status !== 'POSTED') {
        throw new common_1.StatusError(404, 'TRANSACTION_WRONG_STATUS', 'Transaction wrong status.');
    }
    cancelRequest.currentStatus = transaction.status;
    const result = yield transactionsCRManager.createTransactionCancelRequest(cancelRequest);
    if (transaction.status === 'PENDING') {
        yield (0, transactions_manager_1.update)(cancelRequest.transactionId, { status: 'FAILED' });
    }
    else {
        yield (0, transactions_manager_1.addCancelRequest)(cancelRequest.transactionId, result._id);
        const deliverVia = yield (0, transactions_manager_1.getDeliverViaById)(transaction.deliverVia.toString());
        const cancelTransactionRequestType = {
            transactionId: transaction.transactionId,
            deliverViaShortCode: (deliverVia === null || deliverVia === void 0 ? void 0 : deliverVia.shortCode) || '',
        };
        (0, exports.publishKafkaMessage)('transaction-cancel-request', 'cancel', cancelTransactionRequestType, transaction._id.toString());
    }
    return result;
});
exports.createTransactionCancelRequest = createTransactionCancelRequest;
const createTransactionChangeNameRequest = (changeNameRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield (0, exports.getTransactionById)(changeNameRequest.transactionId);
    const receiver = yield common_1.customerClient.getReceiverById(transaction.receiverData.receiver);
    if (transaction.status !== 'PENDING' && transaction.status !== 'POSTED') {
        throw new common_1.StatusError(404, 'TRANSACTION_WRONG_STATUS', 'Transaction wrong status.');
    }
    const oldData = {
        firstName: receiver.firstName,
        middleName: receiver.middleName,
        lastName: receiver.lastName,
    };
    const newData = {
        firstName: changeNameRequest.firstName,
        middleName: changeNameRequest.middleName,
        lastName: changeNameRequest.lastName,
    };
    changeNameRequest.currentStatus = transaction.status;
    const result = yield transactionsCRManager.createTransactionChangeNameRequest(changeNameRequest, oldData);
    if (transaction.status === 'PENDING') {
        const updatedReceiver = yield common_1.customerClient.requestUpdateReceiver(receiver._id, newData);
        yield (0, transactions_manager_1.update)(changeNameRequest.transactionId, {
            'receiverData.fullName': updatedReceiver.fullName,
        });
    }
    else {
        yield (0, transactions_manager_1.addChangeNameRequest)(changeNameRequest.transactionId, result._id);
        const deliverVia = yield (0, transactions_manager_1.getDeliverViaById)(transaction.deliverVia.toString());
        const changeDetailsRequestType = mapITransactionToChangeDetailsRequestType(transaction, receiver, deliverVia === null || deliverVia === void 0 ? void 0 : deliverVia.shortCode);
        (0, exports.publishKafkaMessage)('transaction-change-name-request', 'change', changeDetailsRequestType, transaction.id);
    }
    return result;
});
exports.createTransactionChangeNameRequest = createTransactionChangeNameRequest;
const getAllowedStatuses = (status) => {
    if (!_.has(common_1.AllowedStatuses, status)) {
        throw new common_1.StatusError(400, 'INVALID_STATUS', 'Invalid status');
    }
    return { statuses: common_1.AllowedStatuses[status] };
};
exports.getAllowedStatuses = getAllowedStatuses;
const updateTransaction = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    let transaction = yield (0, transactions_manager_1.getById)(id);
    if (!transaction) {
        throw new common_1.StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
    }
    const user = yield common_1.accountClient.getUsersById(userId || ''); //Need to fix this in the future
    if (!user) {
        throw new common_1.StatusError(404, 'USER_NOT_FOUND', 'User not found');
    }
    const { statuses } = (0, exports.getAllowedStatuses)(transaction.status);
    if (!statuses.includes(data.status)) {
        throw new common_1.StatusError(404, 'NOT_ALLOWED_STATUS', 'Not allowed status');
    }
    transaction.status = data.status;
    transaction.comment = data.comment;
    yield (0, transactions_manager_1.update)(id, transaction);
    if (['FAILED', 'ABORTED'].includes(transaction.status) && user.type !== 'BACKOFFICE') {
        const obligoCredit = {
            transaction: transaction._id,
            transactionId: transaction.transactionId,
            user: userId,
            comment: data.comment,
            amount: +transaction.amount + +transaction.fee,
            currency: transaction.sendingCurrency,
            description: 'Refunded',
        };
        yield common_1.obligoClient.withdraw((_h = transaction.agent) === null || _h === void 0 ? void 0 : _h.id, obligoCredit);
    }
    return transaction;
});
exports.updateTransaction = updateTransaction;
const checkPhoneByCountry = (phone, countryId) => __awaiter(void 0, void 0, void 0, function* () {
    const receivingCountry = yield (0, transactions_manager_1.getCountryById)(countryId);
    if (!receivingCountry) {
        throw new common_1.StatusError(404, 'COUNTRY_NOT_FOUND', 'Country not found.');
    }
    if (!phone.startsWith(receivingCountry.phoneCode)) {
        throw new common_1.StatusError(404, 'WRONG_PHONE_CODE', 'Wrong  phone code.');
    }
    return receivingCountry;
});
exports.checkPhoneByCountry = checkPhoneByCountry;
const checkComplianceRules = (sendingAmount, receivingCountryId, senderId, receiverId, deliverViaId, sendingCurrency) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const complianceRules = yield common_1.complianceClient.getComplianceRules({
        country: receivingCountryId,
        currency: sendingCurrency,
    });
    if (!_.isEmpty(complianceRules)) {
        for (let complianceRuleItem of complianceRules) {
            let filter = {
                receivingCountryId,
                startDate: complianceTypeToStartDate(complianceRuleItem.duration),
            };
            filter =
                complianceRuleItem.type === 'SENDER'
                    ? Object.assign(Object.assign({}, filter), { senderId }) : Object.assign(Object.assign({}, filter), { receiverId });
            const transactionAmount = yield (0, transactions_manager_1.getTransactionsAmountByDate)(filter);
            const total = transactionAmount.reduce((previousValue, currentValue) => previousValue + currentValue.totalAmount, 0);
            if (total + sendingAmount > complianceRuleItem.amount) {
                throw new common_1.StatusError(400, 'COMPLIANCE_RULES_ERROR', 'Amount exceeds allowed limit.');
            }
            else if (complianceRuleItem.deliverViaAmounts &&
                !_.isEmpty(complianceRuleItem.deliverViaAmounts)) {
                const deliverViaAmountLimit = complianceRuleItem.deliverViaAmounts.find(item => deliverViaId === item.deliverVia);
                if (deliverViaAmountLimit) {
                    const deliverViaTotal = ((_j = transactionAmount.find(ta => ta._id.equals(deliverViaId))) === null || _j === void 0 ? void 0 : _j.totalAmount) || 0;
                    if (deliverViaTotal + sendingAmount > deliverViaAmountLimit.amount) {
                        throw new common_1.StatusError(400, 'COMPLIANCE_RULES_ERROR', 'Amount exceeds allowed limit.');
                    }
                }
            }
        }
    }
});
exports.checkComplianceRules = checkComplianceRules;
const countryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const country = yield (0, transactions_manager_1.getCountryById)(id);
    if (!country) {
        throw new common_1.StatusError(404, 'COUNTRY_NOT_FOUND', 'Country not found.');
    }
    return country;
});
exports.countryById = countryById;
const withdrawObligo = (agentId, amount, currency, userId, transactionId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const req = {
        amount,
        currency,
        comment: '',
        description: 'Transaction',
        user: userId,
        transactionId,
        transaction,
    };
    const { balance } = yield common_1.obligoClient.withdraw(agentId, req);
    let status = 'PENDING';
    if (balance < 0) {
        status = 'WAIT_FOR_PROCESS_OBLIGO';
    }
    return status;
});
const deliverViaByShortCode = (shortCode) => __awaiter(void 0, void 0, void 0, function* () {
    const deliverVia = yield (0, transactions_manager_1.getDeliverViaByShortCode)(shortCode);
    if (!deliverVia) {
        throw new common_1.StatusError(404, 'DELIVER_VIA_NOT_FOUND', 'Deliver Via not found.');
    }
    return deliverVia;
});
exports.deliverViaByShortCode = deliverViaByShortCode;
const complianceTypeToStartDate = (duration) => {
    let currentDate = new Date();
    let dayCount = duration === 'DAY' ? 1 : duration === 'MONTH' ? 30 : 365;
    currentDate.setDate(currentDate.getDate() - dayCount);
    return currentDate;
};
const updateStatus = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    let transaction = yield (0, transactions_manager_1.getById)(transactionId);
    if (!transaction) {
        throw new common_1.StatusError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
    }
    transaction.status = status;
    yield (0, transactions_manager_1.update)(transactionId, transaction);
    return 'Updated';
});
exports.updateStatus = updateStatus;
const mapITransactionToTransactionType = (transaction, deliverViaShortCode, sender, receiver) => {
    var _a, _b, _c, _d, _e, _f;
    const receivingCountry = transaction.receivingCountry;
    return {
        senderData: {
            firstName: sender.firstName,
            lastName: sender.lastName,
            middleName: sender.middleName || '',
            city: sender.city,
            address: sender.address,
            nationality: sender.nationality,
            idType: transaction.senderData.idType,
            idNumber: transaction.senderData.idNumber,
            phoneNumber: sender.phoneNumber,
            dateOfBirth: new Date(transaction.senderData.dateOfBirth).toLocaleDateString(),
        },
        receiverData: {
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            middleName: receiver.middleName || '',
            city: receiver.city,
            address: receiver.address,
            idNumber: receiver.idNumber,
            phone: receiver.phone,
        },
        transactionId: transaction.id,
        receivingCountry: {
            name: receivingCountry.name,
            ISOCode: receivingCountry.ISOCode,
            currency: receivingCountry.currency,
            phoneCode: receivingCountry.phoneCode,
        },
        bankInfo: {
            name: (_a = transaction.bankInfo) === null || _a === void 0 ? void 0 : _a.bankName,
            branch: (_b = transaction.bankInfo) === null || _b === void 0 ? void 0 : _b.bankBranch,
            accountNumber: (_c = transaction.bankInfo) === null || _c === void 0 ? void 0 : _c.accountNumber,
            IFSC: (_d = transaction.bankInfo) === null || _d === void 0 ? void 0 : _d.IFSC,
        },
        transferType: transaction.transferType,
        amount: transaction.amount,
        receivingAmount: transaction.receivingAmount,
        sendingCurrency: transaction.sendingCurrency,
        receivingCurrency: transaction.receivingCurrency,
        rate: transaction.rate,
        fee: transaction.fee,
        status: transaction.status,
        purpose: transaction.purpose,
        deliverViaShortCode: deliverViaShortCode,
        comment: transaction.comment,
        user: (_e = transaction.user) === null || _e === void 0 ? void 0 : _e.id,
        agent: (_f = transaction.agent) === null || _f === void 0 ? void 0 : _f.id,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
    };
};
const mapITransactionToChangeDetailsRequestType = (transaction, receiver, deliverViaShortCode) => {
    var _a, _b;
    const receivingCountry = transaction.receivingCountry;
    return {
        transactionId: transaction.transactionId,
        refNum: transaction.refNumber,
        receiverData: {
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            middleName: receiver.middleName || '',
            address: receiver.address,
            phone: receiver.phone,
        },
        deliverViaShortCode: deliverViaShortCode,
        bankInfo: {
            name: (_a = transaction.bankInfo) === null || _a === void 0 ? void 0 : _a.bankName,
            accountNumber: (_b = transaction.bankInfo) === null || _b === void 0 ? void 0 : _b.accountNumber,
        },
    };
};
const publishKafkaMessage = (topic, name, msg, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    kafka.publish({
        topic: topic,
        message: {
            key: JSON.stringify({ name: name, retryCount: 0 }),
            value: JSON.stringify(msg),
            headers: {
                'correlation-id': transactionId,
            },
        },
    });
});
exports.publishKafkaMessage = publishKafkaMessage;
const getTransactionCount = (query, type) => __awaiter(void 0, void 0, void 0, function* () {
    query = Object.assign(Object.assign({}, query), { from: new Date().setUTCHours(0, 0, 0, 0) });
    if (common_1.CountTypeStatuses[type]) {
        query = Object.assign(Object.assign({}, query), { status: common_1.CountTypeStatuses[type] });
    }
    const trans = yield (0, transactions_manager_1.getTransactions)(query);
    return trans.length;
});
exports.getTransactionCount = getTransactionCount;
