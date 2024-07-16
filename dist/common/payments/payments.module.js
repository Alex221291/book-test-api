"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payments_event_1 = require("./payments.event");
const plans_module_1 = require("../plans/plans.module");
const users_module_1 = require("../users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const payments_entity_1 = require("./payments.entity");
const payments_resolver_1 = require("./payments.resolver");
let PaymentsModule = class PaymentsModule {
};
PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            plans_module_1.PlansModule,
            users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forFeature([payments_entity_1.PaymentsEntity]),
        ],
        providers: [payments_service_1.PaymentsService, payments_event_1.PaymentsEvent, payments_resolver_1.PaymentsResolver],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
exports.PaymentsModule = PaymentsModule;
//# sourceMappingURL=payments.module.js.map