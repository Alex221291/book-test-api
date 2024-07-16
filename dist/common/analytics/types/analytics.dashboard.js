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
const analytics_chart_1 = require("./analytics.chart");
let AnalyticsDashboard = class AnalyticsDashboard {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AnalyticsDashboard.prototype, "revenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AnalyticsDashboard.prototype, "average", void 0);
__decorate([
    (0, graphql_1.Field)(() => [analytics_chart_1.default]),
    __metadata("design:type", Array)
], AnalyticsDashboard.prototype, "servicesRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [analytics_chart_1.default]),
    __metadata("design:type", Array)
], AnalyticsDashboard.prototype, "loadingDynamic", void 0);
__decorate([
    (0, graphql_1.Field)(() => [analytics_chart_1.default]),
    __metadata("design:type", Array)
], AnalyticsDashboard.prototype, "revenueByEmployee", void 0);
__decorate([
    (0, graphql_1.Field)(() => [analytics_chart_1.default]),
    __metadata("design:type", Array)
], AnalyticsDashboard.prototype, "revenueByServices", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsDashboard.prototype, "totalBookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsDashboard.prototype, "totalCancelledBookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsDashboard.prototype, "totalCompletedBookings", void 0);
AnalyticsDashboard = __decorate([
    (0, graphql_1.ObjectType)()
], AnalyticsDashboard);
exports.default = AnalyticsDashboard;
//# sourceMappingURL=analytics.dashboard.js.map