"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingStatuses1700765154636 = void 0;
const bookings_statuses_1 = require("../common/bookings/types/bookings.statuses");
class UpdateBookingStatuses1700765154636 {
    async up(queryRunner) {
        await queryRunner.query(`UPDATE bookings b SET b.status = '${bookings_statuses_1.BookingsStatuses.PREPARED}' WHERE b.status IN('DRAFT', 'ACTIVE')`);
    }
    async down(queryRunner) { }
}
exports.UpdateBookingStatuses1700765154636 = UpdateBookingStatuses1700765154636;
//# sourceMappingURL=1700765154636-UpdateBookingStatuses.js.map