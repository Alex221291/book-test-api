"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsProviderType = void 0;
const graphql_1 = require("@nestjs/graphql");
var IntegrationsProviderType;
(function (IntegrationsProviderType) {
    IntegrationsProviderType["SYSTEM_SMS"] = "SYSTEM_SMS";
    IntegrationsProviderType["ROCKET_SMS"] = "ROCKET_SMS";
    IntegrationsProviderType["BOT"] = "TELEGRAM_BOT";
})(IntegrationsProviderType = exports.IntegrationsProviderType || (exports.IntegrationsProviderType = {}));
(0, graphql_1.registerEnumType)(IntegrationsProviderType, {
    name: 'IntegrationsProviderType',
});
//# sourceMappingURL=integrations.provider.type.js.map