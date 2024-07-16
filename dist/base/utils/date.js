"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon = require("luxon");
const date = (iso, zone) => {
    let date = luxon.DateTime.now();
    if (iso) {
        date = luxon.DateTime.fromISO(iso);
        if (zone) {
            date = date.setZone(zone);
        }
    }
    return date;
};
exports.default = date;
//# sourceMappingURL=date.js.map