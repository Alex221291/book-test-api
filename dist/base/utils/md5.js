"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function md5(value) {
    return crypto.createHash('md5').update(value).digest('hex');
}
exports.default = md5;
//# sourceMappingURL=md5.js.map