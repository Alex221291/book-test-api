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
const filter_type_1 = require("./filter.type");
let FiltersExpression = class FiltersExpression {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FiltersExpression.prototype, "operator", void 0);
__decorate([
    (0, graphql_1.Field)(() => [filter_type_1.default]),
    __metadata("design:type", Array)
], FiltersExpression.prototype, "filters", void 0);
FiltersExpression = __decorate([
    (0, graphql_1.InputType)()
], FiltersExpression);
exports.default = FiltersExpression;
//# sourceMappingURL=filters.type.js.map