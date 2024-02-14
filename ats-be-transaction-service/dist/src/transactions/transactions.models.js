"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalFieldsValidation = void 0;
/** @format */
exports.AdditionalFieldsValidation = {
    IFSC: {
        deliverVia: ['YES_BANK_DEPOSIT_IND'],
        path: 'bankInfo.IFSC',
    },
    bankBranch: {
        deliverVia: ['VCBR_DEPOSIT_VNM'],
        path: 'bankInfo.bankBranch',
    },
};
