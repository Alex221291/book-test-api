import { DateTime } from 'luxon';
declare const between: (actual: DateTime, startOf: DateTime, endOf: DateTime, type?: 'v1' | 'v2' | 'v3') => boolean;
export default between;
