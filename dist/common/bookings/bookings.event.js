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
var BookingEvents_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEvents = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const integrations_service_1 = require("../integrations/integrations.service");
const bookings_entity_1 = require("./bookings.entity");
const notifications_event_1 = require("../notifications/notifications.event");
const integrations_type_1 = require("../integrations/integrations.type");
let BookingEvents = BookingEvents_1 = class BookingEvents {
    constructor(integrationService, notificationsService) {
        this.integrationService = integrationService;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(BookingEvents_1.name);
    }
    sendSystemNotification(booking, type) {
        return this.notificationsService.addNotification(booking.office.company.hash, type, `notifications.${type}`, JSON.stringify({
            id: booking.id,
            hash: booking.hash,
            phone: booking.customer.phone,
            company: booking.office.company.hash,
        }));
    }
    prepareKeys(booking) {
        var _a;
        return {
            id: booking.id,
            phone: booking.customer.phone,
            status: booking.status,
            address: booking.office.address,
            title: booking.office.company.title,
            company: booking.office.company.hash,
            hash: booking.hash,
            code: booking.code,
            webForm: ((_a = booking === null || booking === void 0 ? void 0 : booking.webForm) === null || _a === void 0 ? void 0 : _a.hash) || '-',
            hour: booking.remindFor / 60,
        };
    }
    async sendPinCodeBySMS(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.code) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setRecipient(booking.customer.phone);
                    provider.setBody(provider.prepareBody(provider.templates.code, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sendBookingDetailsBySMS(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            console.log('integration', integration);
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.created) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setRecipient(booking.customer.phone);
                    provider.setBody(provider.prepareBody(provider.templates.created, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
            await this.sendSystemNotification(booking, BookingEvents_1.BOOKING_CONFIRMED);
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sentBookingDetailsByTelegram(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.TELEGRAM,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.draft) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setBody(provider.prepareBody(provider.templates.draft, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sendCancelNotificationBySMS(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.cancelled) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setRecipient(booking.customer.phone);
                    provider.setBody(provider.prepareBody(provider.templates.cancelled, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
            await this.sendSystemNotification(booking, BookingEvents_1.BOOKING_CANCELLED_BY_ADMIN);
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sendUpdatedBookingDetailsBySMS(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.updated) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setRecipient(booking.customer.phone);
                    provider.setBody(provider.prepareBody(provider.templates.updated, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sendCancelNotificationByTelegram(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.TELEGRAM,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.cancelled) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setBody(provider.prepareBody(provider.templates.cancelled, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
    async sendBookingCustomerRemind(booking) {
        var _a;
        try {
            const integration = await this.integrationService.findOneBy({
                type: integrations_type_1.IntegrationsType.SMS,
                company: {
                    hash: booking.office.company.hash,
                },
            });
            if (integration) {
                const provider = this.integrationService.getMessageIntegrationProvider(integration.provider, integration.config);
                if (provider && ((_a = provider.templates.reminder) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    provider.setRecipient(booking.customer.phone);
                    provider.setBody(provider.prepareBody(provider.templates.reminder, this.prepareKeys(booking)));
                    await provider.send();
                }
            }
        }
        catch (e) {
            this.logger.error(e.message);
        }
    }
};
BookingEvents.BOOKING_CREATED = 'booking.created';
BookingEvents.BOOKING_CONFIRMED = 'booking.confirmed';
BookingEvents.BOOKING_REMIND = 'booking.remind';
BookingEvents.BOOKING_CANCELLED_BY_CUSTOMER = 'booking.cancelled.customer';
BookingEvents.BOOKING_CANCELLED_BY_ADMIN = 'booking.cancelled.admin';
BookingEvents.BOOKING_UPDATED_BY_ADMIN = 'booking.admin.updated';
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendPinCodeBySMS", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_CONFIRMED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendBookingDetailsBySMS", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_CONFIRMED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sentBookingDetailsByTelegram", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_CANCELLED_BY_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendCancelNotificationBySMS", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_UPDATED_BY_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendUpdatedBookingDetailsBySMS", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_CANCELLED_BY_CUSTOMER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendCancelNotificationByTelegram", null);
__decorate([
    (0, event_emitter_1.OnEvent)(BookingEvents_1.BOOKING_REMIND),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookings_entity_1.BookingEntity]),
    __metadata("design:returntype", Promise)
], BookingEvents.prototype, "sendBookingCustomerRemind", null);
BookingEvents = BookingEvents_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService,
        notifications_event_1.NotificationsEvent])
], BookingEvents);
exports.BookingEvents = BookingEvents;
//# sourceMappingURL=bookings.event.js.map