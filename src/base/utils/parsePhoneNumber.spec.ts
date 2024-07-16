import parsePhoneNumber from './parsePhoneNumber';

describe('parsePhoneNumber', () => {
	it('+375 (29) 297-07-83 to +375292970783', async () => {
		expect(parsePhoneNumber('+375 (29) 297-07-83')).toEqual('+375292970783');
	});
	it('375 (29) 297-07-83 to +375292970783', async () => {
		expect(parsePhoneNumber('375 (29) 297-07-83')).toEqual('+375292970783');
	});
});
