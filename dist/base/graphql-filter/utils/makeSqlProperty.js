"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeSqlProperty = (alias, field) => {
    return field.indexOf('.') > -1 ? field : `${alias}.${field}`;
};
exports.default = makeSqlProperty;
//# sourceMappingURL=makeSqlProperty.js.map