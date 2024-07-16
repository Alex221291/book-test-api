"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateTimes = (from, to, period) => {
    let it = 0;
    const arr = [];
    let date = null;
    do {
        if (date)
            arr.push(date);
        date = from.plus({ minute: period * it++ }).set({
            second: 0,
            millisecond: 0,
        });
    } while (to.diff(date, 'hours').as('hours') >= 0);
    return arr.map((dt) => [
        dt.setZone('UTC').toISO(),
        dt.plus({ minute: period }).setZone('UTC').toISO(),
        dt.setZone('UTC').toISO(),
    ]);
};
exports.default = generateTimes;
//# sourceMappingURL=generateTimes.js.map