import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { HttpError, readBytes } from "./security.js";
export const uploadRoot = () =>
  path.resolve(
    /* turbopackIgnore: true */ process.env.UPLOAD_DIR || ".uploads",
  );
export async function readImage(req) {
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data"))
    throw new HttpError(415, "Choose an image file.");
  const bytes = await readBytes(req, 6 * 1024 * 1024);
  let form;
  try {
    form = await new Response(bytes, {
      headers: { "content-type": req.headers.get("content-type") },
    }).formData();
  } catch {
    throw new HttpError(400, "The image upload could not be read.");
  }
  const file = form.get("file");
  if (
    !file ||
    typeof file.arrayBuffer !== "function" ||
    file.size === 0 ||
    file.size > 5 * 1024 * 1024
  )
    throw new HttpError(400, "Choose a JPG, PNG or WebP image up to 5 MB.");
  let output;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, {
      limitInputPixels: 25000000,
    }).metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format)) throw Error();
    output = await sharp(input, { limitInputPixels: 25000000 })
      .rotate()
      .resize({
        width: 2200,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 88 })
      .toBuffer();
  } catch {
    throw new HttpError(400, "Upload a valid JPG, PNG or WebP image.");
  }
  return output;
}
export async function saveImage(buffer) {
  const key = randomUUID() + ".jpg";
  await fs.mkdir(uploadRoot(), { recursive: true, mode: 0o700 });
  await fs.writeFile(path.join(uploadRoot(), key), buffer, {
    mode: 0o600,
    flag: "wx",
  });
  return key;
}
export async function removeFile(key) {
  await fs.unlink(path.join(uploadRoot(), key)).catch(() => {});
}
export async function loadImage(key) {
  if (!/^[a-f0-9-]+\.jpg$/.test(key))
    throw new HttpError(404, "File not found.");
  try {
    return await fs.readFile(path.join(uploadRoot(), key));
  } catch {
    throw new HttpError(404, "File not found.");
  }
}
