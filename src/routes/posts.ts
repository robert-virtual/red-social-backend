import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";
import { auth } from "../middlewares/auth";
import { upload } from "../helpers/upload-s3";
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.json({});
});

router.post("/", upload.array("images"), async (req, res) => {
  let imagenes: { url: string }[] = [];
  console.log("body:", req.body);
  if (req.files) {
    console.log("Si hay archivos", req.files.length);
    let arr = req.files as Express.MulterS3.File[];
    arr.forEach((f) => {
      imagenes.push({ url: f.location });
    });
    console.log("imagenes", imagenes);
  }
  const user = await prisma.user.findFirst();
  const post = await prisma.post.create({
    data: {
      images: {
        create: imagenes,
      },
      content: req.body.content,
      userId: req.userId ?? user!.id,
    },
  });

  res.json({ msg: "post creado", post });
});

export default router;
