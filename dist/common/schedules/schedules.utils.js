"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const between_1 = require("../../base/utils/between");
const date_1 = require("../../base/utils/date");
class SchedulesUtils {
    static isTaken(s, f, tasks) {
        let hasTime = false;
        for (const [_s, _f] of tasks) {
            const _sD = (0, date_1.default)(_s);
            const _fD = (0, date_1.default)(_f);
            if ((0, between_1.default)(s, _sD, _fD) ||
                (0, between_1.default)(f, _sD, _fD, 'v2') ||
                (0, between_1.default)(_sD, s, f, 'v2') ||
                (0, between_1.default)(_fD, s, f, 'v2')) {
                hasTime = true;
            }
        }
        return hasTime;
    }
    static getFreeTimes(startOfDate, endOfDate, schedules, employeeId, duration, pitch = 15) {
        const tasks = schedules.map(({ sinceDate, untilDate }) => [
            sinceDate.toISOString(),
            untilDate.toISOString(),
        ]);
        let startOf = luxon_1.DateTime.fromMillis(startOfDate.toMillis());
        const endOf = luxon_1.DateTime.fromMillis(endOfDate.toMillis());
        const payload = [];
        do {
            const s = startOf;
            const f = startOf.plus({ minutes: duration });
            const isBetween = (0, between_1.default)(f, startOf, endOf, 'v3');
            if (tasks.length > 0) {
                if (isBetween && !SchedulesUtils.isTaken(s, f, tasks)) {
                    payload.push([employeeId, s.toISO(), f.toISO()]);
                }
            }
            else if (isBetween) {
                payload.push([employeeId, s.toISO(), f.toISO()]);
            }
            startOf = startOf.plus({ minutes: pitch });
        } while (startOf.diff(endOf, 'minutes').minutes <= 0);
        return payload;
    }
    static async getTimePeriods(schedules, startOfDate, endOfDate, startWork, finishWork) {
        const slots = schedules
            .filter((schedule) => {
            const startOf = (0, date_1.default)(schedule.sinceDate.toISOString());
            const endOf = (0, date_1.default)(schedule.untilDate.toISOString());
            const _s = startOfDate;
            const _f = endOfDate;
            return ((0, between_1.default)(startOf, _s, _f) ||
                (0, between_1.default)(endOf, _s, _f, 'v2') ||
                (0, between_1.default)(_s, startOf, endOf, 'v2') ||
                (0, between_1.default)(_f, startOf, endOf, 'v2'));
        })
            .map(({ sinceDate, untilDate }) => ({ sinceDate, untilDate }))
            .sort((a, b) => {
            return a.sinceDate.getTime() - b.sinceDate.getTime();
        });
        return [
            {
                sinceDate: startWork.toJSDate(),
                untilDate: startWork.toJSDate(),
            },
            ...slots,
            {
                sinceDate: finishWork.toJSDate(),
                untilDate: finishWork.toJSDate(),
            },
        ];
    }
    static async freeTimeCalculation(periods, duration, dt, employeeId) {
        const blocks = periods.map(({ untilDate }, i) => {
            let pause = 0;
            const nextElement = periods.find((_, index) => index === i + 1);
            if (nextElement) {
                pause = (0, date_1.default)(nextElement.sinceDate.toISOString()).diff((0, date_1.default)(untilDate.toISOString()), 'minutes').minutes;
            }
            if (pause < duration || pause < 0) {
                pause = 0;
            }
            return pause;
        });
        return [dt.toISO(), blocks.reduce((a, b) => a + b, 0), employeeId];
    }
}
exports.default = SchedulesUtils;
//# sourceMappingURL=schedules.utils.js.map