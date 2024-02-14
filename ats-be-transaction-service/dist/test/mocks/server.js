"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const node_1 = require("msw/node");
const auth_handler_1 = __importDefault(require("./handlers/auth-handler"));
// import companyHouseHandler from "./handlers/transaction-handler";
const combineHandlers = [...auth_handler_1.default /* ...companyHouseHandler*/];
exports.server = (0, node_1.setupServer)(...combineHandlers);
