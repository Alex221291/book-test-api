import { MigrationInterface, QueryRunner } from 'typeorm';
import { CustomerEntity } from '../common/customers/customer.entity';

export class AddCompanyRelationToCustomerEntity1689855977460
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const repository = queryRunner.connection.getRepository(CustomerEntity);
		const customers = await repository.find();
		for (const customer of customers) {
			if (customer.offices.length > 0) {
				customer.company = customer.offices[0].company;
				if (await repository.save(customer)) {
					customer.offices = [];
					await repository.save(customer);
				}
			}
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
