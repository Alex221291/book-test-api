"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCompanyRelationToCustomerEntity1689855977460 = void 0;
const customer_entity_1 = require("../common/customers/customer.entity");
class AddCompanyRelationToCustomerEntity1689855977460 {
    async up(queryRunner) {
        const repository = queryRunner.connection.getRepository(customer_entity_1.CustomerEntity);
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
    async down(queryRunner) { }
}
exports.AddCompanyRelationToCustomerEntity1689855977460 = AddCompanyRelationToCustomerEntity1689855977460;
//# sourceMappingURL=1689855977460-AddCompanyRelationToCustomerEntity.js.map