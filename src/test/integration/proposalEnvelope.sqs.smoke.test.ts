import { S3, SQS } from 'aws-sdk';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';

const sqs = new SQS({ region: process.env.AWS_REGION || 'us-east-1' });
const s3 = new S3({ region: process.env.AWS_REGION || 'us-east-1' });

const QUEUE_URL = process.env.QUEUE_URL!;
const PROPOSAL_BUCKET = process.env.PROPOSAL_BUCKET!;

describe('Proposal Envelope Lambda SQS->S3 Smoke Test', () => {
  it('should process a proposal envelope from SQS and write to S3', async () => {
    const testId = uuidv4();
    const testEnvelope = {
      id: testId,
      codeReference: "5-2-10",
      submittedAt: new Date().toISOString(),
      submittedBy: "smoke-tester",
      changeType: "add",
      fullText: {
        path: "s3://some-bucket/fulltext.txt",
        uploadedAt: new Date().toISOString(),
        uploadedBy: "smoke-tester"
      },
      attachments: [],
      evaluationGraph: {},
      interactions: []
    };

    // 1. Send to SQS
    await sqs.sendMessage({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(testEnvelope)
    }).promise();

    // 2. Wait for Lambda to process (poll S3 for up to 60 seconds, every 5 seconds)
    let found = false;
    for (let i = 0; i < 12; i++) { // 12 * 5s = 60s
      try {
        await s3.headObject({
          Bucket: PROPOSAL_BUCKET,
          Key: `${testId}.json`
        }).promise();
        found = true;
        break;
      } catch (err) {
        await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds
      }
    }

    expect(found).toBe(true);

    // 3. (Optional) Clean up
    await s3.deleteObject({
      Bucket: PROPOSAL_BUCKET,
      Key: `${testId}.json`
    }).promise();
  }, 120000); // Set timeout to 2 minutes
});
