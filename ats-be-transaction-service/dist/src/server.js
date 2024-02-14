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
const common_1 = require("@atservicesv2/common");
const app_1 = require("./app");
const common_2 = require("@atservicesv2/common");
const port = process.env.PORT || 3000;
const logger = (0, common_2.Logger)({
    service: __filename,
});
app_1.app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    // Notify the developer
    logger.info(`The service has been started successfully on port ${port}!`);
    yield (0, common_1.openConnectionToDb)();
    // List all routes
    app_1.app._router.stack
        .filter(r => r.route)
        .map(r => {
        const method = Object.keys(r.route.methods)[0];
        const path = `http://localhost:${port}${r.route.path}`;
        const formatString = '\x1b[36m%s\x1b[0m\t\x1b[33m%s\x1b[0m';
        logger.info(formatString, method, path);
    });
}));
