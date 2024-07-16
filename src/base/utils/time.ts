import { DateTime } from 'luxon';

const time = (date: DateTime) => {
	return date.toFormat('T');
};

export default time;
