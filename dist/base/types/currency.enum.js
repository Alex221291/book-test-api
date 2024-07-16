"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyTypes = void 0;
const graphql_1 = require("@nestjs/graphql");
var CurrencyTypes;
(function (CurrencyTypes) {
    CurrencyTypes["BYN"] = "BYN";
    CurrencyTypes["RUB"] = "RUB";
    CurrencyTypes["EUR"] = "EUR";
    CurrencyTypes["USD"] = "USD";
})(CurrencyTypes = exports.CurrencyTypes || (exports.CurrencyTypes = {}));
(0, graphql_1.registerEnumType)(CurrencyTypes, {
    name: 'CurrencyTypes',
});
//# sourceMappingURL=currency.enum.js.map