"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const plans_entity_1 = require("./plans.entity");
const plans_services_1 = require("./plans.services");
const plans_resolver_1 = require("./plans.resolver");
const users_module_1 = require("../users/users.module");
let PlansModule = class PlansModule {
};
PlansModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, typeorm_1.TypeOrmModule.forFeature([plans_entity_1.PlansEntity])],
        providers: [plans_services_1.PlansService, plans_resolver_1.PlansResolver],
        exports: [plans_services_1.PlansService],
    })
], PlansModule);
exports.PlansModule = PlansModule;
//# sourceMappingURL=plans.module.js.map