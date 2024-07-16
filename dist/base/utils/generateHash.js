"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = require("./md5");
const generateRandomCode_1 = require("./generateRandomCode");
const generateHash = () => (0, md5_1.default)(`${Math.floor(Date.now() / 1000)}.${(0, generateRandomCode_1.generateRandomCode)()}`).slice(0, 8);
exports.default = generateHash;
//# sourceMappingURL=generateHash.js.map