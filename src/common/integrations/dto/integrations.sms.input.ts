import { Field, InputType } from '@nestjs/graphql';
import { IntegrationsProviderType } from '../integrations.provider.type';

@InputType('IntegrationsSmsInput')
export class IntegrationsSmsInput {
	@Field(() => IntegrationsProviderType)
	provider: IntegrationsProviderType;

	@Field()
	code: string;

	@Field()
	draft: string;

	@Field()
	cancelled: string;

	@Field()
	updated: string;

	@Field()
	reminder: string;

	@Field()
	username: string;

	@Field()
	password: string;
}
