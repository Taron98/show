"use strict";
// /** @format */
// import { rest } from "msw";
// import companyHouseSearchResultResponseMock from "../../assets/company-house/company-house-search-result-response.json";
// import companyHouseGetByNumberResponseMock from "../../assets/company-house/company-house-get-by-number-response.json";
// import companyHouseOfficersGetByNumberResponseMock from "../../assets/company-house/company-house-officers-get-by-number-response.json";
// import companyHousePSCsGetByNumberResponseMock from "../../assets/company-house/company-house-pscs-get-by-number-response.json";
// const handlers = [
//   rest.get(
//     /api\.company-information\.service\.gov\.uk\/search\/companies/,
//     (req, res, ctx) => {
//       return res(
//         ctx.status(200),
//         ctx.set("Content-Type", "application/json"),
//         ctx.json(companyHouseSearchResultResponseMock)
//       );
//     }
//   ),
//   rest.get(
//     /api\.company-information\.service\.gov\.uk\/company\/10511092\/officers/,
//     (req, res, ctx) => {
//       return res(
//         ctx.status(200),
//         ctx.set("Content-Type", "application/json"),
//         ctx.json(companyHouseOfficersGetByNumberResponseMock)
//       );
//     }
//   ),
//   rest.get(
//     /api\.company-information\.service\.gov\.uk\/company\/10511092\/persons-with-significant-control/,
//     (req, res, ctx) => {
//       return res(
//         ctx.status(200),
//         ctx.set("Content-Type", "application/json"),
//         ctx.json(companyHousePSCsGetByNumberResponseMock)
//       );
//     }
//   ),
//   rest.get(
//     /api\.company-information\.service\.gov\.uk\/company/,
//     (req, res, ctx) => {
//       return res(
//         ctx.status(200),
//         ctx.set("Content-Type", "application/json"),
//         ctx.json(companyHouseGetByNumberResponseMock)
//       );
//     }
//   ),
// ];
// export default handlers;
