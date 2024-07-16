import { Field, InputType } from '@nestjs/graphql';

@InputType()
class Filter {
	@Field(() => String, { nullable: true })
	comparator: '>' | '<' | '=' | '>=' | '<=' | 'LIKE' | 'IN';

	@Field(() => [String])
	values: [string];

	@Field(() => String)
	field: string;
}

export default Filter;
