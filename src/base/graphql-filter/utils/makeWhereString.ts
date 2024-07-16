import makeSqlProperty from './makeSqlProperty';

const makeWhereString = (
	field: string,
	op: string,
	arr: string[],
	alias: string,
): string => {
	const value = arr.map((v) => `'${v}'`).join(',');
	const prop = makeSqlProperty(alias, field);
	switch (op) {
		case 'IN':
		case 'NOT IN':
			return `${prop} ${op}(${value})`;
		case 'IS':
			return `${prop} ${op} ${arr.join('')}`;
		default:
			return `${prop} ${op} ${value}`;
	}
};

export default makeWhereString;
