import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readJsonFromS3, writeJsonToS3 } from '../../common/s3';

vi.mock('aws-sdk', () => {
  const getObjectMock = vi.fn();
  const putObjectMock = vi.fn();
  return {
    S3: vi.fn(() => ({
      getObject: getObjectMock,
      putObject: putObjectMock,
    })),
    __mocks__: { getObjectMock, putObjectMock },
  };
});

const { __mocks__ } = await import('aws-sdk');

const bucket = 'test-bucket';
const key = 'test-key.json';
const testData = { foo: 'bar' };

describe('s3 utils', () => {
  beforeEach(() => {
    __mocks__.getObjectMock.mockReset();
    __mocks__.putObjectMock.mockReset();
  });

  it('readJsonFromS3 should parse and return JSON from S3', async () => {
    __mocks__.getObjectMock.mockReturnValue({
      promise: () => Promise.resolve({ Body: Buffer.from(JSON.stringify(testData)) })
    });
    const result = await readJsonFromS3<typeof testData>(bucket, key);
    expect(result).toEqual(testData);
    expect(__mocks__.getObjectMock).toHaveBeenCalledWith({ Bucket: bucket, Key: key });
  });

  it('readJsonFromS3 should throw if no data found', async () => {
    __mocks__.getObjectMock.mockReturnValue({
      promise: () => Promise.resolve({ Body: undefined })
    });
    await expect(readJsonFromS3(bucket, key)).rejects.toThrow('No data found in S3 object');
  });

  it('writeJsonToS3 should write JSON to S3', async () => {
    __mocks__.putObjectMock.mockReturnValue({
      promise: () => Promise.resolve()
    });
    await writeJsonToS3(bucket, key, testData);
    expect(__mocks__.putObjectMock).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(testData),
      ContentType: 'application/json',
    });
  });
});
