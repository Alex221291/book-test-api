"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plans = exports.AUTH_PLANS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUTH_PLANS_KEY = 'plans';
const Plans = (...plans) => {
    return (0, common_1.SetMetadata)(exports.AUTH_PLANS_KEY, plans);
};
exports.Plans = Plans;
//# sourceMappingURL=auth.plans.decorator.js.map