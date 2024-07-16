"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const pagination_response_type_1 = require("../../../base/graphql-pagination/types/pagination.response.type");
const categories_entity_1 = require("../categories.entity");
let CategoriesPaginatedResponse = class CategoriesPaginatedResponse extends (0, pagination_response_type_1.default)(categories_entity_1.CategoriesEntity) {
};
CategoriesPaginatedResponse = __decorate([
    (0, graphql_1.ObjectType)()
], CategoriesPaginatedResponse);
exports.default = CategoriesPaginatedResponse;
//# sourceMappingURL=categories.paginate.js.map