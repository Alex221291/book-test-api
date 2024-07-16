"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsType = void 0;
const graphql_1 = require("@nestjs/graphql");
var IntegrationsType;
(function (IntegrationsType) {
    IntegrationsType["SMS"] = "SMS";
    IntegrationsType["TELEGRAM"] = "TELEGRAM";
})(IntegrationsType = exports.IntegrationsType || (exports.IntegrationsType = {}));
(0, graphql_1.registerEnumType)(IntegrationsType, {
    name: 'IntegrationsType',
});
//# sourceMappingURL=integrations.type.js.map