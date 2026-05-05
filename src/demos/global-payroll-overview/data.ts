export type Tab =
  | 'upcomingAndDraft'
  | 'failed'
  | 'submitted'
  | 'completed'
  | 'corrections'
  | 'archived';

export const TAB_LABELS = [
  'Upcoming & Draft',
  'Failed',
  'Submitted',
  'Completed',
  'Corrections',
  'Archived',
];

export type RunStatus =
  | 'Draft'
  | 'Upcoming'
  | 'Submitted'
  | 'Approved'
  | 'Paid'
  | 'On hold'
  | 'Failed'
  | 'Archived'
  | 'Needs review';

export interface RunRecord {
  id: string;
  entityName: string;
  country: string;
  flag: string;
  takeActionBy: string | null;
  payDate: string;
  status: RunStatus;
  changedBy?: string;
}

export const PAYROLL_RUNS: RunRecord[] = [
  // upcoming / draft
  {
    id: 'r-us-1',
    entityName: 'ACME US Inc',
    country: 'United States',
    flag: '🇺🇸',
    takeActionBy: 'May 12, 2026',
    payDate: 'May 15, 2026',
    status: 'Draft',
  },
  {
    id: 'r-uk-1',
    entityName: 'ACME UK Ltd',
    country: 'United Kingdom',
    flag: '🇬🇧',
    takeActionBy: 'May 18, 2026',
    payDate: 'May 22, 2026',
    status: 'Upcoming',
  },
  {
    id: 'r-de-1',
    entityName: 'ACME Deutschland GmbH',
    country: 'Germany',
    flag: '🇩🇪',
    takeActionBy: 'May 25, 2026',
    payDate: 'May 31, 2026',
    status: 'Upcoming',
  },
  {
    id: 'r-in-1',
    entityName: 'ACME India Pvt Ltd',
    country: 'India',
    flag: '🇮🇳',
    takeActionBy: 'May 27, 2026',
    payDate: 'May 30, 2026',
    status: 'Draft',
  },

  // failed / on hold
  {
    id: 'r-uk-2',
    entityName: 'ACME UK Ltd',
    country: 'United Kingdom',
    flag: '🇬🇧',
    takeActionBy: 'May 8, 2026',
    payDate: 'May 10, 2026',
    status: 'On hold',
  },
  {
    id: 'r-ca-1',
    entityName: 'ACME Canada Inc',
    country: 'Canada',
    flag: '🇨🇦',
    takeActionBy: 'May 9, 2026',
    payDate: 'May 12, 2026',
    status: 'On hold',
  },

  // submitted
  {
    id: 'r-us-2',
    entityName: 'ACME US Inc',
    country: 'United States',
    flag: '🇺🇸',
    takeActionBy: null,
    payDate: 'May 1, 2026',
    status: 'Submitted',
  },
  {
    id: 'r-fr-1',
    entityName: 'ACME France SAS',
    country: 'France',
    flag: '🇫🇷',
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    status: 'Submitted',
  },

  // completed
  {
    id: 'r-us-3',
    entityName: 'ACME US Inc',
    country: 'United States',
    flag: '🇺🇸',
    takeActionBy: null,
    payDate: 'Apr 15, 2026',
    status: 'Paid',
  },
  {
    id: 'r-uk-3',
    entityName: 'ACME UK Ltd',
    country: 'United Kingdom',
    flag: '🇬🇧',
    takeActionBy: null,
    payDate: 'Apr 22, 2026',
    status: 'Approved',
  },
  {
    id: 'r-de-2',
    entityName: 'ACME Deutschland GmbH',
    country: 'Germany',
    flag: '🇩🇪',
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    status: 'Paid',
  },
  {
    id: 'r-in-2',
    entityName: 'ACME India Pvt Ltd',
    country: 'India',
    flag: '🇮🇳',
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    status: 'Paid',
  },
  {
    id: 'r-jp-1',
    entityName: 'ACME Japan KK',
    country: 'Japan',
    flag: '🇯🇵',
    takeActionBy: null,
    payDate: 'Apr 25, 2026',
    status: 'Paid',
  },

  // corrections (needs review)
  {
    id: 'r-us-c1',
    entityName: 'ACME US Inc',
    country: 'United States',
    flag: '🇺🇸',
    takeActionBy: 'May 14, 2026',
    payDate: 'Apr 15, 2026',
    status: 'Needs review',
  },

  // archived
  {
    id: 'r-us-a1',
    entityName: 'ACME US Inc',
    country: 'United States',
    flag: '🇺🇸',
    takeActionBy: null,
    payDate: 'Mar 15, 2026',
    status: 'Archived',
    changedBy: 'Naga Bala',
  },
  {
    id: 'r-uk-a1',
    entityName: 'ACME UK Ltd',
    country: 'United Kingdom',
    flag: '🇬🇧',
    takeActionBy: null,
    payDate: 'Mar 22, 2026',
    status: 'Archived',
    changedBy: 'Subhankar G.',
  },
];
