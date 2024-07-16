import { registerEnumType } from '@nestjs/graphql';

export enum IntegrationsType {
	SMS = 'SMS',
	TELEGRAM = 'TELEGRAM',
}

registerEnumType(IntegrationsType, {
	name: 'IntegrationsType',
});
