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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const payments_entity_1 = require("./payments.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const users_role_enum_1 = require("../users/users.role.enum");
let PaymentsService = class PaymentsService extends base_service_1.BaseService {
    constructor(repository, usersService) {
        super();
        this.repository = repository;
        this.usersService = usersService;
    }
    async preparePayment(payload, currency = 'BYN', conversion = 1.0) {
        const { userId, amount, account_key, details, type, purpose } = payload;
        const lastPayment = await this.findOneBy({
            account_key,
            user: {
                id: userId,
            },
        }, {}, {
            id: 'desc',
        });
        const user = await this.usersService.findOneBy({
            id: userId,
            role: users_role_enum_1.RoleTypes.OWNER,
        });
        const balance = account_key === 'account'
            ? Number((lastPayment === null || lastPayment === void 0 ? void 0 : lastPayment.balance) || user.balance)
            : Number((lastPayment === null || lastPayment === void 0 ? void 0 : lastPayment.balance) || 0);
        const entity = new payments_entity_1.PaymentsEntity();
        entity.user = user;
        entity.type = type;
        entity.account_key = account_key;
        entity.purpose = purpose;
        entity.details = details;
        entity.amount = amount.toString();
        entity.conversionRate = conversion.toString();
        entity.currency = currency;
        entity.total = (amount * conversion).toString();
        if (type === 'outcoming') {
            entity.balance = (balance - Number(entity.total)).toString();
        }
        else if (type === 'incoming') {
            entity.balance = (balance + Number(entity.total)).toString();
        }
        return entity;
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payments_entity_1.PaymentsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map