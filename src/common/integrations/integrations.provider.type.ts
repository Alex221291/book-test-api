import { registerEnumType } from '@nestjs/graphql';

export enum IntegrationsProviderType {
	SYSTEM_SMS = 'SYSTEM_SMS',
	ROCKET_SMS = 'ROCKET_SMS',
	BOT = 'TELEGRAM_BOT',
}

registerEnumType(IntegrationsProviderType, {
	name: 'IntegrationsProviderType',
});
