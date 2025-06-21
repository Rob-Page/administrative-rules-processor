
/**
 * Checks the given object for ProposalEnvelope shape errors.
 * Returns an array of error messages for all missing/invalid fields.
 */
export function errorsFoundInProposalEnvelopeShape(obj: any): string[] {
  const errors: string[] = [];
  if (!obj || typeof obj !== 'object') {
    errors.push('Envelope must be an object');
    return errors;
  }
  if (!obj.id || typeof obj.id !== 'string') {
    errors.push('Envelope missing required field: id');
  }
  if (!obj.codeReference || typeof obj.codeReference !== 'string') {
    errors.push('Envelope missing required field: codeReference');
  }
  if (!obj.submittedAt || typeof obj.submittedAt !== 'string') {
    errors.push('Envelope missing required field: submittedAt');
  }
  if (!obj.submittedBy || typeof obj.submittedBy !== 'string') {
    errors.push('Envelope missing required field: submittedBy');
  }
  if (!obj.changeType || !['add', 'amend', 'repeal'].includes(obj.changeType)) {
    errors.push('Envelope missing or invalid field: changeType');
  }
  if (!obj.fullText || typeof obj.fullText !== 'object') {
    errors.push('Envelope missing required field: fullText');
  } else {
    if (!obj.fullText.path || typeof obj.fullText.path !== 'string') {
      errors.push('Envelope fullText missing required field: path');
    }
    if (!obj.fullText.uploadedAt || typeof obj.fullText.uploadedAt !== 'string') {
      errors.push('Envelope fullText missing required field: uploadedAt');
    }
    if (!obj.fullText.uploadedBy || typeof obj.fullText.uploadedBy !== 'string') {
      errors.push('Envelope fullText missing required field: uploadedBy');
    }
  }
  if (!Array.isArray(obj.attachments)) {
    errors.push('Envelope missing or invalid field: attachments');
  } else {
    obj.attachments.forEach((att: any, i: number) => {
      if (!att.path || typeof att.path !== 'string') {
        errors.push(`Attachment[${i}] missing required field: path`);
      }
      if (!att.type || typeof att.type !== 'string') {
        errors.push(`Attachment[${i}] missing required field: type`);
      }
      if (!att.uploadedAt || typeof att.uploadedAt !== 'string') {
        errors.push(`Attachment[${i}] missing required field: uploadedAt`);
      }
      if (!att.uploadedBy || typeof att.uploadedBy !== 'string') {
        errors.push(`Attachment[${i}] missing required field: uploadedBy`);
      }
    });
  }
  if (!obj.evaluationGraph || typeof obj.evaluationGraph !== 'object') {
    errors.push('Envelope missing required field: evaluationGraph');
  }
  return errors;
}
