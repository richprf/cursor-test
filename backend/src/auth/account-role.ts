export const ACCOUNT_ROLES = ['BUYER', 'SELLER'] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];
