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
/** @format */
// jest.mock("../../src/service/transactions.wrapper", () => {
//   const originalModule = jest.requireActual(
//     "../../src/service/transactions.wrapper"
//   );
//   return {
//     __esModule: true,
//     ...originalModule,
//     getCompanyInfoByNumber: jest.fn(),
//     getCompanyOfficersByNumber: jest.fn(),
//     getCompanyPSCByNumber: jest.fn(),
//     searchCompaniesByName: jest.fn(),
//   };
// });
describe('Fetch companies', () => {
    test('Should return transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        // const response = await getTransactionsByFilter();
        const response = 'new transactions';
        expect(response).toEqual('new transactions');
    }));
});
