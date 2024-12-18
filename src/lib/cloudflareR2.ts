import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadAvatarToR2(
  fileName: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const key = `avatars/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
  await r2Client.send(command);
  return `https://${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function deleteAvatarFromR2(fileName: string): Promise<void> {
  const key = `avatars/${fileName}`;
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  await r2Client.send(command);
}

export async function uploadMemeToR2(
  fileName: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const key = `memes/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
  await r2Client.send(command);
  return `https://${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function deleteMemeFromR2(fileName: string): Promise<void> {
  const key = `memes/${fileName}`;
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  await r2Client.send(command);
}

export { r2Client };
