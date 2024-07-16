import { DateTime } from 'luxon';

const generateTimes = (
	from: DateTime,
	to: DateTime,
	period: number,
): string[][] => {
	let it = 0;
	const arr: DateTime[] = [];
	let date = null;
	do {
		if (date) arr.push(date);
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

export default generateTimes;
