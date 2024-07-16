"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.AUTH_ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUTH_ROLE_KEY = 'roles';
const Roles = (...roles) => {
    return (0, common_1.SetMetadata)(exports.AUTH_ROLE_KEY, roles);
};
exports.Roles = Roles;
//# sourceMappingURL=auth.role.decorator.js.map