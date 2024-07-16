"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const between = (actual, startOf, endOf, type = 'v1') => {
    const a = actual.diff(startOf, 'seconds').seconds;
    const b = actual.diff(endOf, 'seconds').seconds;
    if (type === 'v2') {
        return a > 0 && b < 0;
    }
    if (type === 'v3') {
        return a >= 0 && b <= 0;
    }
    return a >= 0 && b < 0;
};
exports.default = between;
//# sourceMappingURL=between.js.map