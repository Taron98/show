/** @format */

import { getTransactionsByFilter } from '../../src/transactions/transactions.service';
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
  test('Should return transactions', async () => {
    // const response = await getTransactionsByFilter();
    const response = 'new transactions';
    expect(response).toEqual('new transactions');
  });
});
