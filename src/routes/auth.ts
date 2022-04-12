import { Router } from "express";
const router = Router();
import { verify as verifyJWT } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { hash, verify } from "argon2";
import { genAccessToken, genRefreshToken } from "../helpers/tokens";
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;

  password = await hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
  const rToken = genRefreshToken(user);
  const { id: rid } = await prisma.tokens.create({
    data: {
      token: rToken,
      userId: user.id,
    },
  });
  const aToken = genAccessToken({ id: user.id, rid });
  res.json({ user, aToken, rToken });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.json({ msg: "Bad Credentials" });
  }
  // verificar password
  const valido = await verify(user.password, password);
  if (!valido) {
    return res.json({ msg: "Bad Credentials" });
  }
  const rToken = genRefreshToken(user);
  const { id: rid } = await prisma.tokens.create({
    data: {
      token: rToken,
      userId: user.id,
    },
  });
  const aToken = genAccessToken({ id: user.id, rid });

  res.json({ user, aToken, rToken });
});
router.get("/refresh", async (req, res) => {
  const { refreshToken } = req.query;
  if (!refreshToken) {
    return res.json({ msg: "No envio Refresh token" });
  }
  let payload;
  try {
    payload = verifyJWT(String(refreshToken), process.env.JWT_SECRET_REFRESH!);
    const tokens = await prisma.tokens.findMany({
      where: {
        userId: payload.id,
      },
    });
    let exists = tokens.find((t) => t.token == refreshToken);
    if (!exists) {
      return res.json({ msg: "Token invalido" });
    }
    const aToken = genAccessToken({ id: payload.id, rid: exists!.id });
    res.json({ aToken });
  } catch (error) {
    console.log(error);

    res.json({ msg: "Error al verificar el jwt" });
  }
});

export default router;
