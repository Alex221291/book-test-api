import { MessageProviderInterface } from './MessageProviderInterface';
export declare abstract class BaseMessageProvider implements MessageProviderInterface {
    templates: {};
    prepareBody(template: string, keys: Record<string, any>): string;
    send(): void;
    setBody(text: string): void;
    setConfig(params: Record<string, any>): void;
    setRecipient(to: string): void;
}
