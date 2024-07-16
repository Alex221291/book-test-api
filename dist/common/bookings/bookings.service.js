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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookings_entity_1 = require("./bookings.entity");
const offices_service_1 = require("../offices/offices.service");
const customer_service_1 = require("../customers/customer.service");
const parsePhoneNumber_1 = require("../../base/utils/parsePhoneNumber");
const customer_entity_1 = require("../customers/customer.entity");
const schedules_service_1 = require("../schedules/schedules.service");
let BookingsService = class BookingsService extends base_service_1.BaseService {
    constructor(repository, officesService, customerService, scheduleService) {
        super();
        this.repository = repository;
        this.officesService = officesService;
        this.customerService = customerService;
        this.scheduleService = scheduleService;
    }
    async prepare(entity, payload, user) {
        const booking = this.repository.merge(entity, payload);
        booking.comment = payload.comment;
        if (payload.officeId) {
            booking.office = await this.officesService.findOneBy({
                id: payload.officeId,
                company: {
                    users: {
                        id: user.id,
                    },
                },
            });
        }
        if (payload.scheduleIds) {
            booking.schedules = await Promise.all(payload.scheduleIds.map((scheduleId) => {
                return this.scheduleService.getScheduleById(scheduleId, user);
            }));
        }
        if (payload.customerPhone) {
            booking.customer = await this.customerService.getCustomer({
                phone: (0, parsePhoneNumber_1.default)(payload.customerPhone),
            }, user.id);
            if (!booking.customer) {
                booking.customer = await this.customerService.prepare(new customer_entity_1.CustomerEntity(), {
                    phone: (0, parsePhoneNumber_1.default)(payload.customerPhone),
                    lastName: payload.customerLastName,
                    firstName: payload.customerFirstName,
                }, booking.office.company);
            }
        }
        return booking;
    }
    getBookingById(hash, user) {
        return this.findOneBy({
            hash,
            office: {
                company: {
                    users: {
                        id: user.id,
                    },
                },
            },
        }, {
            office: true,
            webForm: true,
            schedules: true,
            customer: true,
        });
    }
    getSelectQueryBuilder(parent) {
        const builder = parent || this.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.customer', 'customer')
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('e.webForm', 'webForm')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .leftJoinAndSelect('e.subscription', 'subscription')
            .leftJoinAndSelect('e.schedules', 'schedule')
            .leftJoinAndSelect('schedule.services', 'services')
            .leftJoinAndSelect('schedule.employee', 'employee')
            .leftJoinAndSelect('employee.photo', 'photo');
        return builder;
    }
};
BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookings_entity_1.BookingEntity)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => schedules_service_1.ScheduleService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        offices_service_1.OfficesService,
        customer_service_1.CustomerService,
        schedules_service_1.ScheduleService])
], BookingsService);
exports.BookingsService = BookingsService;
//# sourceMappingURL=bookings.service.js.map