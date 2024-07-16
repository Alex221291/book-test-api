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
exports.AnalyticsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const analytics_service_1 = require("./analytics.service");
const analytics_dashboard_1 = require("./types/analytics.dashboard");
const analytics_chart_1 = require("./types/analytics.chart");
let AnalyticsResolver = class AnalyticsResolver {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardStats(company, dateStart, dateFinish) {
        const entity = new analytics_dashboard_1.default();
        entity.revenue = await this.analyticsService.getRevenue(company, dateStart, dateFinish);
        entity.average = await this.analyticsService.getAverage(company, dateStart, dateFinish);
        entity.revenueByEmployee = await this.analyticsService.revenueByEmployee(company, dateStart, dateFinish);
        entity.revenueByServices = await this.analyticsService.revenueByServices(company, dateStart, dateFinish);
        entity.loadingDynamic = await this.analyticsService.getLoadingDynamic(company, dateStart, dateFinish);
        entity.servicesRate = await this.analyticsService.getServicesRate(company, dateStart, dateFinish);
        entity.totalBookings = await this.analyticsService.getAllBookings(company, dateStart, dateFinish);
        entity.totalCancelledBookings =
            await this.analyticsService.getCancelledBookings(company, dateStart, dateFinish);
        entity.totalCompletedBookings =
            await this.analyticsService.getCompletedBookings(company, dateStart, dateFinish);
        return entity;
    }
    async getCustomerVisitsByServices(customerId, serviceIds) {
        const data = await this.analyticsService.customerVisitsByService(customerId, serviceIds);
        return data
            .filter((el) => serviceIds.findIndex((id) => { var _a; return ((_a = el === null || el === void 0 ? void 0 : el.group) === null || _a === void 0 ? void 0 : _a.indexOf(id)) > -1; }) > -1)
            .map((el) => ({
            label: el.label,
            value: el.total,
            type: el.type,
        }));
    }
};
__decorate([
    (0, graphql_1.Query)(() => analytics_dashboard_1.default),
    __param(0, (0, graphql_1.Args)('company')),
    __param(1, (0, graphql_1.Args)('dateStart')),
    __param(2, (0, graphql_1.Args)('dateFinish')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getDashboardStats", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_chart_1.default]),
    __param(0, (0, graphql_1.Args)('customerId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('serviceIds', { type: () => [graphql_1.Int] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getCustomerVisitsByServices", null);
AnalyticsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsResolver);
exports.AnalyticsResolver = AnalyticsResolver;
//# sourceMappingURL=analytics.resolver.js.map