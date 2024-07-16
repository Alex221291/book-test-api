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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const bookings_entity_1 = require("./bookings.entity");
const bookings_service_1 = require("./bookings.service");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const bookings_input_1 = require("./dto/bookings.input");
const customer_service_1 = require("../customers/customer.service");
const schedules_service_1 = require("../schedules/schedules.service");
const services_service_1 = require("../services/services.service");
const filters_type_1 = require("../../base/graphql-filter/types/filters.type");
const sorter_type_1 = require("../../base/graphql-sorter/types/sorter.type");
const boooking_paginate_1 = require("./types/boooking.paginate");
const companies_service_1 = require("../companies/companies.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const bookings_event_1 = require("./bookings.event");
const employees_service_1 = require("../employees/employees.service");
const offices_service_1 = require("../offices/offices.service");
const bookings_statuses_1 = require("./types/bookings.statuses");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const customer_entity_1 = require("../customers/customer.entity");
const date_1 = require("../../base/utils/date");
const schedules_entity_1 = require("../schedules/schedules.entity");
const schedules_type_1 = require("../schedules/types/schedules.type");
const webform_service_1 = require("../webforms/webform.service");
const bookings_webform_input_1 = require("./bookings.webform.input");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
const payments_event_1 = require("../payments/payments.event");
const payments_service_1 = require("../payments/payments.service");
const users_service_1 = require("../users/users.service");
const users_role_enum_1 = require("../users/users.role.enum");
const luxon_1 = require("luxon");
const bookings_simple_input_1 = require("./dto/bookings.simple.input");
const class_transformer_1 = require("class-transformer");
let BookingsResolver = class BookingsResolver {
    constructor(bookingsService, customerService, scheduleService, servicesService, companyService, employeeService, webFormService, officesService, usersService, subscriptionsService, paymentsService, eventEmitter) {
        this.bookingsService = bookingsService;
        this.customerService = customerService;
        this.scheduleService = scheduleService;
        this.servicesService = servicesService;
        this.companyService = companyService;
        this.employeeService = employeeService;
        this.webFormService = webFormService;
        this.officesService = officesService;
        this.usersService = usersService;
        this.subscriptionsService = subscriptionsService;
        this.paymentsService = paymentsService;
        this.eventEmitter = eventEmitter;
    }
    async addBooking(hash, payload) {
        const webForm = await this.webFormService.findOneBy({
            hash,
        }, {
            office: {
                company: {},
            },
        });
        if (webForm) {
            const startTime = (0, date_1.default)().plus({ minute: webForm.delay }).toUTC();
            const owner = await this.usersService.findOneBy({
                companies: {
                    id: webForm.office.company.id,
                },
                role: users_role_enum_1.RoleTypes.OWNER,
            });
            const office = webForm.office;
            const booking = new bookings_entity_1.BookingEntity();
            booking.schedules = [];
            booking.confirmed = !webForm.pinProtection;
            booking.office = office;
            booking.webForm = webForm;
            booking.remindFor = payload.remindFor;
            booking.comment = payload.comment;
            booking.customer = await this.customerService.findOneBy({
                phone: (0, parsePhoneNumber_1.default)(payload.phone),
                company: {
                    id: office.company.id,
                },
            });
            if (!booking.customer) {
                if (webForm.isProtected) {
                    throw new common_1.NotFoundException('Online registration is not available for you');
                }
                const customer = new customer_entity_1.CustomerEntity();
                customer.phone = (0, parsePhoneNumber_1.default)(payload.phone);
                customer.firstName = payload.name;
                customer.company = office.company;
                booking.customer = customer;
            }
            if (payload.schedules) {
                for (const scheduleInput of payload.schedules) {
                    if (!scheduleInput.id) {
                        const scheduleEntity = await this.scheduleService.prepareEntity(new schedules_entity_1.ScheduleEntity(), scheduleInput, office.company.hash);
                        scheduleEntity.type = schedules_type_1.SchedulesType.DEFAULT;
                        if ((await this.scheduleService.validateTimePeriod(office.company.hash, scheduleEntity.employee.id, scheduleEntity.sinceDate.toISOString(), scheduleEntity.untilDate.toISOString())) &&
                            luxon_1.DateTime.fromJSDate(scheduleEntity.sinceDate)
                                .toUTC()
                                .diff(startTime, 'second').seconds > 0) {
                            booking.schedules.push(scheduleEntity);
                        }
                        else {
                            throw new common_1.NotFoundException('time.already.taken');
                        }
                    }
                    else {
                        const schedule = await this.scheduleService.findOneBy({
                            id: scheduleInput.id,
                            employee: {
                                office: {
                                    company: {
                                        hash: office.company.hash,
                                    },
                                },
                            },
                        });
                        if (schedule) {
                            booking.schedules.push(schedule);
                        }
                    }
                }
                return this.bookingsService.add(booking).then((data) => {
                    this.eventEmitter.emit(!data.confirmed
                        ? bookings_event_1.BookingEvents.BOOKING_CREATED
                        : bookings_event_1.BookingEvents.BOOKING_CONFIRMED, data);
                    this.eventEmitter.emit(payments_event_1.PaymentsEvent.BOOKING_SERVICE_FEE, owner.id);
                    return data;
                });
            }
        }
        throw new common_1.NotFoundException('Something went wrong. Try again. :(');
    }
    async addSimpleBooking(user, companyId, payload) {
        const company = await this.companyService.getCompanyByUser(companyId, user);
        if (company) {
            const booking = new bookings_entity_1.BookingEntity();
            booking.comment = payload.comment;
            booking.remindFor = payload.remindFor;
            booking.office = await this.officesService.findOneBy({
                id: payload.office,
                company: {
                    hash: companyId,
                    users: {
                        id: user.id,
                    },
                },
            });
            if (payload.phone) {
                booking.customer = await this.customerService.findOneBy({
                    phone: payload.phone,
                    company: {
                        users: {
                            id: user.id,
                        },
                    },
                });
                if (!booking.customer) {
                    const customer = new customer_entity_1.CustomerEntity();
                    customer.phone = (0, parsePhoneNumber_1.default)(payload.phone);
                    customer.firstName = payload.name;
                    customer.company = company;
                    booking.customer = customer;
                }
            }
            if (payload.schedule) {
                booking.schedules = [];
                const scheduleEntity = await this.scheduleService.prepareEntity(new schedules_entity_1.ScheduleEntity(), payload.schedule, booking.office.company.hash);
                scheduleEntity.type = schedules_type_1.SchedulesType.DEFAULT;
                if (await this.scheduleService.validateTimePeriod(booking.office.company.hash, scheduleEntity.employee.id, scheduleEntity.sinceDate.toISOString(), scheduleEntity.untilDate.toISOString())) {
                    booking.schedules.push(scheduleEntity);
                }
                else {
                    throw new common_1.NotFoundException('time.already.taken');
                }
            }
            return this.bookingsService.add(booking).then((data) => {
                this.eventEmitter.emit(payments_event_1.PaymentsEvent.BOOKING_SERVICE_FEE, user.id);
                this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_CONFIRMED, data);
                return data;
            });
        }
        throw new common_1.NotFoundException('Something went wrong. Try again. :(');
    }
    async addBookingByAdmin(user, payload) {
        const booking = await this.bookingsService.prepare(new bookings_entity_1.BookingEntity(), payload, user);
        booking.confirmed = true;
        return this.bookingsService.add(booking).then((data) => {
            this.eventEmitter.emit(payments_event_1.PaymentsEvent.BOOKING_SERVICE_FEE, user.id);
            this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_CONFIRMED, data);
            return data;
        });
    }
    async updateBookingByAdmin(user, bookingId, payload) {
        const booking = await this.bookingsService.getBookingById(bookingId, user);
        if (booking) {
            const entity = await this.bookingsService.prepare(booking, payload, user);
            return this.bookingsService.update(entity);
        }
        throw new common_1.NotFoundException('booking.not.found');
    }
    async changeBookingStatus(user, hash, status) {
        const booking = await this.bookingsService.getBookingById(hash, user);
        if (booking) {
            booking.status = status;
            const data = await this.bookingsService.update(booking).then((el) => {
                if (el.status === bookings_statuses_1.BookingsStatuses.CANCELLED) {
                    this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_CANCELLED_BY_ADMIN, booking);
                    this.scheduleService.flushOutdatedSchedule(el.id, el.schedules.map(({ id }) => id));
                }
                return el;
            });
            return (0, class_transformer_1.classToPlain)(data, { groups: [user.role] });
        }
        throw new common_1.NotFoundException('booking.not.found');
    }
    async confirmBooking(hash, code) {
        const builder = await this.bookingsService.getSelectQueryBuilder();
        builder
            .andWhere('e.hash = :hash', { hash })
            .andWhere('e.code = :code', { code })
            .andWhere('e.confirmed = false');
        const booking = await builder.getOne();
        if (booking) {
            booking.confirmed = true;
            await this.bookingsService.update(booking).finally(() => {
                this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_CONFIRMED, booking);
            });
            return booking;
        }
        else {
            throw new common_1.NotFoundException('Wrong confirmation code');
        }
    }
    async cancelBooking(hash) {
        const booking = await this.bookingsService
            .getSelectQueryBuilder()
            .leftJoinAndSelect('e.schedules', 'schedules')
            .andWhere(`e.hash = :hash`, { hash })
            .getOne();
        if (booking) {
            booking.status = bookings_statuses_1.BookingsStatuses.CANCELLED;
            return await this.bookingsService
                .update(booking)
                .then((el) => {
                const scheduleIds = el.schedules.map((el) => el.id);
                this.scheduleService.flushOutdatedSchedule(el.id, scheduleIds);
                return el;
            })
                .finally(() => {
                this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_CANCELLED_BY_CUSTOMER, booking);
            });
        }
        else {
            throw new common_1.NotFoundException('booking.not.found');
        }
    }
    async closeBooking(user, hash, amount) {
        const booking = await this.bookingsService.getBookingById(hash, user);
        const owner = await this.usersService.findOneBy({
            companies: {
                id: booking.office.company.id,
            },
            role: users_role_enum_1.RoleTypes.OWNER,
        });
        booking.status = bookings_statuses_1.BookingsStatuses.COMPLETED;
        booking.payment = await this.paymentsService.preparePayment({
            type: 'incoming',
            account_key: 'cash',
            purpose: payments_event_1.PaymentsEvent.CLOSING_BOOKING_PAYMENT,
            userId: owner.id,
            amount,
        });
        return this.bookingsService.update(booking);
    }
    async getBookings(user, companyId, filters, sorters, offset, limit) {
        const builder = this.bookingsService.getSelectQueryBuilder(this.bookingsService.findWithQueryBuilder(filters, sorters, offset, limit));
        builder
            .leftJoinAndSelect('e.payment', 'payment')
            .andWhere(`users.id IN(${user.id})`)
            .andWhere(`company.hash = '${companyId}'`);
        const [data, count] = await builder.getManyAndCount();
        return new boooking_paginate_1.default((0, class_transformer_1.classToPlain)(data, { groups: [user.role] }), count, offset, limit);
    }
    async getBooking(hash) {
        return this.bookingsService
            .getSelectQueryBuilder()
            .andWhere(`e.hash = :hash`, { hash })
            .getOne();
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, graphql_1.Args)('webFormId')),
    __param(1, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bookings_webform_input_1.BookingsWebFormInput]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "addBooking", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('companyId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, bookings_simple_input_1.BookingSimpleInput]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "addSimpleBooking", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity,
        bookings_input_1.BookingInput]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "addBookingByAdmin", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('bookingId')),
    __param(2, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, bookings_input_1.BookingInput]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "updateBookingByAdmin", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('hash')),
    __param(2, (0, graphql_1.Args)('status', { type: () => bookings_statuses_1.BookingsStatuses })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, String]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "changeBookingStatus", null);
__decorate([
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, graphql_1.Args)('hash')),
    __param(1, (0, graphql_1.Args)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "confirmBooking", null);
__decorate([
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, graphql_1.Args)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('hash')),
    __param(2, (0, graphql_1.Args)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Number]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "closeBooking", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => boooking_paginate_1.default),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __param(2, (0, graphql_1.Args)('filters', {
        nullable: true,
        defaultValue: [{ operator: 'AND', filters: [] }],
        type: () => [filters_type_1.default],
    })),
    __param(3, (0, graphql_1.Args)('sorters', { nullable: true, type: () => [sorter_type_1.default] })),
    __param(4, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(5, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String, Array, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "getBookings", null);
__decorate([
    (0, graphql_1.Query)(() => bookings_entity_1.BookingEntity),
    __param(0, (0, graphql_1.Args)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsResolver.prototype, "getBooking", null);
BookingsResolver = __decorate([
    (0, graphql_1.Resolver)(() => bookings_entity_1.BookingEntity),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        customer_service_1.CustomerService,
        schedules_service_1.ScheduleService,
        services_service_1.ServicesService,
        companies_service_1.CompaniesService,
        employees_service_1.EmployeesService,
        webform_service_1.WebFormService,
        offices_service_1.OfficesService,
        users_service_1.UsersService,
        subscriptions_service_1.SubscriptionsService,
        payments_service_1.PaymentsService,
        event_emitter_1.EventEmitter2])
], BookingsResolver);
exports.BookingsResolver = BookingsResolver;
//# sourceMappingURL=bookings.resolver.js.map