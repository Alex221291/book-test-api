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
exports.ScheduleInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const schedules_type_1 = require("./types/schedules.type");
let ScheduleInput = class ScheduleInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ScheduleInput.prototype, "sinceDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ScheduleInput.prototype, "untilDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.Int], { nullable: true }),
    __metadata("design:type", Array)
], ScheduleInput.prototype, "services", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "extraDuration", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "groupId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "employee", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "bookingId", void 0);
__decorate([
    (0, graphql_1.Field)(() => schedules_type_1.SchedulesType, {
        nullable: true,
        defaultValue: schedules_type_1.SchedulesType.DEFAULT,
    }),
    __metadata("design:type", String)
], ScheduleInput.prototype, "type", void 0);
ScheduleInput = __decorate([
    (0, graphql_1.InputType)('ScheduleInput')
], ScheduleInput);
exports.ScheduleInput = ScheduleInput;
//# sourceMappingURL=schedules.input.js.map