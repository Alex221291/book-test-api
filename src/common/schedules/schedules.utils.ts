import { ScheduleEntity } from './schedules.entity';
import { DateTime } from 'luxon';
import between from '../../base/utils/between';
import date from '../../base/utils/date';

class SchedulesUtils {
	static isTaken(s: DateTime, f: DateTime, tasks: any[]) {
		let hasTime = false;
		for (const [_s, _f] of tasks) {
			const _sD = date(_s);
			const _fD = date(_f);
			if (
				between(s, _sD, _fD) ||
				between(f, _sD, _fD, 'v2') ||
				between(_sD, s, f, 'v2') ||
				between(_fD, s, f, 'v2')
			) {
				hasTime = true;
			}
		}
		return hasTime;
	}

	static getFreeTimes(
		startOfDate: DateTime,
		endOfDate: DateTime,
		schedules: Array<ScheduleEntity>,
		employeeId,
		duration,
		pitch = 15,
	): [[number?, string?, string?]?] {
		const tasks = schedules.map(({ sinceDate, untilDate }) => [
			sinceDate.toISOString(),
			untilDate.toISOString(),
		]);
		let startOf = DateTime.fromMillis(startOfDate.toMillis());
		const endOf = DateTime.fromMillis(endOfDate.toMillis());
		const payload: [[number?, string?, string?]?] = [];
		do {
			const s = startOf;
			const f = startOf.plus({ minutes: duration });
			const isBetween = between(f, startOf, endOf, 'v3');
			if (tasks.length > 0) {
				if (isBetween && !SchedulesUtils.isTaken(s, f, tasks)) {
					payload.push([employeeId, s.toISO(), f.toISO()]);
				}
			} else if (isBetween) {
				payload.push([employeeId, s.toISO(), f.toISO()]);
			}
			startOf = startOf.plus({ minutes: pitch });
		} while (startOf.diff(endOf, 'minutes').minutes <= 0);
		return payload;
	}

	static async getTimePeriods(
		schedules: Array<ScheduleEntity>,
		startOfDate: DateTime,
		endOfDate: DateTime,
		startWork: DateTime,
		finishWork: DateTime,
	) {
		const slots = schedules
			.filter((schedule) => {
				const startOf = date(schedule.sinceDate.toISOString());
				const endOf = date(schedule.untilDate.toISOString());
				const _s = startOfDate;
				const _f = endOfDate;
				return (
					between(startOf, _s, _f) ||
					between(endOf, _s, _f, 'v2') ||
					between(_s, startOf, endOf, 'v2') ||
					between(_f, startOf, endOf, 'v2')
				);
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

	static async freeTimeCalculation(
		periods: Array<{ sinceDate: Date; untilDate: Date }>,
		duration: number,
		dt: DateTime,
		employeeId: number,
	) {
		const blocks = periods.map(({ untilDate }, i) => {
			let pause = 0;
			const nextElement = periods.find((_, index) => index === i + 1);
			if (nextElement) {
				pause = date(nextElement.sinceDate.toISOString()).diff(
					date(untilDate.toISOString()),
					'minutes',
				).minutes;
			}
			if (pause < duration || pause < 0) {
				pause = 0;
			}
			return pause;
		});
		return [dt.toISO(), blocks.reduce((a, b) => a + b, 0), employeeId];
	}
}

export default SchedulesUtils;
