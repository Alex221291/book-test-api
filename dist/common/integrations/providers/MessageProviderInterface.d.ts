export interface MessageProviderInterface {
    templates: Record<string, any>;
    setConfig: (params: Record<string, any>) => void;
    setBody: (text: string) => void;
    setRecipient: (to: string) => void;
    send: () => void;
    prepareBody: (template: string, keys: Record<string, any>) => string;
}
