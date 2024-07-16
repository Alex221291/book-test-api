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
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedules_entity_1 = require("./schedules.entity");
const employees_service_1 = require("../employees/employees.service");
const services_service_1 = require("../services/services.service");
const groups_service_1 = require("../groups/groups.service");
const bookings_service_1 = require("../bookings/bookings.service");
const rxjs_1 = require("rxjs");
const date_1 = require("../../base/utils/date");
const time_1 = require("../../base/utils/time");
const bookings_statuses_1 = require("../bookings/types/bookings.statuses");
const schedules_type_1 = require("./types/schedules.type");
const between_1 = require("../../base/utils/between");
let ScheduleService = class ScheduleService extends base_service_1.BaseService {
    constructor(repository, employeeService, servicesService, groupService, bookingsService) {
        super();
        this.repository = repository;
        this.employeeService = employeeService;
        this.servicesService = servicesService;
        this.groupService = groupService;
        this.bookingsService = bookingsService;
    }
    getDateTimeBetweenCondition(since, until) {
        const min = since.toSQL();
        const max = until.toSQL();
        return new typeorm_2.Brackets((qb) => {
            qb.where(`:min <= e.sinceDate AND e.sinceDate < :max`, {
                min,
                max,
            })
                .orWhere(`:min < e.untilDate AND e.untilDate < :max`, {
                min,
                max,
            })
                .orWhere(`e.sinceDate <= :expr1 AND :expr1 < e.untilDate`, {
                expr1: min,
            })
                .orWhere(`e.sinceDate < :expr2 AND :expr2 < e.untilDate`, {
                expr2: max,
            });
        });
    }
    validateWorkingHours(office, sinceDate, untilDate) {
        const dateObj = (0, date_1.default)(sinceDate);
        const regExp = /^([0-9]{2})([0-9]{2})/;
        const workDays = JSON.parse(office.workingDays);
        const currDay = dateObj.toFormat('ccc');
        const companyWorkTime = workDays[currDay];
        const from = companyWorkTime.from.replace(regExp, '$1.$2').split('.');
        const to = companyWorkTime.to.replace(regExp, '$1.$2').split('.');
        const start = (0, date_1.default)(sinceDate).setZone(office.company.timezone).set({
            hour: from[0],
            minute: from[1],
            second: 0,
            millisecond: 0,
        });
        const finish = (0, date_1.default)(sinceDate).setZone(office.company.timezone).set({
            hour: to[0],
            minute: to[1],
            second: 0,
            millisecond: 0,
        });
        return ((0, between_1.default)((0, date_1.default)(sinceDate), start, finish, 'v3') &&
            (0, between_1.default)((0, date_1.default)(untilDate), start, finish, 'v3'));
    }
    async validateTimePeriod(companyId, employeeId, sinceDate, untilDate, scheduleId, timeZone, bookingId) {
        if (sinceDate && untilDate) {
            const sinceDateTime = (0, date_1.default)(sinceDate).setZone(timeZone);
            const untilDateTime = (0, date_1.default)(untilDate).setZone(timeZone);
            const builder = this.findWithQueryBuilder();
            builder
                .leftJoinAndSelect('e.employee', 'employee')
                .leftJoinAndSelect('e.bookings', 'bookings')
                .leftJoinAndSelect('employee.office', 'office')
                .leftJoinAndSelect('office.company', 'company');
            builder.andWhere(this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime));
            builder
                .andWhere(`e.cancelled NOT IN(1)`)
                .andWhere(`employee.id = :employeeId`, { employeeId })
                .andWhere(`company.hash = '${companyId}'`);
            if (scheduleId) {
                builder.andWhere(`e.id != :scheduleId`, { scheduleId });
            }
            if (bookingId) {
                builder.andWhere(`bookings.id != :bookingId`, { bookingId });
            }
            const [, count] = await builder.getManyAndCount();
            return count === 0;
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async prepareEntity(entity, payload, companyId, userId, extraDuration = 0) {
        const employee = await this.employeeService.getEmployeeById(payload.employee, companyId, payload.services, userId);
        if (employee) {
            const users = userId ? { id: userId } : {};
            const timezone = employee.office.company.timezone;
            const sinceDate = (0, date_1.default)(payload === null || payload === void 0 ? void 0 : payload.sinceDate, timezone);
            const untilDate = (payload === null || payload === void 0 ? void 0 : payload.untilDate) && (0, date_1.default)(payload === null || payload === void 0 ? void 0 : payload.untilDate, timezone);
            entity.sinceDate = sinceDate.toJSDate();
            entity.startTime = (0, time_1.default)(sinceDate);
            if (payload === null || payload === void 0 ? void 0 : payload.untilDate) {
                entity.untilDate = untilDate.toJSDate();
                entity.finishTime = (0, time_1.default)(untilDate);
            }
            entity.employee = employee;
            if (!entity.id && payload.type) {
                entity.type = payload.type;
            }
            if (payload.services) {
                const services = await Promise.all(payload.services.map(async (id) => {
                    return await this.servicesService.findOneBy({
                        id,
                        company: {
                            hash: companyId,
                            users,
                        },
                    });
                }));
                const totalMinutes = services.reduce((a, v) => a + v.duration, extraDuration);
                entity.services = services;
                if (!(payload === null || payload === void 0 ? void 0 : payload.untilDate)) {
                    const date = sinceDate.plus({ minute: totalMinutes });
                    entity.untilDate = date.toJSDate();
                    entity.finishTime = (0, time_1.default)(date);
                }
            }
            if (payload.groupId) {
                entity.group = await this.groupService.findOneBy({
                    id: payload.groupId,
                    office: {
                        company: {
                            hash: companyId,
                            users,
                        },
                    },
                });
            }
            if (payload.bookingId) {
                const builder = await this.bookingsService.getSelectQueryBuilder();
                builder
                    .andWhere('e.id = :id', { id: payload.bookingId });
                const booking = await builder.getOne();
                if (booking) {
                    entity.bookings = [booking];
                }
                else {
                    throw new rxjs_1.NotFoundError('Booking entity not found.');
                }
            }
            return entity;
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
    async getScheduleByDates(filters, userId, companyId, employees = [], sinceDate, untilDate) {
        const builder = this.findWithQueryBuilder(filters);
        builder
            .leftJoinAndSelect('e.services', 'services')
            .leftJoinAndSelect('e.group', 'group')
            .leftJoinAndSelect('e.bookings', 'booking')
            .leftJoinAndSelect('booking.customer', 'customer')
            .leftJoinAndSelect('e.employee', 'employee')
            .leftJoinAndSelect('employee.photo', 'photo')
            .leftJoinAndSelect('employee.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users');
        if (sinceDate && untilDate) {
            const sinceDateTime = (0, date_1.default)(sinceDate);
            const untilDateTime = (0, date_1.default)(untilDate);
            builder.andWhere(this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime));
        }
        builder
            .andWhere(`e.cancelled NOT IN(1)`)
            .andWhere(`company.hash = '${companyId}'`)
            .andWhere(`users.id = ${userId}`);
        if (employees.length > 0) {
            builder.andWhere(`employee.id IN (${[0, ...employees].join(',')})`);
        }
        builder.orderBy('e.sinceDate', 'ASC').orderBy('e.startTime', 'ASC');
        return await builder.getMany();
    }
    async getScheduleTimesByDate(employeeIds, since, until, scheduleIds) {
        const sinceDateTime = (0, date_1.default)(since);
        const untilDateTime = (0, date_1.default)(until);
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.employee', 'employee')
            .leftJoinAndSelect('e.bookings', 'bookings')
            .andWhere(`e.cancelled NOT IN(1)`)
            .andWhere(`employee.id IN (:employeeIds)`, { employeeIds });
        builder.andWhere(this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime));
        if ((scheduleIds === null || scheduleIds === void 0 ? void 0 : scheduleIds.length) > 0) {
            builder.andWhere(`e.id NOT IN(:scheduleIds)`, { scheduleIds });
        }
        return await builder.getMany();
    }
    async getScheduleById(id, user) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.employee', 'employee')
            .leftJoinAndSelect('employee.photo', 'photo')
            .leftJoinAndSelect('employee.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('company.users', 'users')
            .leftJoinAndSelect('e.services', 'services')
            .leftJoinAndSelect('e.bookings', 'booking')
            .leftJoinAndSelect('e.group', 'group')
            .leftJoinAndSelect('booking.customer', 'customer');
        builder
            .andWhere(`e.cancelled NOT IN(1)`)
            .andWhere(`users.id IN(${user.id})`)
            .andWhere(`e.id = ${id}`);
        return await builder.getOne();
    }
    async findAllGroupSchedules(sinceDateTime, untilDateTime, employeeIds, serviceIds, company) {
        const builder = this.repository.createQueryBuilder('e');
        builder
            .leftJoinAndSelect('e.group', 'group')
            .leftJoinAndSelect('e.employee', 'employee')
            .leftJoinAndSelect('e.services', 'services')
            .leftJoinAndSelect('employee.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .leftJoinAndSelect('e.bookings', 'bookings')
            .leftJoinAndSelect('bookings.customer', 'customer');
        builder
            .andWhere(`e.cancelled NOT IN(1)`)
            .andWhere(`e.type = :type`, { type: schedules_type_1.SchedulesType.GROUP })
            .andWhere(this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime));
        if ((employeeIds === null || employeeIds === void 0 ? void 0 : employeeIds.length) > 0) {
            builder.andWhere(`employee.id IN(:employeeIds)`, { employeeIds });
        }
        if ((serviceIds === null || serviceIds === void 0 ? void 0 : serviceIds.length) > 0) {
            builder.andWhere(`services.id IN(:serviceIds)`, { serviceIds });
        }
        if (company) {
            builder.andWhere(`company.hash = :company`, { company });
        }
        return await builder.getMany();
    }
    async flushOutdatedSchedule(bookingId, scheduleIds) {
        let toUpdateScheduleIds = scheduleIds;
        const builder = this.repository.createQueryBuilder('e');
        builder.leftJoinAndSelect('e.bookings', 'bookings');
        builder
            .andWhere('e.id IN (:scheduleIds)', { scheduleIds })
            .andWhere('bookings.status NOT IN(:statuses)', {
            statuses: [bookings_statuses_1.BookingsStatuses.CANCELLED],
        })
            .andWhere('bookings.id != :bookingId', { bookingId });
        const skipScheduleIds = (await builder.getMany()).map(({ id }) => id);
        if (skipScheduleIds.length > 0) {
            const toUpdateSchedule = await this.repository
                .createQueryBuilder('e')
                .leftJoinAndSelect('e.bookings', 'bookings')
                .where('bookings.id = :bookingId', { bookingId })
                .andWhere('e.id NOT IN(:skipScheduleIds)', { skipScheduleIds })
                .getMany();
            toUpdateScheduleIds = toUpdateSchedule.map((el) => el.id);
        }
        if (toUpdateScheduleIds.length > 0) {
            return await this.repository
                .createQueryBuilder()
                .update(schedules_entity_1.ScheduleEntity)
                .set({ cancelled: 1 })
                .andWhere('id IN(:toUpdateScheduleIds)', { toUpdateScheduleIds })
                .execute();
        }
        return undefined;
    }
};
ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedules_entity_1.ScheduleEntity)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => bookings_service_1.BookingsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        employees_service_1.EmployeesService,
        services_service_1.ServicesService,
        groups_service_1.GroupsService,
        bookings_service_1.BookingsService])
], ScheduleService);
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=schedules.service.js.map