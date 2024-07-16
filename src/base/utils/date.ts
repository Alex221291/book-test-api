import * as luxon from 'luxon';

const date = (iso?: string, zone?: string) => {
	let date = luxon.DateTime.now();
	if (iso) {
		date = luxon.DateTime.fromISO(iso) as luxon.DateTime<true>; //добавил as
		if (zone) {
			date = date.setZone(zone) as luxon.DateTime<true>; //добавил as
		}
	}
	return date;
};

export default date;
