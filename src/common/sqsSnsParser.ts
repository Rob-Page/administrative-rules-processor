// src/common/sqsSnsParser.ts

/**
 * Extracts the original message from an SQS record body, handling both direct SQS and SNS-wrapped messages.
 * @param recordBody The SQS record body (string)
 * @returns The parsed message object
 * @throws If the message cannot be parsed
 */
export function parseSqsOrSnsMessage<T = any>(recordBody: string): T {
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(recordBody);
  } catch (e) {
    throw new Error("Record body is not valid JSON");
  }
  if (parsedBody && parsedBody.Type === "Notification" && parsedBody.Message) {
    // SNS-wrapped message
    return JSON.parse(parsedBody.Message);
  } else {
    // Direct SQS message
    return parsedBody;
  }
}
