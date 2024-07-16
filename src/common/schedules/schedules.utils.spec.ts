import SchedulesUtils from './schedules.utils';
import date from '../../base/utils/date';

describe('ScheduleUtils', () => {
	const tasks = [
		['2023-07-02T09:00:00Z', '2023-07-02T10:00:00Z'],
		['2023-07-02T11:00:00Z', '2023-07-02T12:00:00Z'],
		['2023-07-02T14:00:00Z', '2023-07-02T16:00:00Z'],
		['2023-07-02T14:00:00Z', '2023-07-02T18:00:00Z'],
	];
	it('y1 == x1 && y2 == x2', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T12:00:00.000+03:00'),
				date('2023-07-02T10:00:00Z'),
				tasks,
			),
		).toEqual(true);
	});

	it('y1 == x2 && y2 == x3', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T12:00:00Z'),
				date('2023-07-02T14:00:00Z'),
				tasks,
			),
		).toEqual(false);
	});

	it('y1 > x1 && y2 == x2 && y1 < y2', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T09:01:00Z'),
				date('2023-07-02T10:00:00Z'),
				tasks,
			),
		).toEqual(true);
	});

	it('y1 > x1 && y2 < x2 && y1 < y2', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T09:01:00Z'),
				date('2023-07-02T09:59:00Z'),
				tasks,
			),
		).toEqual(true);
	});

	it('y1 == x1 && y2 < x2 && y1 < y2', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T09:00:00Z'),
				date('2023-07-02T09:59:00Z'),
				tasks,
			),
		).toEqual(true);
	});

	it('y1 > x1 && y2 > x2 && y1 < x2', async () => {
		expect(
			SchedulesUtils.isTaken(
				date('2023-07-02T09:30:00Z'),
				date('2023-07-02T13:00:00Z'),
				tasks,
			),
		).toEqual(true);
	});
});
