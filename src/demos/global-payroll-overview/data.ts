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

export type RunStatusTone = 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE' | 'WARNING';

export interface PayRun {
  runId: string;
  displayName: string;
  subTitle?: string;
  countryCode: string;
  entityDisplayName: string;
  entityIdentifier?: string;
  numberOfEmployeesInvolved: number;
  takeActionBy: string | null;
  takeActionByCaption?: string;
  payDate: string;
  payDateCaption?: string;
  status: string;
  statusTone: RunStatusTone;
  changedByDisplayName?: string;
  isLate?: boolean;
  isPreviewPayrun?: boolean;
  runOnHoldReason?: string;
}

export const PAY_RUNS: PayRun[] = [
  // Upcoming & Draft
  {
    runId: 'r-us-1',
    displayName: 'Apr 16 – Apr 30',
    countryCode: 'US',
    entityDisplayName: 'ACME US Inc',
    entityIdentifier: 'EIN 84-3210987',
    numberOfEmployeesInvolved: 142,
    takeActionBy: 'May 12, 2026, 5:00 PM PT',
    takeActionByCaption: 'in 7 days',
    payDate: 'May 15, 2026',
    payDateCaption: 'Friday',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-uk-1',
    displayName: 'May 1 – May 15',
    subTitle: 'Off-cycle',
    countryCode: 'GB',
    entityDisplayName: 'ACME UK Ltd',
    entityIdentifier: 'PAYE 120/AB12345',
    numberOfEmployeesInvolved: 38,
    takeActionBy: 'May 18, 2026, 5:00 PM BST',
    takeActionByCaption: 'in 13 days',
    payDate: 'May 22, 2026',
    payDateCaption: 'Friday',
    status: 'Upcoming',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-de-1',
    displayName: 'Mai 2026',
    countryCode: 'DE',
    entityDisplayName: 'ACME Deutschland GmbH',
    entityIdentifier: 'HRB 192834',
    numberOfEmployeesInvolved: 24,
    takeActionBy: 'May 25, 2026, 6:00 PM CET',
    takeActionByCaption: 'in 20 days',
    payDate: 'May 31, 2026',
    payDateCaption: 'Sunday',
    status: 'Upcoming',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-in-1',
    displayName: 'Apr 2026',
    countryCode: 'IN',
    entityDisplayName: 'ACME India Pvt Ltd',
    entityIdentifier: 'CIN U72200KA2018PTC112233',
    numberOfEmployeesInvolved: 76,
    takeActionBy: 'May 27, 2026, 6:00 PM IST',
    takeActionByCaption: 'in 22 days',
    payDate: 'May 30, 2026',
    payDateCaption: 'Saturday',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-fr-1',
    displayName: 'Mai 2026',
    countryCode: 'FR',
    entityDisplayName: 'ACME France SAS',
    entityIdentifier: 'SIRET 78946523100012',
    numberOfEmployeesInvolved: 18,
    takeActionBy: 'May 28, 2026, 6:00 PM CET',
    takeActionByCaption: 'in 23 days',
    payDate: 'May 31, 2026',
    payDateCaption: 'Sunday',
    status: 'Draft',
    statusTone: 'NEUTRAL',
    isPreviewPayrun: true,
  },

  // Failed / On hold
  {
    runId: 'r-uk-2',
    displayName: 'Apr 16 – Apr 30',
    countryCode: 'GB',
    entityDisplayName: 'ACME UK Ltd',
    entityIdentifier: 'PAYE 120/AB12345',
    numberOfEmployeesInvolved: 38,
    takeActionBy: 'May 8, 2026, 5:00 PM BST',
    takeActionByCaption: 'in 3 days',
    payDate: 'May 10, 2026',
    payDateCaption: 'Sunday',
    status: 'On hold',
    statusTone: 'NEGATIVE',
    runOnHoldReason: 'NOT_SUFFICIENT_FUNDS',
  },
  {
    runId: 'r-ca-1',
    displayName: 'Apr 16 – Apr 30',
    countryCode: 'CA',
    entityDisplayName: 'ACME Canada Inc',
    entityIdentifier: 'BN 845739204RC0001',
    numberOfEmployeesInvolved: 22,
    takeActionBy: 'May 9, 2026, 5:00 PM ET',
    takeActionByCaption: 'in 4 days',
    payDate: 'May 12, 2026',
    payDateCaption: 'Tuesday',
    status: 'Action required',
    statusTone: 'NEGATIVE',
    runOnHoldReason: 'FAILED_RISK_CHECK',
  },

  // Submitted
  {
    runId: 'r-us-2',
    displayName: 'Apr 1 – Apr 15',
    countryCode: 'US',
    entityDisplayName: 'ACME US Inc',
    entityIdentifier: 'EIN 84-3210987',
    numberOfEmployeesInvolved: 142,
    takeActionBy: null,
    payDate: 'May 1, 2026',
    payDateCaption: 'Friday',
    status: 'Submitted',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-fr-2',
    displayName: 'Avril 2026',
    countryCode: 'FR',
    entityDisplayName: 'ACME France SAS',
    entityIdentifier: 'SIRET 78946523100012',
    numberOfEmployeesInvolved: 18,
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    payDateCaption: 'Wednesday',
    status: 'Pending Funding',
    statusTone: 'WARNING',
  },

  // Completed
  {
    runId: 'r-us-3',
    displayName: 'Apr 1 – Apr 15',
    countryCode: 'US',
    entityDisplayName: 'ACME US Inc',
    entityIdentifier: 'EIN 84-3210987',
    numberOfEmployeesInvolved: 142,
    takeActionBy: null,
    payDate: 'Apr 15, 2026',
    payDateCaption: 'Tuesday',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-uk-3',
    displayName: 'Apr 1 – Apr 15',
    countryCode: 'GB',
    entityDisplayName: 'ACME UK Ltd',
    entityIdentifier: 'PAYE 120/AB12345',
    numberOfEmployeesInvolved: 38,
    takeActionBy: null,
    payDate: 'Apr 22, 2026',
    payDateCaption: 'Tuesday',
    status: 'Approved',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-de-2',
    displayName: 'April 2026',
    countryCode: 'DE',
    entityDisplayName: 'ACME Deutschland GmbH',
    entityIdentifier: 'HRB 192834',
    numberOfEmployeesInvolved: 24,
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    payDateCaption: 'Wednesday',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-in-2',
    displayName: 'April 2026',
    countryCode: 'IN',
    entityDisplayName: 'ACME India Pvt Ltd',
    entityIdentifier: 'CIN U72200KA2018PTC112233',
    numberOfEmployeesInvolved: 76,
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    payDateCaption: 'Wednesday',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-jp-1',
    displayName: '2026年4月',
    countryCode: 'JP',
    entityDisplayName: 'ACME Japan KK',
    entityIdentifier: '法人番号 7000012345678',
    numberOfEmployeesInvolved: 31,
    takeActionBy: null,
    payDate: 'Apr 25, 2026',
    payDateCaption: 'Friday',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },

  // Corrections (Needs review)
  {
    runId: 'r-us-c1',
    displayName: 'Correction: Q1 wage adjustment',
    subTitle: 'Reconciliation process',
    countryCode: 'US',
    entityDisplayName: 'ACME US Inc',
    entityIdentifier: 'EIN 84-3210987',
    numberOfEmployeesInvolved: 12,
    takeActionBy: 'May 14, 2026, 5:00 PM PT',
    takeActionByCaption: 'in 9 days',
    payDate: 'Apr 15, 2026',
    payDateCaption: 'Original pay date',
    status: 'Not Ready',
    statusTone: 'WARNING',
  },

  // Archived
  {
    runId: 'r-us-a1',
    displayName: 'Mar 1 – Mar 15',
    countryCode: 'US',
    entityDisplayName: 'ACME US Inc',
    entityIdentifier: 'EIN 84-3210987',
    numberOfEmployeesInvolved: 140,
    takeActionBy: null,
    payDate: 'Mar 15, 2026',
    payDateCaption: 'Sunday',
    status: 'Archived',
    statusTone: 'NEUTRAL',
    changedByDisplayName: 'Naga Bala',
  },
  {
    runId: 'r-uk-a1',
    displayName: 'Mar 1 – Mar 15',
    countryCode: 'GB',
    entityDisplayName: 'ACME UK Ltd',
    entityIdentifier: 'PAYE 120/AB12345',
    numberOfEmployeesInvolved: 36,
    takeActionBy: null,
    payDate: 'Mar 22, 2026',
    payDateCaption: 'Sunday',
    status: 'Archived',
    statusTone: 'NEUTRAL',
    changedByDisplayName: 'Subhankar G.',
  },
];

export function runsForTab(tab: Tab, runs: PayRun[]): PayRun[] {
  switch (tab) {
    case 'upcomingAndDraft':
      return runs.filter(r => r.status === 'Draft' || r.status === 'Upcoming');
    case 'failed':
      return runs.filter(r => r.status === 'On hold' || r.status === 'Action required');
    case 'submitted':
      return runs.filter(r => r.status === 'Submitted' || r.status === 'Pending Funding');
    case 'completed':
      return runs.filter(r => r.status === 'Paid' || r.status === 'Approved');
    case 'corrections':
      return runs.filter(r => r.status === 'Not Ready' || r.status === 'In Progress');
    case 'archived':
      return runs.filter(r => r.status === 'Archived');
  }
}
