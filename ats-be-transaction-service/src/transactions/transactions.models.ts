/** @format */
export const AdditionalFieldsValidation = {
  IFSC: {
    deliverVia: ['YES_BANK_DEPOSIT_IND'],
    path: 'bankInfo.IFSC',
  },
  bankBranch: {
    deliverVia: ['VCBR_DEPOSIT_VNM'],
    path: 'bankInfo.bankBranch',
  },
};
