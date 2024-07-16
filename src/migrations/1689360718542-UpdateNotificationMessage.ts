import { MigrationInterface, QueryRunner } from 'typeorm';
import { NotificationsEntity } from '../common/notifications/notifications.entity';

export class UpdateNotificationMessage1689360718542
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const repository =
			queryRunner.connection.getRepository(NotificationsEntity);
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

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
