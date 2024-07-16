"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesType = void 0;
const graphql_1 = require("@nestjs/graphql");
var SchedulesType;
(function (SchedulesType) {
    SchedulesType["GROUP"] = "GROUP";
    SchedulesType["DEFAULT"] = "DEFAULT";
    SchedulesType["DAYOFF"] = "DAYOFF";
    SchedulesType["TIMEOFF"] = "TIMEOFF";
    SchedulesType["VACATION"] = "VACATION";
    SchedulesType["SICK"] = "SICK";
})(SchedulesType = exports.SchedulesType || (exports.SchedulesType = {}));
(0, graphql_1.registerEnumType)(SchedulesType, {
    name: 'SchedulesType',
});
//# sourceMappingURL=schedules.type.js.map