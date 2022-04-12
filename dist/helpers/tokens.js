"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRefreshToken = exports.genAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function genAccessToken({ id, rid }) {
    return (0, jsonwebtoken_1.sign)({ id, rid }, process.env.JWT_SECRET_ACCESS, {
        expiresIn: "20m",
    });
}
exports.genAccessToken = genAccessToken;
function genRefreshToken({ id }) {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET_REFRESH);
}
exports.genRefreshToken = genRefreshToken;
//# sourceMappingURL=tokens.js.map