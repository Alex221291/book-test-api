"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const schedules_service_1 = require("./schedules.service");
const typeorm_1 = require("@nestjs/typeorm");
const schedules_entity_1 = require("./schedules.entity");
const schedules_resolver_1 = require("./schedules.resolver");
const employees_module_1 = require("../employees/employees.module");
const services_module_1 = require("../services/services.module");
const groups_module_1 = require("../groups/groups.module");
const offices_module_1 = require("../offices/offices.module");
const bookings_module_1 = require("../bookings/bookings.module");
let SchedulesModule = class SchedulesModule {
};
SchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            employees_module_1.EmployeesModule,
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            offices_module_1.OfficesModule,
            (0, common_1.forwardRef)(() => groups_module_1.GroupsModule),
            (0, common_1.forwardRef)(() => bookings_module_1.BookingsModule),
            typeorm_1.TypeOrmModule.forFeature([schedules_entity_1.ScheduleEntity]),
        ],
        providers: [schedules_service_1.ScheduleService, schedules_resolver_1.ScheduleResolver],
        exports: [schedules_service_1.ScheduleService],
    })
], SchedulesModule);
exports.SchedulesModule = SchedulesModule;
//# sourceMappingURL=schedules.module.js.map