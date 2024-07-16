import { MessageProviderInterface } from './MessageProviderInterface';

export abstract class BaseMessageProvider implements MessageProviderInterface{
	public templates = {};

	prepareBody(template: string, keys: Record<string, any>): string {
		return Object.keys(keys).reduce((acc, key) => {
			const value = keys[key];
			return acc.replace(`{{${key}}}`, value);
		}, template);
	}

	send(): void {
		// todo
	}

	setBody(text: string): void {
		// todo
	}

	setConfig(params: Record<string, any>): void {
		// todo
	}

	setRecipient(to: string): void {
		// todo
	}
}
