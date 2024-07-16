import { Field, InputType } from '@nestjs/graphql';

@InputType()
class SorterType {
	@Field(() => String)
	column: string;

	@Field(() => String)
	direction: 'ASC' | 'DESC';
}

export default SorterType;
