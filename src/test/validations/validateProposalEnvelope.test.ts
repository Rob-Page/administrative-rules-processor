import { describe, expect, it } from 'vitest';
import { ProposalEnvelope } from '../../types/ProposalEnvelope';
import { errorsFoundInProposalEnvelopeShape } from '../../validations/validateProposalEnvelope';

describe('errorsFoundInProposalEnvelopeShape', () => {
  const validEnvelope: ProposalEnvelope = {
    id: '123',
    codeReference: '5-2-10',
    submittedAt: '2025-06-21T12:00:00Z',
    submittedBy: 'user1',
    changeType: 'add',
    fullText: {
      path: 's3://bucket/fulltext.txt',
      uploadedAt: '2025-06-21T12:00:00Z',
      uploadedBy: 'user1',
    },
    attachments: [
      {
        path: 's3://bucket/attachment1.pdf',
        type: 'supporting-document',
        uploadedAt: '2025-06-21T12:00:00Z',
        uploadedBy: 'user1',
      }
    ],
    evaluationGraph: { "==": [ { "var": "changeType" }, "add" ] },
    interactions: [
      {
        type: 'approved',
        actor: 'user2',
        timestamp: '2025-06-21T13:00:00Z',
      }
    ],
  };

  it('should return an empty array for a valid envelope', () => {
    expect(errorsFoundInProposalEnvelopeShape(validEnvelope)).toEqual([]);
  });

  it('should report missing id', () => {
    const invalid = { ...validEnvelope, id: undefined };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Envelope missing required field: id');
  });

  it('should report missing fullText', () => {
    const invalid = { ...validEnvelope, fullText: undefined };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Envelope missing required field: fullText');
  });

  it('should report attachments is not an array', () => {
    const invalid = { ...validEnvelope, attachments: null };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Envelope missing or invalid field: attachments');
  });

  it('should report missing attachment path', () => {
    const invalid = { ...validEnvelope, attachments: [{ ...validEnvelope.attachments[0], path: undefined }] };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Attachment[0] missing required field: path');
  });

  it('should report invalid changeType', () => {
    const invalid = { ...validEnvelope, changeType: 'invalid' };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Envelope missing or invalid field: changeType');
  });

  it('should report missing evaluationGraph', () => {
    const invalid = { ...validEnvelope, evaluationGraph: undefined };
    expect(errorsFoundInProposalEnvelopeShape(invalid)).toContain('Envelope missing required field: evaluationGraph');
  });

  it('should report multiple errors at once', () => {
    const invalid = { id: undefined, attachments: null };
    const errors = errorsFoundInProposalEnvelopeShape(invalid);
    expect(errors).toContain('Envelope missing required field: id');
    expect(errors).toContain('Envelope missing required field: codeReference');
    expect(errors).toContain('Envelope missing required field: submittedAt');
    expect(errors).toContain('Envelope missing required field: submittedBy');
    expect(errors).toContain('Envelope missing or invalid field: attachments');
    expect(errors.length).toBeGreaterThan(1);
  });
});
