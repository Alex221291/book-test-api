import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthModel {
	@Field()
	access_token: string;

	@Field({ nullable: true })
	refresh_token?: string;
}
