"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScheduleResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const schedules_service_1 = require("./schedules.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const schedules_entity_1 = require("./schedules.entity");
const schedules_input_1 = require("./schedules.input");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const employees_service_1 = require("../employees/employees.service");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const services_service_1 = require("../services/services.service");
const groups_service_1 = require("../groups/groups.service");
const offices_service_1 = require("../offices/offices.service");
const bookings_service_1 = require("../bookings/bookings.service");
const date_1 = require("../../base/utils/date");
const schedules_utils_1 = require("./schedules.utils");
const event_emitter_1 = require("@nestjs/event-emitter");
const bookings_statuses_1 = require("../bookings/types/bookings.statuses");
const bookings_event_1 = require("../bookings/bookings.event");
const schedules_type_1 = require("./types/schedules.type");
const class_transformer_1 = require("class-transformer");
const luxon_1 = require("luxon");
let ScheduleResolver = ScheduleResolver_1 = class ScheduleResolver {
    constructor(scheduleService, employeeService, servicesService, groupService, officesService, bookingsService, eventEmitter) {
        this.scheduleService = scheduleService;
        this.employeeService = employeeService;
        this.servicesService = servicesService;
        this.groupService = groupService;
        this.officesService = officesService;
        this.bookingsService = bookingsService;
        this.eventEmitter = eventEmitter;
    }
    async addScheduleEvent(user, companyId, payload) {
        const entity = await this.scheduleService.prepareEntity(new schedules_entity_1.ScheduleEntity(), payload, companyId, user.id, payload.extraDuration);
        if (entity) {
            const office = await this.officesService.findOneBy({
                id: entity.employee.office.id,
            });
            if ([schedules_type_1.SchedulesType.DEFAULT, schedules_type_1.SchedulesType.GROUP].includes(entity.type)) {
                if (!this.scheduleService.validateWorkingHours(office, entity.sinceDate.toISOString(), entity.untilDate.toISOString())) {
                    throw new common_1.NotFoundException('notifications.time.unavailable');
                }
            }
            if (await this.scheduleService.validateTimePeriod(companyId, entity.employee.id, entity.sinceDate.toISOString(), entity.untilDate.toISOString(), null, null, payload.bookingId)) {
                return await this.scheduleService.add(entity);
            }
            else {
                throw new common_1.NotFoundException('notifications.time.booked');
            }
        }
    }
    async updateScheduleTime(user, id, sinceDate, untilDate) {
        const schedule = await this.scheduleService.getScheduleById(id, user);
        if (schedule) {
            return await this.scheduleService.update(this.scheduleService.repository.merge(schedule, {
                sinceDate,
                untilDate,
            }));
        }
        throw new common_1.NotFoundException('notifications.entity.not.found');
    }
    async updateScheduleEvent(user, id, companyId, payload) {
        const schedule = await this.scheduleService.getScheduleById(id, user);
        if (schedule) {
            const entity = await this.scheduleService.prepareEntity(schedule, payload, companyId, user.id, payload.extraDuration);
            const office = await this.officesService.findOneBy({
                id: entity.employee.office.id,
            });
            if ([schedules_type_1.SchedulesType.DEFAULT, schedules_type_1.SchedulesType.GROUP].includes(entity.type)) {
                if (!this.scheduleService.validateWorkingHours(office, entity.sinceDate.toISOString(), entity.untilDate.toISOString())) {
                    throw new common_1.NotFoundException('notifications.time.unavailable');
                }
            }
            if (await this.scheduleService.validateTimePeriod(companyId, entity.employee.id, entity.sinceDate.toISOString(), entity.untilDate.toISOString(), entity.id)) {
                await this.scheduleService.update(entity);
                if (entity.bookings) {
                    for (const booking of entity.bookings) {
                        if (booking.status === bookings_statuses_1.BookingsStatuses.PREPARED) {
                            this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_UPDATED_BY_ADMIN, await this.bookingsService.findOneBy({ id: booking.id }, {
                                office: {
                                    company: {},
                                },
                            }));
                        }
                    }
                }
                return this.scheduleService.getScheduleById(schedule.id, user);
            }
            else {
                throw new common_1.NotFoundException('notifications.time.booked');
            }
        }
        else {
            throw new common_1.NotFoundException('notifications.entity.not.found');
        }
    }
    async getSchedule(user, companyId, filters, employeeIds, sinceDate, untilDate) {
        const data = await this.scheduleService.getScheduleByDates(filters, user.id, companyId, employeeIds, sinceDate, untilDate);
        return (0, class_transformer_1.classToPlain)(data, { groups: [user.role] });
    }
    async getScheduleById(user, id) {
        const data = await this.scheduleService.getScheduleById(id, user);
        return (0, class_transformer_1.classToPlain)(data, { groups: [user.role] });
    }
    async getScheduleAvailableDates(officeId, employeeIds, since, until, serviceIds = []) {
        let sinceDate = luxon_1.DateTime.fromISO(since);
        const untilDate = luxon_1.DateTime.fromISO(until);
        const services = await this.servicesService.findServicesByIds(employeeIds, serviceIds);
        const duration = services.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.duration;
        }, 0);
        const payload = [];
        while (untilDate.diff(sinceDate, 'day').days >= 0) {
            const startDay = sinceDate;
            const endDay = startDay.plus({ hour: 23, minute: 59, second: 59 });
            const [startWork, finishWork] = await this.officesService.getOfficeWorkTime(officeId, endDay);
            if (startWork && finishWork) {
                for (const employeeId of employeeIds) {
                    const schedules = await this.scheduleService.getScheduleTimesByDate([employeeId], startWork.toISO(), finishWork.toISO());
                    const slots = await schedules_utils_1.default.getTimePeriods(schedules, startDay, endDay, startWork, finishWork);
                    payload.push(await schedules_utils_1.default.freeTimeCalculation(slots, duration, sinceDate, employeeId));
                }
            }
            else {
                payload.push([sinceDate.toISO(), 0, 0]);
            }
            sinceDate = sinceDate.plus({ days: 1 });
        }
        return Object.entries(payload.reduce((arr, el) => {
            const [key, val] = el;
            if (!arr[key]) {
                arr[key] = val;
            }
            else {
                arr[key] += val;
            }
            return arr;
        }, {}));
    }
    async getScheduleAvailableTimes(officeId, serviceIds, employeeIds, dt, extraDuration = 0, excludeScheduleIds = [], pitch = 15) {
        const sinceDate = (0, date_1.default)(dt);
        const untilDate = sinceDate.plus({ hour: 23, minute: 59, second: 59 });
        const schedule = await this.scheduleService.getScheduleTimesByDate(employeeIds, sinceDate.toISO(), untilDate.toISO(), excludeScheduleIds);
        const office = await this.officesService.findOneBy({
            id: officeId,
        });
        const services = await this.servicesService.findServicesByIds(employeeIds, serviceIds);
        if (services.length > 0 &&
            services.length === serviceIds.length &&
            office) {
            const [startWork, finishWork] = await this.officesService.getOfficeWorkTime(officeId, untilDate);
            if (startWork && finishWork) {
                const duration = services.reduce((previousValue, currentValue) => {
                    return previousValue + currentValue.duration;
                }, extraDuration);
                const result = [];
                for (const eId of employeeIds) {
                    const tasks = schedule.filter(({ employee }) => employee.id === eId);
                    schedules_utils_1.default.getFreeTimes(startWork, finishWork, tasks, eId, duration, pitch).forEach((el) => {
                        const [id, iso] = el;
                        const found = result.find((o) => o[1] === iso);
                        if (!found) {
                            result.push([id, iso]);
                        }
                    });
                }
                return result
                    .sort((a, b) => {
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    return 0;
                })
                    .filter(([, iso]) => luxon_1.DateTime.fromISO(iso).diffNow('minute').minutes > 0);
            }
        }
        return [];
    }
    async getGroupScheduleEvents(company, employeeIds, serviceIds, dt) {
        const startOf = (0, date_1.default)(dt).startOf('day');
        const endOf = startOf.endOf('day');
        return this.scheduleService.findAllGroupSchedules(startOf, endOf, employeeIds, serviceIds, company);
    }
    async removeSchedule(user, companyId, id) {
        const entity = await this.scheduleService.getScheduleById(id, user);
        if (entity === null || entity === void 0 ? void 0 : entity.id) {
            await this.scheduleService.remove(entity === null || entity === void 0 ? void 0 : entity.id);
            return true;
        }
        return false;
    }
    async cancelSchedule(user, id) {
        const entity = await this.scheduleService.getScheduleById(id, user);
        if (entity === null || entity === void 0 ? void 0 : entity.id) {
            entity.cancelled = 1;
            return await this.scheduleService.update(entity);
        }
        throw new common_1.NotFoundException('notifications.entity.not.found');
    }
    async addScheduleToBooking(user, companyId, bookingId, id) {
        const entity = await this.scheduleService.getScheduleById(id, user);
        if (entity) {
            const builder = this.bookingsService.getSelectQueryBuilder();
            builder
                .andWhere('e.id = :id', { id: bookingId })
                .andWhere('company.hash = :hash', { hash: companyId })
                .andWhere('users.id IN (:userId)', { userId: user.id });
            const booking = await builder.getOne();
            if (booking) {
                entity.bookings.push(booking);
            }
            return await this.scheduleService.update(entity);
        }
        throw new common_1.NotFoundException('notifications.entity.not.found');
    }
    async removeBookingFromSchedule(user, companyId, bookingId, id) {
        const entity = await this.scheduleService.getScheduleById(id, user);
        if (entity) {
            entity.bookings = entity.bookings.filter(({ id }) => id !== bookingId);
            await this.scheduleService.update(entity);
            if (entity.bookings.length === 0) {
                await this.scheduleService.remove(entity.id);
            }
            return true;
        }
        throw new common_1.NotFoundException('notifications.entity.not.found');
    }
};
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, schedules_input_1.ScheduleInput]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "addScheduleEvent", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('sinceDate', { type: () => Date, nullable: true })),
    __param(3, (0, graphql_1.Args)('untilDate', { type: () => Date, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "updateScheduleTime", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('companyId')),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number, String, schedules_input_1.ScheduleInput]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "updateScheduleEvent", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [schedules_entity_1.ScheduleEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(3, (0, graphql_1.Args)('employeeIds', { type: () => [graphql_1.Int], nullable: true })),
    __param(4, (0, graphql_1.Args)('sinceDate', { nullable: true })),
    __param(5, (0, graphql_1.Args)('untilDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Array, Array, String, String]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getScheduleById", null);
__decorate([
    (0, graphql_1.Query)(() => [[String, Number]]),
    __param(0, (0, graphql_1.Args)('officeId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('employeeIds', { type: () => [graphql_1.Int] })),
    __param(2, (0, graphql_1.Args)('sinceDate')),
    __param(3, (0, graphql_1.Args)('untilDate')),
    __param(4, (0, graphql_1.Args)('serviceIds', { type: () => [graphql_1.Int], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, String, String, Array]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getScheduleAvailableDates", null);
__decorate([
    (0, graphql_1.Query)(() => [[String, String]]),
    __param(0, (0, graphql_1.Args)('officeId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('serviceIds', { type: () => [graphql_1.Int] })),
    __param(2, (0, graphql_1.Args)('employeeIds', { type: () => [graphql_1.Int] })),
    __param(3, (0, graphql_1.Args)('date')),
    __param(4, (0, graphql_1.Args)('extraDuration', { nullable: true, type: () => graphql_1.Int })),
    __param(5, (0, graphql_1.Args)('excludeScheduleIds', { nullable: true, type: () => [graphql_1.Int] })),
    __param(6, (0, graphql_1.Args)('pitch', { nullable: true, type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Array, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getScheduleAvailableTimes", null);
__decorate([
    (0, graphql_1.Query)(() => [schedules_entity_1.ScheduleEntity]),
    __param(0, (0, graphql_1.Args)('company')),
    __param(1, (0, graphql_1.Args)('employeeIds', { type: () => [graphql_1.Int] })),
    __param(2, (0, graphql_1.Args)('serviceIds', { type: () => [graphql_1.Int] })),
    __param(3, (0, graphql_1.Args)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, String]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getGroupScheduleEvents", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "removeSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "cancelSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => schedules_entity_1.ScheduleEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('bookingId', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "addScheduleToBooking", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('bookingId', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "removeBookingFromSchedule", null);
ScheduleResolver = ScheduleResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => ScheduleResolver_1),
    __metadata("design:paramtypes", [schedules_service_1.ScheduleService,
        employees_service_1.EmployeesService,
        services_service_1.ServicesService,
        groups_service_1.GroupsService,
        offices_service_1.OfficesService,
        bookings_service_1.BookingsService,
        event_emitter_1.EventEmitter2])
], ScheduleResolver);
exports.ScheduleResolver = ScheduleResolver;
//# sourceMappingURL=schedules.resolver.js.map