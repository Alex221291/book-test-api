import { MigrationInterface, QueryRunner } from 'typeorm';
import { CustomerEntity } from '../common/customers/customer.entity';
import parsePhoneNumber from '../base/utils/parsePhoneNumber';

export class UpdatePhoneNumberFormat1688724656191 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const repository = queryRunner.connection.getRepository(CustomerEntity);
		const customers = await repository.find();
		for (const customer of customers) {
			customer.phone = parsePhoneNumber(customer.phone);
			await repository.save(customer);
		}
	}
	public async down(queryRunner: QueryRunner): Promise<void> {
		// todo
	}
}
