const makeSqlProperty = (alias: string, field: string) => {
	return field.indexOf('.') > -1 ? field : `${alias}.${field}`;
};

export default makeSqlProperty;
