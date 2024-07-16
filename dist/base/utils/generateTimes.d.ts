import { DateTime } from 'luxon';
declare const generateTimes: (from: DateTime, to: DateTime, period: number) => string[][];
export default generateTimes;
