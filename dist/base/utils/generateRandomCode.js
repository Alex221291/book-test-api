"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
function generateRandomCode(min = 1000, max = 9999) {
    return Math.floor(Math.random() * (max - min) + min);
}
exports.generateRandomCode = generateRandomCode;
//# sourceMappingURL=generateRandomCode.js.map