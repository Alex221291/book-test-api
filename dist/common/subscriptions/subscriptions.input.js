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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let SubscriptionsInput = class SubscriptionsInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SubscriptionsInput.prototype, "customer", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SubscriptionsInput.prototype, "plan", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SubscriptionsInput.prototype, "sinceDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SubscriptionsInput.prototype, "untilDate", void 0);
SubscriptionsInput = __decorate([
    (0, graphql_1.InputType)('SubscriptionsInput')
], SubscriptionsInput);
exports.SubscriptionsInput = SubscriptionsInput;
//# sourceMappingURL=subscriptions.input.js.map