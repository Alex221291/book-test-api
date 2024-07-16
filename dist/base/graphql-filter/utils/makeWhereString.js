"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeSqlProperty_1 = require("./makeSqlProperty");
const makeWhereString = (field, op, arr, alias) => {
    const value = arr.map((v) => `'${v}'`).join(',');
    const prop = (0, makeSqlProperty_1.default)(alias, field);
    switch (op) {
        case 'IN':
        case 'NOT IN':
            return `${prop} ${op}(${value})`;
        case 'IS':
            return `${prop} ${op} ${arr.join('')}`;
        default:
            return `${prop} ${op} ${value}`;
    }
};
exports.default = makeWhereString;
//# sourceMappingURL=makeWhereString.js.map