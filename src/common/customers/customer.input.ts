import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CustomerEntity } from './customer.entity';

@InputType('CustomerInput')
export class CustomerInput extends PartialType(CustomerEntity) {
	@Field()
	phone: string;

	@Field({ nullable: true })
	firstName?: string;

	@Field({ nullable: true })
	lastName?: string;

	@Field({ nullable: true })
	loyalty?: string;

	@Field(() => Int, { nullable: true })
	blocked?: number;

	@Field({ nullable: true })
	gender?: string;

	@Field({ nullable: true })
	notes?: string;

	@Field({ nullable: true })
	birthday?: Date;
}
