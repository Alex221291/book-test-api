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
const graphql_1 = require("@nestjs/graphql");
function PaginatedResponse(TItemClass) {
    let PaginatedResponseClass = class PaginatedResponseClass {
        constructor(items, total, offset, limit) {
            this.items = items;
            this.total = total;
            this.offset = offset;
            this.limit = limit;
        }
    };
    __decorate([
        (0, graphql_1.Field)(() => [TItemClass]),
        __metadata("design:type", Array)
    ], PaginatedResponseClass.prototype, "items", void 0);
    __decorate([
        (0, graphql_1.Field)(() => graphql_1.Int),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "total", void 0);
    __decorate([
        (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 0 }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "offset", void 0);
    __decorate([
        (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 20 }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "limit", void 0);
    PaginatedResponseClass = __decorate([
        (0, graphql_1.ObjectType)({ isAbstract: true }),
        __metadata("design:paramtypes", [Array, Number, Number, Number])
    ], PaginatedResponseClass);
    return PaginatedResponseClass;
}
exports.default = PaginatedResponse;
//# sourceMappingURL=pagination.response.type.js.map