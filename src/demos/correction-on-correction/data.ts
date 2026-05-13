// Mock data for "correction on correction" prototype
//
// Two correction models:
// - **GP** (chained): each new correction targets the previous correction. To
//   correct a corrected run, admin must continue from the latest correction.
// - **US** (linear): each correction targets the original reference run.

export type CorrectionModel = 'GP' | 'US';

export interface CorrectionLink {
  /** Reconciliation process ID (this is what the URL needs) */
  reconProcessId: string;
  /** Display title shown in UI */
  title: string;
  /** "Correction 1", "Correction 2", ... */
  ordinal: string;
  status: 'Approved' | 'Paid' | 'Draft' | 'In Progress';
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
}

export interface ReferenceRun {
  runId: string;
  displayName: string;
  subTitle?: string;
  countryCode: string;
  countryName: string;
  entityId: string;
  entityDisplayName: string;
  numberOfEmployeesInvolved: number;
  payDate: string;
  status: 'Approved' | 'Paid';
}

export interface CorrectionChain {
  model: CorrectionModel;
  reference: ReferenceRun;
  /** Ordered chronologically. For GP, each correction targets the previous one.
   *  For US, each correction targets the reference run. */
  corrections: CorrectionLink[];
}

// ─── Mock GP chain ─────────────────────────────────────────────────

export const GP_CHAIN: CorrectionChain = {
  model: 'GP',
  reference: {
    runId: 'r-uk-apr-2026',
    displayName: 'Apr 01 - Apr 30',
    subTitle: 'Monthly Auto Approve: True',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    entityId: 'ent-uk-1',
    entityDisplayName: 'Carter-Ruiz, GB Pvt. Ltd.',
    numberOfEmployeesInvolved: 38,
    payDate: 'Apr 30, 2026',
    status: 'Paid',
  },
  corrections: [
    {
      reconProcessId: 'rp-gb-1',
      title: 'Correction: Apr 01 - Apr 30',
      ordinal: 'Correction 1',
      status: 'Approved',
      createdAt: 'May 02, 2026',
      approvedAt: 'May 03, 2026',
      approvedBy: 'Naga Bala',
    },
    {
      reconProcessId: 'rp-gb-2',
      title: 'Correction 2: Apr 01 - Apr 30',
      ordinal: 'Correction 2',
      status: 'Approved',
      createdAt: 'May 05, 2026',
      approvedAt: 'May 06, 2026',
      approvedBy: 'Subhankar G.',
    },
    {
      reconProcessId: 'rp-gb-3',
      title: 'Correction 3: Apr 01 - Apr 30',
      ordinal: 'Correction 3',
      status: 'Approved',
      createdAt: 'May 09, 2026',
      approvedAt: 'May 10, 2026',
      approvedBy: 'Naga Bala',
    },
  ],
};

// ─── Mock US chain ─────────────────────────────────────────────────

export const US_CHAIN: CorrectionChain = {
  model: 'US',
  reference: {
    runId: 'r-us-may-2026',
    displayName: 'May 01 - May 30: Regular Pay',
    subTitle: 'Monthly Auto Approve: True',
    countryCode: 'US',
    countryName: 'United States',
    entityId: 'ent-us-1',
    entityDisplayName: 'Carter-Ruiz',
    numberOfEmployeesInvolved: 142,
    payDate: 'May 29, 2026',
    status: 'Approved',
  },
  corrections: [
    {
      reconProcessId: 'rp-us-1',
      title: 'Correction: May 01 - May 30',
      ordinal: 'Correction 1',
      status: 'Approved',
      createdAt: 'Jun 02, 2026',
      approvedAt: 'Jun 03, 2026',
      approvedBy: 'Naga Bala',
    },
    {
      reconProcessId: 'rp-us-2',
      title: 'Correction 2: May 01 - May 30',
      ordinal: 'Correction 2',
      status: 'Approved',
      createdAt: 'Jun 05, 2026',
      approvedAt: 'Jun 06, 2026',
      approvedBy: 'Subhankar G.',
    },
  ],
};

// Convenience: get the latest correction in the chain
export function latestCorrection(chain: CorrectionChain): CorrectionLink {
  return chain.corrections[chain.corrections.length - 1];
}

// Build the redirect URL the PRD calls out for GP
export function buildGPRedirectUrl(chain: CorrectionChain): string {
  const tip = latestCorrection(chain);
  return `/global-payroll/admin/correction-create/${chain.reference.entityId}/select-entity/${tip.reconProcessId}`;
}

export function buildUSViewCorrectionUrl(reconProcessId: string): string {
  return `/global-payroll/admin/correction/${reconProcessId}`;
}

// ─── Variation enum ────────────────────────────────────────────────

export type Variation = 'v1' | 'v2' | 'v3';

export const VARIATION_LABELS: Record<Variation, string> = {
  v1: 'V1 · Baseline (PRD)',
  v2: 'V2 · Unified Modal',
  v3: 'V3 · Chain Drawer',
};

export const VARIATION_DESCRIPTIONS: Record<Variation, string> = {
  v1: 'GP auto-redirects into Create Correction flow with the latest correction pre-selected. US shows a modal with View / Create new / Cancel.',
  v2: 'Both GP and US show a modal, but with different primary actions. GP pre-selects the latest correction; US offers a choice.',
  v3: 'Both GP and US open a side drawer that visualizes the full correction chain. GP only lets you continue from the tip; US lets you pick any link.',
};
