"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const makeWhereString_1 = require("./graphql-filter/utils/makeWhereString");
const makeSqlProperty_1 = require("./graphql-filter/utils/makeSqlProperty");
class BaseService {
    constructor() {
        this.logger = new common_1.Logger(BaseService.name);
    }
    add(entity) {
        return this.repository.save(entity);
    }
    update(entity) {
        return this.repository.save(entity);
    }
    async remove(id) {
        await this.repository.delete(id);
    }
    findAll(options) {
        return this.repository.find(options);
    }
    findOneById(id) {
        return this.repository.findOne(id);
    }
    findAllBy(where = {}, relations = {}, order = {}) {
        return this.repository.find({ where, relations, order });
    }
    findOneBy(where = {}, relations = {}, order = {}) {
        return this.repository.findOne({ where, relations, order });
    }
    findWithQueryBuilder(queries = [{ operator: 'AND', filters: [] }], sorters = [], offset = 0, limit = null, alias = 'e') {
        const builder = this.repository.createQueryBuilder(alias);
        for (const query of queries) {
            const { filters, operator: op } = query;
            builder.andWhere(new typeorm_1.Brackets((qb) => {
                for (const filter of filters) {
                    const { values = [], comparator = '=' } = filter;
                    if (values.length > 0) {
                        const str = (0, makeWhereString_1.default)(filter.field, comparator, values, alias);
                        if (op === 'AND') {
                            qb.andWhere(str);
                        }
                        else if (op === 'OR') {
                            qb.orWhere(str);
                        }
                        else {
                            qb.where(str);
                        }
                    }
                }
            }));
        }
        for (const filter of sorters) {
            builder.addOrderBy((0, makeSqlProperty_1.default)(alias, filter.column), filter.direction);
        }
        builder.addOrderBy('e.id', 'DESC');
        builder.skip(offset);
        if (limit) {
            builder.take(limit);
        }
        return builder;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map