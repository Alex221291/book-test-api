"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTypes = void 0;
const graphql_1 = require("@nestjs/graphql");
var RoleTypes;
(function (RoleTypes) {
    RoleTypes["NONE"] = "NONE";
    RoleTypes["EMPLOYEE"] = "EMPLOYEE";
    RoleTypes["EMPLOYEE_EXTERNAL"] = "EMPLOYEE_EXTERNAL";
    RoleTypes["ADMIN"] = "ADMIN";
    RoleTypes["ADMIN_EXTERNAL"] = "ADMIN_EXTERNAL";
    RoleTypes["OWNER"] = "OWNER";
})(RoleTypes = exports.RoleTypes || (exports.RoleTypes = {}));
(0, graphql_1.registerEnumType)(RoleTypes, {
    name: 'RoleTypes',
});
//# sourceMappingURL=users.role.enum.js.map