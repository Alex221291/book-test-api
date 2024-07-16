"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanTypes = void 0;
const graphql_1 = require("@nestjs/graphql");
var PlanTypes;
(function (PlanTypes) {
    PlanTypes["FREE"] = "FREE";
    PlanTypes["START"] = "START";
    PlanTypes["MEDIUM"] = "MEDIUM";
    PlanTypes["PRO"] = "PRO";
})(PlanTypes = exports.PlanTypes || (exports.PlanTypes = {}));
(0, graphql_1.registerEnumType)(PlanTypes, {
    name: 'PlanTypes',
});
//# sourceMappingURL=users.plan.enum.js.map