// src/config/index.ts

/**
 * Global configuration root for the application.
 * Reads from environment variables or provides sensible defaults.
 */
export const config = {
  proposalBucket: process.env.PROPOSAL_BUCKET || 'default-proposal-bucket',
  // Add more global config values as needed
};
