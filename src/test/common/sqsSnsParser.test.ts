import { describe, expect, it } from 'vitest';
import { parseSqsOrSnsMessage } from '../../common/sqsSnsParser';

const directSqsMessage = JSON.stringify({
  id: '123',
  foo: 'bar'
});

const snsWrappedMessage = JSON.stringify({
  Type: 'Notification',
  MessageId: 'abc',
  TopicArn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
  Message: JSON.stringify({
    id: '456',
    foo: 'baz'
  })
});

describe('parseSqsOrSnsMessage', () => {
  it('parses a direct SQS message', () => {
    const result = parseSqsOrSnsMessage(directSqsMessage);
    expect(result).toEqual({ id: '123', foo: 'bar' });
  });

  it('parses an SNS-wrapped SQS message', () => {
    const result = parseSqsOrSnsMessage(snsWrappedMessage);
    expect(result).toEqual({ id: '456', foo: 'baz' });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseSqsOrSnsMessage('not-json')).toThrow('Record body is not valid JSON');
  });

  it('returns the parsed object if not SNS-wrapped', () => {
    const result = parseSqsOrSnsMessage('{"hello":"world"}');
    expect(result).toEqual({ hello: 'world' });
  });
});
