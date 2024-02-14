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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/** @format */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const routes_1 = require("../generated/routes");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@atservicesv2/common");
const openapiHtml = fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), './generated/openapi.html'), 'utf-8');
exports.app = (0, express_1.default)();
// Enable CORS in dev
// if (process.env.NODE_ENV === 'development') {
exports.app.use((0, cors_1.default)());
// }
// Use body parser to read sent json payloads
exports.app.use(express_1.default.urlencoded({
    extended: true,
}));
exports.app.use(express_1.default.json());
// Serve OpenAPI UI
exports.app.get('/api/transactions/docs', (_req, res) => {
    res.set('Content-Type', 'text/html');
    return res.send(openapiHtml);
});
// Serve OpenAPI Spec
exports.app.get('/api/transactions/api-spec', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(yield Promise.resolve().then(() => __importStar(require('../generated/swagger.json'))));
}));
// Health check
exports.app.get('/health', (_, res) => res.send('Healthy'));
// Register tsoa
(0, routes_1.RegisterRoutes)(exports.app);
// Register custom error middleware
(0, common_1.GenericErrorMiddleware)(exports.app);
