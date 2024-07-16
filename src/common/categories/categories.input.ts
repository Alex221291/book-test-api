import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType('CategoriesInput')
export class CategoriesInput {
	@Field()
	@IsNotEmpty()
	title: string;
}
