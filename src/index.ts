import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      // Parse the envelope from the SQS message
      const envelope = JSON.parse(record.body);
      // Validate presence of processGraph and documentation
      if (envelope.processGraph && envelope.documentation) {
        // TODO: Move to Processing Proposals state (e.g., update DB, emit event, etc.)
        console.log('Envelope valid, processing:', envelope);
      } else {
        // TODO: Send to DLQ (handled by SQS redrive policy)
        console.error('Envelope missing required fields:', envelope);
        throw new Error('Missing processGraph or documentation');
      }
    } catch (err) {
      console.error('Error processing envelope:', err);
      throw err; // Let Lambda/SQS handle retries and DLQ
    }
  }
};
