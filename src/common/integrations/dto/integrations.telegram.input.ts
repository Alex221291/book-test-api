import { Field, InputType } from '@nestjs/graphql';

@InputType('IntegrationsTelegramInput')
export class IntegrationsTelegramInput {
	@Field()
	token: string;

	@Field()
	chatId: string;

	@Field()
	draft: string;

	@Field()
	cancelled: string;
}
