const env = require("dotenv");
env.config();

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.config().parsed.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.config().parsed.AWS_SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: "prath-private",
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 200000,
  });
  return signedUrl;
}

async function putObject(filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: "prath-private",
    Key: `/uploads/user-uploads/${filename}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 200000 });
  return url;
}

async function listObjectes() {
  const command = new ListObjectsV2Command({
    Bucket: "prath-private",
    Key: "/",
  });

  const url = await s3Client.send(command);
  console.log(url);
}

async function deleteObject(filename) {
  const cmd = new DeleteObjectCommand({
    Bucket: "prath-private",
    Key: `/uploads/user-uploads/${filename}`,
  });
  await s3Client.send(cmd);
}

async function init() {
  // const data = new Date();
  // console.log(data.getMinutes());
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log(await getObjectURL("WIN_20240731_15_08_44_Pro.mp4"));

  // console.log(await putObject(`image-${Date.now()}.jpeg`, "image/jpeg"));

  // await listObjectes();

  // await deleteObject("image-1724218699838.jpeg");
}

init();
