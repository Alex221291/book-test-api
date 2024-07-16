"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhoneNumberFormat1688724656191 = void 0;
const customer_entity_1 = require("../common/customers/customer.entity");
const parsePhoneNumber_1 = require("../base/utils/parsePhoneNumber");
class UpdatePhoneNumberFormat1688724656191 {
    async up(queryRunner) {
        const repository = queryRunner.connection.getRepository(customer_entity_1.CustomerEntity);
        const customers = await repository.find();
        for (const customer of customers) {
            customer.phone = (0, parsePhoneNumber_1.default)(customer.phone);
            await repository.save(customer);
        }
    }
    async down(queryRunner) {
    }
}
exports.UpdatePhoneNumberFormat1688724656191 = UpdatePhoneNumberFormat1688724656191;
//# sourceMappingURL=1688724656191-UpdatePhoneNumberFormat.js.map