"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationMessage1689360718542 = void 0;
const notifications_entity_1 = require("../common/notifications/notifications.entity");
class UpdateNotificationMessage1689360718542 {
    async up(queryRunner) {
        const repository = queryRunner.connection.getRepository(notifications_entity_1.NotificationsEntity);
        const notifications = await repository.find();
        for (const notification of notifications) {
            if (notification.message === 'notifications.groupCreated') {
                notification.message = 'notifications.group.created';
            }
            if (notification.message === 'notifications.bookingConfirmed') {
                notification.message = 'notifications.booking.confirmed';
            }
            if (notification.message === 'notifications.bookingCancelled') {
                notification.message = 'notifications.booking.cancelled';
            }
            await repository.save(notification);
        }
    }
    async down(queryRunner) { }
}
exports.UpdateNotificationMessage1689360718542 = UpdateNotificationMessage1689360718542;
//# sourceMappingURL=1689360718542-UpdateNotificationMessage.js.map