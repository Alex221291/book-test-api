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
exports.WebFormInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const webform_entity_1 = require("./webform.entity");
let WebFormInput = class WebFormInput extends (0, graphql_1.PartialType)(webform_entity_1.WebFormEntity) {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebFormInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebFormInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebFormInput.prototype, "hash", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WebFormInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], WebFormInput.prototype, "pinProtection", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], WebFormInput.prototype, "isProtected", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], WebFormInput.prototype, "firstStepHidden", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebFormInput.prototype, "delay", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebFormInput.prototype, "pitch", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebFormInput.prototype, "maxAppointmentPeriod", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebFormInput.prototype, "officeId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.Int]),
    __metadata("design:type", Array)
], WebFormInput.prototype, "serviceIds", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.Int]),
    __metadata("design:type", Array)
], WebFormInput.prototype, "employeeIds", void 0);
WebFormInput = __decorate([
    (0, graphql_1.InputType)('WebFormInput')
], WebFormInput);
exports.WebFormInput = WebFormInput;
//# sourceMappingURL=webform.input.js.map