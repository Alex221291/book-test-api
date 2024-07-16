"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScheduleStatuses1695636218504 = void 0;
const bookings_statuses_1 = require("../common/bookings/types/bookings.statuses");
class UpdateScheduleStatuses1695636218504 {
    async up(queryRunner) {
        await queryRunner.query(`UPDATE schedule sc INNER JOIN bookings_schedules_schedule bss on sc.id = bss.scheduleId LEFT JOIN bookings b ON b.id = bss.bookingsId SET sc.cancelled = 1 WHERE b.status = '${bookings_statuses_1.BookingsStatuses.CANCELLED}'`);
        await queryRunner.query(`UPDATE schedule sc INNER JOIN bookings_schedules_schedule bss on sc.id = bss.scheduleId LEFT JOIN bookings b ON b.id = bss.bookingsId SET sc.cancelled = 0 WHERE b.status != '${bookings_statuses_1.BookingsStatuses.CANCELLED}'`);
    }
    async down(queryRunner) {
    }
}
exports.UpdateScheduleStatuses1695636218504 = UpdateScheduleStatuses1695636218504;
//# sourceMappingURL=1695636218504-UpdateScheduleStatuses.js.map