import { sign } from "jsonwebtoken";

export function genAccessToken({ id, rid }: { id: string; rid: string }) {
  return sign({ id, rid }, process.env.JWT_SECRET_ACCESS!, {
    expiresIn: "20m",
  });
}

export function genRefreshToken({ id }: { id: string }) {
  return sign({ id }, process.env.JWT_SECRET_REFRESH!);
}
