"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsePhoneNumber = (str) => {
    let phone = str.replace(/[\s\(\)\-]/gi, '');
    if (phone.length > 0 && phone[0] !== '+') {
        phone = `+${phone}`;
    }
    return phone;
};
exports.default = parsePhoneNumber;
//# sourceMappingURL=parsePhoneNumber.js.map