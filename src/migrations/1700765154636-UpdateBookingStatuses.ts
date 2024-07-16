import { MigrationInterface, QueryRunner } from 'typeorm';
import { BookingsStatuses } from '../common/bookings/types/bookings.statuses';

export class UpdateBookingStatuses1700765154636 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE bookings b SET b.status = '${BookingsStatuses.PREPARED}' WHERE b.status IN('DRAFT', 'ACTIVE')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
