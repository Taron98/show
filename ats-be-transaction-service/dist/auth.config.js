"use strict";
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
exports.expressAuthentication = void 0;
const common_1 = require("@atservicesv2/common");
function expressAuthentication(request, securityName, scopes) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtDecoded = yield (0, common_1.identifyTokenAndDecode)(request, securityName);
        if (!jwtDecoded.API_ACCESS) {
            const session = yield common_1.accountClient.getSessionByUserId(jwtDecoded.id);
            yield (0, common_1.authentication)(request, jwtDecoded, session, scopes);
        }
    });
}
exports.expressAuthentication = expressAuthentication;
