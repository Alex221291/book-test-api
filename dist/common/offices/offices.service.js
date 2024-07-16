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
exports.OfficesService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../base/base.service");
const offices_entity_1 = require("./offices.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OfficesService = class OfficesService extends base_service_1.BaseService {
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async getOfficeWorkTime(officeId, date) {
        const regExp = /^([0-9]{2})([0-9]{2})/;
        const day = date.toFormat('ccc');
        const office = await this.findOneBy({
            id: officeId,
        });
        if (office === null || office === void 0 ? void 0 : office.workingDays) {
            const workDays = JSON.parse(office.workingDays);
            const workTime = workDays[day];
            if (workTime) {
                const from = workTime.from.replace(regExp, '$1.$2').split('.');
                const to = workTime.to.replace(regExp, '$1.$2').split('.');
                const startWorkDateTime = date.setZone(office.company.timezone).set({
                    hour: from[0],
                    minute: from[1],
                    second: 0,
                    millisecond: 0,
                });
                const finishWorkDateTime = date.setZone(office.company.timezone).set({
                    hour: to[0],
                    minute: to[1],
                    second: 0,
                    millisecond: 0,
                });
                return [startWorkDateTime, finishWorkDateTime];
            }
            return [null, null];
        }
        throw new common_1.NotFoundException('working.hours.not.configured');
    }
};
OfficesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(offices_entity_1.OfficesEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OfficesService);
exports.OfficesService = OfficesService;
//# sourceMappingURL=offices.service.js.map