"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const argon2_1 = require("argon2");
const tokens_1 = require("../helpers/tokens");
const prisma = new client_1.PrismaClient();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password } = req.body;
    password = yield (0, argon2_1.hash)(password);
    const user = yield prisma.user.create({
        data: {
            email,
            name,
            password,
        },
    });
    const rToken = (0, tokens_1.genRefreshToken)(user);
    const { id: rid } = yield prisma.tokens.create({
        data: {
            token: rToken,
            userId: user.id,
        },
    });
    const aToken = (0, tokens_1.genAccessToken)({ id: user.id, rid });
    res.json({ user, aToken, rToken });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return res.json({ msg: "Bad Credentials" });
    }
    const valido = yield (0, argon2_1.verify)(user.password, password);
    if (!valido) {
        return res.json({ msg: "Bad Credentials" });
    }
    const rToken = (0, tokens_1.genRefreshToken)(user);
    const { id: rid } = yield prisma.tokens.create({
        data: {
            token: rToken,
            userId: user.id,
        },
    });
    const aToken = (0, tokens_1.genAccessToken)({ id: user.id, rid });
    res.json({ user, aToken, rToken });
}));
router.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.query;
    if (!refreshToken) {
        return res.json({ msg: "No envio Refresh token" });
    }
    let payload;
    try {
        payload = (0, jsonwebtoken_1.verify)(String(refreshToken), process.env.JWT_SECRET_REFRESH);
        const tokens = yield prisma.tokens.findMany({
            where: {
                userId: payload.id,
            },
        });
        let exists = tokens.find((t) => t.token == refreshToken);
        if (!exists) {
            return res.json({ msg: "Token invalido" });
        }
        const aToken = (0, tokens_1.genAccessToken)({ id: payload.id, rid: exists.id });
        res.json({ aToken });
    }
    catch (error) {
        console.log(error);
        res.json({ msg: "Error al verificar el jwt" });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map