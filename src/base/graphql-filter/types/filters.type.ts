import { Field, InputType } from '@nestjs/graphql';
import Filter from './filter.type';

@InputType()
class FiltersExpression {
	@Field(() => String)
	operator: string;

	@Field(() => [Filter])
	filters: Filter[];
}

export default FiltersExpression;
