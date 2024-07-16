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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("../bookings/bookings.service");
const bookings_statuses_1 = require("../bookings/types/bookings.statuses");
const date_1 = require("../../base/utils/date");
const payments_service_1 = require("../payments/payments.service");
let AnalyticsService = class AnalyticsService {
    constructor(bookingsService, paymentsService) {
        this.bookingsService = bookingsService;
        this.paymentsService = paymentsService;
    }
    async getRevenue(hash, dateStart, dateFinish) {
        var _a;
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.paymentsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.bookings', 'bookings')
            .innerJoinAndSelect('bookings.office', 'office')
            .innerJoinAndSelect('office.company', 'company')
            .select('SUM(e.total)', 'value')
            .andWhere('e.type = "incoming"')
            .andWhere('e.account_key IN (:keys)', { keys: ['cash'] })
            .andWhere(`company.hash = :hash`, { hash })
            .andWhere(`e.createdAt BETWEEN :min AND :max`, {
            min: timeFrom.toSQL(),
            max: timeTo.toSQL(),
        });
        return ((_a = (await builder.getRawOne())) === null || _a === void 0 ? void 0 : _a.value) || 0;
    }
    async getAverage(hash, dateStart, dateFinish) {
        var _a;
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.paymentsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.bookings', 'bookings')
            .innerJoinAndSelect('bookings.office', 'office')
            .innerJoinAndSelect('office.company', 'company')
            .select('SUM(e.total) / COUNT(*)', 'value')
            .andWhere('e.type = "incoming"')
            .andWhere('e.account_key IN (:keys)', { keys: ['cash'] })
            .andWhere(`company.hash = :hash`, { hash })
            .andWhere(`e.createdAt BETWEEN :min AND :max`, {
            min: timeFrom.toSQL(),
            max: timeTo.toSQL(),
        });
        return ((_a = (await builder.getRawOne())) === null || _a === void 0 ? void 0 : _a.value) || 0;
    }
    async revenueByEmployee(hash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.paymentsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.bookings', 'bookings')
            .innerJoinAndSelect('bookings.schedules', 'schedule')
            .innerJoinAndSelect('schedule.employee', 'employee')
            .innerJoinAndSelect('bookings.office', 'office')
            .innerJoinAndSelect('office.company', 'company')
            .select('SUM(e.total)', 'value')
            .addSelect('CONCAT(employee.firstName, " ", employee.lastName)', 'label')
            .andWhere('e.type = "incoming"')
            .andWhere('e.account_key IN (:keys)', { keys: ['cash'] })
            .andWhere(`company.hash = :hash`, { hash })
            .andWhere(`e.createdAt BETWEEN :min AND :max`, {
            min: timeFrom.toSQL(),
            max: timeTo.toSQL(),
        })
            .addGroupBy('employee.id')
            .orderBy('value', 'DESC');
        return await builder.getRawMany();
    }
    async revenueByServices(hash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.paymentsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.bookings', 'bookings')
            .innerJoinAndSelect('bookings.schedules', 'schedule')
            .innerJoinAndSelect('schedule.services', 'services')
            .innerJoinAndSelect('schedule.employee', 'employee')
            .innerJoinAndSelect('bookings.office', 'office')
            .innerJoinAndSelect('office.company', 'company')
            .select('services.title', 'label')
            .addSelect('SUM(e.total)', 'value')
            .andWhere('e.type = "incoming"')
            .andWhere('e.account_key IN (:keys)', { keys: ['cash'] })
            .andWhere(`company.hash = :hash`, { hash })
            .andWhere(`e.createdAt BETWEEN :min AND :max`, {
            min: timeFrom.toSQL(),
            max: timeTo.toSQL(),
        })
            .addGroupBy('services.id')
            .orderBy('value', 'DESC');
        return await builder.getRawMany();
    }
    async customerVisitsByService(customerId, serviceIds) {
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.customer', 'customer')
            .innerJoinAndSelect('e.schedules', 'schedule')
            .innerJoinAndSelect('schedule.services', 'services')
            .innerJoinAndSelect('services.tags', 'tags')
            .select('tags.title', 'label')
            .addSelect('GROUP_CONCAT(DISTINCT services.id)', 'group')
            .addSelect('tags.color', 'type')
            .addSelect('COUNT(*)', 'total')
            .andWhere(`e.status IN (:statuses)`, {
            statuses: [bookings_statuses_1.BookingsStatuses.COMPLETED, bookings_statuses_1.BookingsStatuses.PAID],
        })
            .andWhere('customer.id = :customerId', { customerId })
            .addGroupBy('tags.id')
            .orderBy('value', 'DESC');
        return await builder.getRawMany();
    }
    async getServicesRate(companyHash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.schedules', 'schedule')
            .innerJoinAndSelect('schedule.services', 'services')
            .innerJoinAndSelect('e.office', 'office')
            .innerJoinAndSelect('office.company', 'company')
            .select('services.title', 'label')
            .addSelect('COUNT(*)', 'value')
            .addSelect('month(schedule.startTime)', 'type')
            .andWhere(`company.hash = '${companyHash}'`)
            .andWhere('services.title IS NOT NULL')
            .andWhere('e.status NOT IN(:status)', {
            status: [bookings_statuses_1.BookingsStatuses.CANCELLED],
        })
            .andWhere(`(schedule.sinceDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}' OR schedule.untilDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}')`)
            .addGroupBy('services.title')
            .orderBy('value', 'DESC');
        return await builder.getRawMany();
    }
    async getLoadingDynamic(companyHash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.schedules', 'schedule')
            .leftJoinAndSelect('schedule.employee', 'employee')
            .leftJoinAndSelect('schedule.services', 'services')
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .select('CONCAT(employee.firstName, " ",employee.lastName)', 'label')
            .addSelect('COUNT(schedule.employee)', 'value')
            .andWhere(`company.hash = '${companyHash}'`)
            .andWhere('e.status NOT IN(:status)', {
            status: [bookings_statuses_1.BookingsStatuses.CANCELLED],
        })
            .andWhere(`(schedule.sinceDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}' OR schedule.untilDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}')`)
            .addGroupBy('schedule.employee')
            .orderBy('value', 'DESC');
        return await builder.getRawMany();
    }
    async getAllBookings(companyHash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.office', 'office')
            .innerJoinAndSelect('e.schedules', 'schedule')
            .innerJoinAndSelect('office.company', 'company')
            .andWhere(`company.hash = '${companyHash}'`)
            .andWhere(`(schedule.sinceDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}' OR schedule.untilDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}')`);
        return await builder.getCount();
    }
    async getCancelledBookings(companyHash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.office', 'office')
            .innerJoinAndSelect('e.schedules', 'schedule')
            .innerJoinAndSelect('office.company', 'company')
            .andWhere(`e.status = '${bookings_statuses_1.BookingsStatuses.CANCELLED}'`)
            .andWhere(`company.hash = '${companyHash}'`)
            .andWhere(`(schedule.sinceDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}' OR schedule.untilDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}')`);
        return await builder.getCount();
    }
    async getCompletedBookings(companyHash, dateStart, dateFinish) {
        const timeFrom = (0, date_1.default)(dateStart);
        const timeTo = (0, date_1.default)(dateFinish);
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .innerJoinAndSelect('e.office', 'office')
            .innerJoinAndSelect('e.payment', 'payment')
            .innerJoinAndSelect('e.schedules', 'schedule')
            .innerJoinAndSelect('office.company', 'company')
            .andWhere(`e.status IN(:statuses)`, {
            statuses: [bookings_statuses_1.BookingsStatuses.COMPLETED, bookings_statuses_1.BookingsStatuses.PAID],
        })
            .andWhere('payment.id IS NOT NULL')
            .andWhere(`company.hash = '${companyHash}'`)
            .andWhere(`(schedule.sinceDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}' OR schedule.untilDate BETWEEN '${timeFrom.toSQL()}' AND '${timeTo.toSQL()}')`);
        return await builder.getCount();
    }
};
AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        payments_service_1.PaymentsService])
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map