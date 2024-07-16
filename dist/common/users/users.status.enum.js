"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
var UsersStatus;
(function (UsersStatus) {
    UsersStatus["UNCOMPLETED"] = "REGISTRATION_INCOMPLETE";
    UsersStatus["COMPLETED"] = "REGISTRATION_COMPLETED";
    UsersStatus["OVERDUE"] = "OVERDUE";
})(UsersStatus = exports.UsersStatus || (exports.UsersStatus = {}));
(0, graphql_1.registerEnumType)(UsersStatus, {
    name: 'UsersStatus',
});
//# sourceMappingURL=users.status.enum.js.map