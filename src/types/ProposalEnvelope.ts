export interface FullText {
  path: string; // S3 path to the full text document
  uploadedAt: string; // ISO 8601 timestamp (immutable, should not be changed after initial upload)
  uploadedBy: string; // user name (immutable, should not be changed after initial upload)
}

export interface Attachment {
  path: string; // S3 path to the attachment
  type: string; // Optional type (e.g., 'justification', 'impact', 'supporting-document')
  uploadedAt: string; // ISO 8601 timestamp (immutable, should not be changed after initial upload)
  uploadedBy: string; // user name (immutable, should not be changed after initial upload)
}

export interface Interaction {
  type: string; // e.g., "approved", "viewed", "acknowledged"
  actor: string; // Who performed the interaction
  timestamp: string; // ISO 8601 format
  details?: string; // Optional extra context
}

export type EvaluationGraph = Record<string, any>; // JSON Logic graph

export interface ProposalEnvelope {
  id: string;
  codeReference: string; // e.g., "5-2-10"
  submittedAt: string; // ISO 8601 timestamp (immutable, should not be changed after initial submission)
  submittedBy: string; // User ID or name of the submitter (immutable, should not be changed after initial submission)
  changeType: 'add' | 'amend' | 'repeal';
  fullText: FullText; // Required full text document metadata
  attachments: Attachment[]; // Array of attachment objects
  evaluationGraph: EvaluationGraph; // JSON Logic graph for process evaluation
  traceId?: string; // Optional, for distributed tracing
  interactions: Interaction[]; // Non-invasive events such as "viewed", "approved", etc.
}
