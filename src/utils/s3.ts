const s3 = new Bun.S3Client({
  bucket: 'variants',
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
});

export const getS3 = () => s3;
