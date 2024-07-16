import { Field, InputType, PartialType } from '@nestjs/graphql';
import { TagsEntity } from './tags.entity';

@InputType('TagsInput')
export class TagsInput extends PartialType(TagsEntity) {
	@Field()
	title: string;

	@Field()
	color: string;
}
