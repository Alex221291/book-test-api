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
var GroupsCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const groups_service_1 = require("./groups.service");
const schedules_service_1 = require("../schedules/schedules.service");
const date_1 = require("../../base/utils/date");
const bookings_service_1 = require("../bookings/bookings.service");
const bookings_entity_1 = require("../bookings/bookings.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let GroupsCron = GroupsCron_1 = class GroupsCron {
    constructor(groupService, scheduleService, bookingsService, notificationService) {
        this.groupService = groupService;
        this.scheduleService = scheduleService;
        this.bookingsService = bookingsService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(GroupsCron_1.name);
    }
    async handleCron() {
        var _a, _b;
        const sinceDate = (0, date_1.default)().startOf('day').toUTC();
        const untilDate = (0, date_1.default)().plus({ day: 1 }).endOf('day').toUTC();
        const items = await this.scheduleService.findAllGroupSchedules(sinceDate, untilDate);
        for (const schedule of items) {
            if ((_a = schedule.group) === null || _a === void 0 ? void 0 : _a.id) {
                const group = await this.groupService.findOneBy({
                    id: (_b = schedule.group) === null || _b === void 0 ? void 0 : _b.id,
                    office: {
                        id: schedule.employee.office.id,
                    },
                }, {
                    customers: {
                        customer: true,
                    },
                    office: {
                        company: true,
                    },
                });
                if (group) {
                    group.customers.map((customer) => {
                        const foundCustomer = schedule.bookings.find((booking) => {
                            return booking.customer.id === customer.customer.id;
                        });
                        if (!foundCustomer) {
                            const booking = new bookings_entity_1.BookingEntity();
                            booking.customer = customer.customer;
                            booking.schedules = [schedule];
                            booking.office = group.office;
                            this.bookingsService
                                .add(booking)
                                .then(() => {
                                this.notificationService.createNotification(booking.office.company.hash, 'group.created', 'notifications.group.created', JSON.stringify({
                                    id: booking.id,
                                    hash: booking.hash,
                                    phone: booking.customer.phone,
                                    company: booking.office.company.hash,
                                }));
                            })
                                .catch((e) => {
                                this.logger.error(e.message);
                            });
                        }
                    });
                }
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupsCron.prototype, "handleCron", null);
GroupsCron = GroupsCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groups_service_1.GroupsService,
        schedules_service_1.ScheduleService,
        bookings_service_1.BookingsService,
        notifications_service_1.NotificationsService])
], GroupsCron);
exports.GroupsCron = GroupsCron;
//# sourceMappingURL=groups.cron.js.map