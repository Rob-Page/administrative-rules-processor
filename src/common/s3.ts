import { S3 } from 'aws-sdk';

const s3 = new S3();

/**
 * Reads a JSON object from S3 and parses it.
 * @param bucket - S3 bucket name
 * @param key - S3 object key
 */
export async function readJsonFromS3<T>(bucket: string, key: string): Promise<T> {
  const result = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  if (!result.Body) throw new Error('No data found in S3 object');
  return JSON.parse(result.Body.toString('utf-8')) as T;
}

/**
 * Writes a JSON object to S3.
 * @param bucket - S3 bucket name
 * @param key - S3 object key
 * @param data - The object to write
 */
export async function writeJsonToS3<T>(bucket: string, key: string, data: T): Promise<void> {
  await s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  }).promise();
}
