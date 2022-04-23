import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";
import { auth } from "../middlewares/auth";
import { upload } from "../helpers/upload-s3";
const prisma = new PrismaClient();

router.post("/ktor", upload.array("images"),(req, res) => {
    console.log(req.files)
  res.json({msg:"hello"});
});


router.get("/", (req, res) => {
  res.json({});
});

router.post("/", auth, upload.array("images"), async (req, res) => {
  let imagenes: { url: string }[] = [];
  console.log(req.body.images);

  if (req.files) {
    let arr = req.files as Express.MulterS3.File[];
    arr.forEach((f) => {
      imagenes.push({ url: f.location });
    });
  }

  const post = await prisma.post.create({
    data: {
      images: {
        create: imagenes,
      },
      content: req.body.content,
      userId: req.userId!,
    },
  });

  res.json({ msg: "post creado", post });
});

export default router;
