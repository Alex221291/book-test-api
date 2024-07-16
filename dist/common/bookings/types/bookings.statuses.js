"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsStatuses = void 0;
const graphql_1 = require("@nestjs/graphql");
var BookingsStatuses;
(function (BookingsStatuses) {
    BookingsStatuses["PREPARED"] = "PREPARED";
    BookingsStatuses["COMPLETED"] = "COMPLETED";
    BookingsStatuses["CANCELLED"] = "CANCELLED";
    BookingsStatuses["PAID"] = "PAID";
})(BookingsStatuses = exports.BookingsStatuses || (exports.BookingsStatuses = {}));
(0, graphql_1.registerEnumType)(BookingsStatuses, {
    name: 'BookingStatuses',
});
//# sourceMappingURL=bookings.statuses.js.map