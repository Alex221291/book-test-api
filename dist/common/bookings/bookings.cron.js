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
var BookingsCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bookings_service_1 = require("./bookings.service");
const bookings_statuses_1 = require("./types/bookings.statuses");
const luxon_1 = require("luxon");
const event_emitter_1 = require("@nestjs/event-emitter");
const bookings_event_1 = require("./bookings.event");
let BookingsCron = BookingsCron_1 = class BookingsCron {
    constructor(eventEmitter, bookingsService) {
        this.eventEmitter = eventEmitter;
        this.bookingsService = bookingsService;
        this.logger = new common_1.Logger(BookingsCron_1.name);
    }
    async handleCron() {
        const builder = this.bookingsService.findWithQueryBuilder();
        builder
            .leftJoinAndSelect('e.webForm', 'webForm')
            .leftJoinAndSelect('e.customer', 'customer')
            .leftJoinAndSelect('e.schedules', 'schedule')
            .leftJoinAndSelect('e.office', 'office')
            .leftJoinAndSelect('office.company', 'company')
            .andWhere('e.status NOT IN (:statuses)', {
            statuses: [
                bookings_statuses_1.BookingsStatuses.COMPLETED,
                bookings_statuses_1.BookingsStatuses.PAID,
                bookings_statuses_1.BookingsStatuses.CANCELLED,
            ],
        })
            .andWhere('e.confirmed IS TRUE')
            .andWhere('e.remindSent IS FALSE')
            .andWhere('e.remindFor > 0')
            .andWhere('schedule.sinceDate > NOW()');
        const bookings = await builder.getMany();
        for (const booking of bookings) {
            const schedule = booking.schedules[0];
            const remindDateTime = luxon_1.DateTime.fromJSDate(schedule.sinceDate);
            const diff = remindDateTime.diffNow('minutes').minutes;
            if (diff <= booking.remindFor && diff > booking.remindFor - 5) {
                booking.remindSent = true;
                this.bookingsService.update(booking).then((payload) => {
                    this.eventEmitter.emit(bookings_event_1.BookingEvents.BOOKING_REMIND, payload);
                });
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsCron.prototype, "handleCron", null);
BookingsCron = BookingsCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        bookings_service_1.BookingsService])
], BookingsCron);
exports.BookingsCron = BookingsCron;
//# sourceMappingURL=bookings.cron.js.map