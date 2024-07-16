import between from './between';

describe('between', () => {
	it('y > x1 && y < x2', async () => {
		expect(
			between(
				'2023-07-02T20:47:52Z',
				'2023-07-02T20:46:52Z',
				'2023-07-02T20:48:52Z',
			),
		).toEqual(true);
	});

	it('y == x1 && y < x2', async () => {
		expect(
			between(
				'2023-07-02T20:46:52Z',
				'2023-07-02T20:46:52Z',
				'2023-07-02T20:48:52Z',
			),
		).toEqual(true);
	});

	it('y > x1 && y == x2', async () => {
		expect(
			between(
				'2023-07-02T20:48:52Z',
				'2023-07-02T20:46:52Z',
				'2023-07-02T20:48:52Z',
			),
		).toEqual(false);
	});

	it('y < x1 && y < x2', async () => {
		expect(
			between(
				'2023-07-02T20:45:52Z',
				'2023-07-02T20:46:52Z',
				'2023-07-02T20:48:52Z',
			),
		).toEqual(false);
	});
});
