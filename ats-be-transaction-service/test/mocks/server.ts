/** @format */

import { setupServer } from "msw/node";
import authHandler from "./handlers/auth-handler";
// import companyHouseHandler from "./handlers/transaction-handler";

const combineHandlers = [...authHandler /* ...companyHouseHandler*/];
export const server = setupServer(...combineHandlers);
