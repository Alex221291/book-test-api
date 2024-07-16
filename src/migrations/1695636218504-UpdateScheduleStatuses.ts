import { MigrationInterface, QueryRunner } from 'typeorm';
import { BookingsStatuses } from '../common/bookings/types/bookings.statuses';

export class UpdateScheduleStatuses1695636218504 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE schedule sc INNER JOIN bookings_schedules_schedule bss on sc.id = bss.scheduleId LEFT JOIN bookings b ON b.id = bss.bookingsId SET sc.cancelled = 1 WHERE b.status = '${BookingsStatuses.CANCELLED}'`,
		);
		await queryRunner.query(
			`UPDATE schedule sc INNER JOIN bookings_schedules_schedule bss on sc.id = bss.scheduleId LEFT JOIN bookings b ON b.id = bss.bookingsId SET sc.cancelled = 0 WHERE b.status != '${BookingsStatuses.CANCELLED}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// todo
	}
}
