import { DateTime } from 'luxon';

const between = (
	actual: DateTime,
	startOf: DateTime,
	endOf: DateTime,
	type: 'v1' | 'v2' | 'v3' = 'v1',
) => {
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

export default between;
