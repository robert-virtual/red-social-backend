import { Handler } from "express";
import { verify } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
  interface JwtPayload {
    id: string;
  }
}

export const auth: Handler = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return res.json({ msg: "no envio token en el header" });
  }
  try {
    let payload = verify(token, process.env.JWT_SECRET_ACCESS!) as JwtPayload;
    req.userId = payload.id;
    next();
  } catch (error) {
    console.log(error);

    return res.json({ msg: error });
  }
};
