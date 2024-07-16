import { Field, InputType } from '@nestjs/graphql';

@InputType('UserInput')
export class UserInput {
	@Field({ nullable: true })
	email: string;

	@Field({ nullable: true })
	phone: string;

	@Field({ nullable: true })
	password: string;

	@Field({ nullable: true })
	birthday: Date;
}
