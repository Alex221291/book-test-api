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
exports.NotificationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const notifications_entity_1 = require("./notifications.entity");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const user_decorator_1 = require("../../auth/user.decorator");
const users_entity_1 = require("../users/users.entity");
const notifications_service_1 = require("./notifications.service");
const rxjs_1 = require("rxjs");
let NotificationsResolver = class NotificationsResolver {
    constructor(pubSub, notificationsService) {
        this.pubSub = pubSub;
        this.notificationsService = notificationsService;
    }
    notificationAdded(company) {
        return this.pubSub.asyncIterator('notificationAdded');
    }
    getNotifications(user, company) {
        return this.notificationsService.findAllBy({
            company: {
                hash: company,
                users: {
                    id: user.id,
                },
            },
        }, {}, { read: 'ASC', createdAt: 'desc' });
    }
    async readNotification(user, id) {
        const entity = await this.notificationsService.findOneBy({
            id,
            company: {
                users: {
                    id: user.id,
                },
            },
        });
        if (entity) {
            entity.read = true;
            return await this.notificationsService.update(entity);
        }
        throw new rxjs_1.NotFoundError('Something went wrong. Try again. :(');
    }
};
__decorate([
    (0, graphql_1.Subscription)(() => notifications_entity_1.NotificationsEntity, {
        filter: (payload, variables) => {
            return payload.notificationAdded.company.hash === variables.company;
        },
    }),
    __param(0, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsResolver.prototype, "notificationAdded", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [notifications_entity_1.NotificationsEntity]),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('company')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, String]),
    __metadata("design:returntype", void 0)
], NotificationsResolver.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => notifications_entity_1.NotificationsEntity),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "readNotification", null);
NotificationsResolver = __decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, graphql_1.Resolver)(() => notifications_entity_1.NotificationsEntity),
    __param(0, (0, common_1.Inject)('PUB_SUB')),
    __metadata("design:paramtypes", [graphql_subscriptions_1.PubSub,
        notifications_service_1.NotificationsService])
], NotificationsResolver);
exports.NotificationsResolver = NotificationsResolver;
//# sourceMappingURL=notifications.resolver.js.map