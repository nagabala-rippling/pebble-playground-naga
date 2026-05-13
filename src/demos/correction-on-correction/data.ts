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

export type Variation = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8' | 'composite';

export type VariationKind = 'overlay' | 'inline' | 'workspace' | 'transient';

export const VARIATION_KIND: Record<Variation, VariationKind> = {
  v1: 'overlay',
  v2: 'overlay',
  v3: 'overlay',
  v4: 'inline',
  v5: 'inline',
  v6: 'inline',
  v7: 'workspace',
  v8: 'transient',
  composite: 'inline',
};

export const VARIATION_LABELS: Record<Variation, string> = {
  v1: 'V1 · Baseline (PRD)',
  v2: 'V2 · Unified Modal',
  v3: 'V3 · Chain Drawer',
  v4: 'V4 · Status-Aware Pill',
  v5: 'V5 · Inline Chain Strip',
  v6: 'V6 · Promoted Notice',
  v7: 'V7 · Correction Workspace',
  v8: 'V8 · Smart Routing',
  composite: 'Composite · V4 + V5 + V6',
};

export const VARIATION_TAGLINES: Record<Variation, string> = {
  v1: 'GP redirect · US modal',
  v2: 'Same modal, different primary',
  v3: 'Side drawer with full chain',
  v4: 'Button label adapts to chain state',
  v5: 'Expandable inline strip per row',
  v6: 'Notice banner is the entry',
  v7: 'Full-page workspace with chain rail',
  v8: 'Invisible — routes to the right place',
  composite: 'Pill + strip + notice together',
};

export const VARIATION_DESCRIPTIONS: Record<Variation, string> = {
  v1: 'PRD as written. GP auto-redirects into Create Correction with the latest correction pre-selected as reference. US shows a modal with View latest / Create new / Cancel.',
  v2: 'Both models get a modal, but the primary action differs. GP modal: "Continue from Correction 3". US modal: "Create new correction" with secondary "View latest". One pattern, two semantics.',
  v3: 'Both models open a side drawer that visualizes the full correction chain. GP only lets the tip be actionable; US lets reference + each link be actionable. Educational, makes chain explicit.',
  v4: 'No modal. The "Create Correction" button itself becomes a context-aware pill that adapts to the chain state: "Continue chain · 3 →" for GP with corrections, split button "Create new / View 2 existing" for US with corrections, "Finish pending correction →" if a draft is in flight, "Locked" with tooltip when blocked.',
  v5: 'Each row that has corrections shows a compact summary line beneath it: "▸ This run has 3 corrections · Latest approved by Naga on May 10". Expand inline to see the chain with action buttons per link. Stays inside the table — no overlay.',
  v6: 'Leverages the existing `runCorrectionInfoNotice` banner on the run preview page. Promotes it from informational to interactive: the banner becomes the primary entry point with the right CTA per model. Most conservative — reuses what already exists.',
  v7: 'Click "Create Correction" opens a focused full-page workspace. Left rail visualizes the chain (tree for GP, list for US); right pane is the create-correction form pre-filled with the right reference. Chain stays visible while editing. Best for deep chains.',
  v8: 'No new UI at all. Clicking "Create Correction" just navigates to the right place based on context: GP → tip-selected, US → chooser, blocked → toast. Invisible to users in the happy path. Costs disambiguation.',
  composite:
    'Combines V4 (smart pill), V5 (inline strip), and V6 (notice banner). The notice anchors the entry, the pill speeds up the click, the strip lets admins peek without leaving the table. Most surface area, most options.',
};

export const VARIATION_ORDER: Variation[] = [
  'v1',
  'v2',
  'v3',
  'v4',
  'v5',
  'v6',
  'v7',
  'v8',
  'composite',
];
