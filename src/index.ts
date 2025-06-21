import { SQSEvent, SQSHandler } from "aws-lambda";
import { writeJsonToS3 } from "./common/s3";
import { config } from "./config";
import { ProposalEnvelope } from "./types/ProposalEnvelope";
import { errorsFoundInProposalEnvelopeShape } from "./validations/validateProposalEnvelope";

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      console.info("[Parse] Parsing and validating envelope from SQS record", {
        recordBody: record.body,
      });
      const envelope: ProposalEnvelope = JSON.parse(record.body);
      const errors = errorsFoundInProposalEnvelopeShape(envelope);
      if (errors.length > 0) {
        console.error("[ValidationError] Envelope failed validation", {
          envelopeId: envelope.id,
          errors,
          recordBody: record.body,
        });
        throw new Error(`Envelope validation failed: ${errors.join(", ")}`);
      }
      await writeJsonToS3(config.proposalBucket, `${envelope.id}.json`, envelope);
      console.info("[Success] Envelope validated and written to S3", {
        envelopeId: envelope.id,
        bucket: config.proposalBucket,
        s3Key: `${envelope.id}.json`,
      });
    } catch (err) {
      console.error("[ProcessingError] Error processing envelope", {
        error: err instanceof Error ? err.message : err,
        recordBody: record.body,
      });
      throw err; // Let Lambda/SQS handle retries and DLQ
    }
  }
};
