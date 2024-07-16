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
exports.BookingsWebFormInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const schedules_input_1 = require("../schedules/schedules.input");
let BookingsWebFormInput = class BookingsWebFormInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BookingsWebFormInput.prototype, "office", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BookingsWebFormInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BookingsWebFormInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BookingsWebFormInput.prototype, "comment", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], BookingsWebFormInput.prototype, "remindFor", void 0);
__decorate([
    (0, graphql_1.Field)(() => [schedules_input_1.ScheduleInput]),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BookingsWebFormInput.prototype, "schedules", void 0);
BookingsWebFormInput = __decorate([
    (0, graphql_1.InputType)('BookingsWebFormInput')
], BookingsWebFormInput);
exports.BookingsWebFormInput = BookingsWebFormInput;
//# sourceMappingURL=bookings.webform.input.js.map