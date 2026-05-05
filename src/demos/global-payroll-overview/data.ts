export type Tab =
  | 'upcomingAndDraft'
  | 'failed'
  | 'submitted'
  | 'completed'
  | 'corrections'
  | 'archived';

export const TAB_LABELS: Record<Tab, string> = {
  upcomingAndDraft: 'Upcoming / Drafts',
  failed: 'Failed Runs',
  submitted: 'Submitted',
  completed: 'Completed',
  corrections: 'Corrections',
  archived: 'Archived',
};

export const TAB_ORDER: Tab[] = [
  'upcomingAndDraft',
  'failed',
  'submitted',
  'completed',
  'corrections',
  'archived',
];

export type RunStatusTone = 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE' | 'WARNING';

export interface PayRun {
  runId: string;
  displayName: string;
  subTitle?: string;
  countryCode: string;
  countryName: string;
  entityDisplayName: string;
  entityIdentifier?: string;
  numberOfEmployeesInvolved: number;
  takeActionBy: string | null;
  overdueCaption?: string;
  payDate: string;
  status: string;
  statusTone: RunStatusTone;
  changedByDisplayName?: string;
  isLate?: boolean;
  isPreviewPayrun?: boolean;
}

export const PAY_RUNS: PayRun[] = [
  // Upcoming / Drafts
  {
    runId: 'r-in-1',
    displayName: 'Sep 01 - Sep 30: Naga...',
    subTitle: 'Monthly Auto Approve: True',
    countryCode: 'IN',
    countryName: 'India',
    entityDisplayName: 'IN EOR',
    numberOfEmployeesInvolved: 8,
    takeActionBy: 'Oct 08, 2025, 02:30 P...',
    overdueCaption: '(208 d, 14 h past due)',
    payDate: 'Oct 16, 2025',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-in-2',
    displayName: 'Exclusion',
    countryCode: 'IN',
    countryName: 'India',
    entityDisplayName: 'IN EOR',
    numberOfEmployeesInvolved: 27,
    takeActionBy: 'Oct 09, 2025, 02:30 P...',
    overdueCaption: '(207 d, 14 h past due)',
    payDate: 'Oct 17, 2025',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-de-1',
    displayName: 'Oct 01 - Oct 31: Stand...',
    subTitle: 'Monthly Auto Approve: False',
    countryCode: 'DE',
    countryName: 'Germany',
    entityDisplayName: 'Testfirma Systemprüf...',
    numberOfEmployeesInvolved: 1,
    takeActionBy: 'Oct 22, 2025, 02:30 P...',
    overdueCaption: '(194 d, 14 h past due)',
    payDate: 'Oct 31, 2025',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-de-2',
    displayName: 'Oct 01 - Oct 31: Stand...',
    subTitle: 'Monthly Auto Approve: False',
    countryCode: 'DE',
    countryName: 'Germany',
    entityDisplayName: 'Testfirma Systemprüf...',
    numberOfEmployeesInvolved: 1,
    takeActionBy: 'Oct 27, 2025, 02:30 P...',
    overdueCaption: '(189 d, 14 h past due)',
    payDate: 'Oct 31, 2025',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },
  {
    runId: 'r-fr-1',
    displayName: 'Oct 01 - Oct 31',
    countryCode: 'FR',
    countryName: 'France',
    entityDisplayName: 'Carter-Ruiz, FR Pvt Ltd.',
    numberOfEmployeesInvolved: 31,
    takeActionBy: 'Oct 23, 2025, 02:30 P...',
    overdueCaption: '(193 d, 14 h past due)',
    payDate: 'Oct 31, 2025',
    status: 'Late',
    statusTone: 'NEGATIVE',
    isLate: true,
  },
  {
    runId: 'r-au-1',
    displayName: 'Interim run Feb 01 - Fe...',
    countryCode: 'AU',
    countryName: 'Australia',
    entityDisplayName: 'Carter-Ruiz, AU Pty Ltd.',
    entityIdentifier: '12345678901',
    numberOfEmployeesInvolved: 26,
    takeActionBy: 'Mar 27, 2026, 02:30 P...',
    overdueCaption: '(38 d, 14 h past due)',
    payDate: 'Apr 02, 2026',
    status: 'Late',
    statusTone: 'NEGATIVE',
    isLate: true,
  },
  {
    runId: 'r-au-2',
    displayName: 'Interim run Feb 18 - M...',
    countryCode: 'AU',
    countryName: 'Australia',
    entityDisplayName: 'Carter-Ruiz, AU Pty Ltd.',
    entityIdentifier: '12345678901',
    numberOfEmployeesInvolved: 3,
    takeActionBy: 'Mar 27, 2026, 02:30 P...',
    overdueCaption: '(38 d, 14 h past due)',
    payDate: 'Apr 02, 2026',
    status: 'Late',
    statusTone: 'NEGATIVE',
    isLate: true,
  },
  {
    runId: 'r-au-3',
    displayName: 'Interim run Jan 01 - Ja...',
    countryCode: 'AU',
    countryName: 'Australia',
    entityDisplayName: 'Carter-Ruiz, AU Pty Ltd.',
    entityIdentifier: '12345678901',
    numberOfEmployeesInvolved: 26,
    takeActionBy: 'Mar 27, 2026, 02:30 P...',
    overdueCaption: '(38 d, 14 h past due)',
    payDate: 'Apr 02, 2026',
    status: 'Late',
    statusTone: 'NEGATIVE',
    isLate: true,
  },
  {
    runId: 'r-br-1',
    displayName: 'Feb 01 - Feb 28',
    countryCode: 'BR',
    countryName: 'Brazil',
    entityDisplayName: 'BR EOR',
    numberOfEmployeesInvolved: 31,
    takeActionBy: 'Feb 19, 2026, 02:30 P...',
    overdueCaption: '(74 d, 13 h past due)',
    payDate: 'Mar 06, 2026',
    status: 'Draft',
    statusTone: 'NEUTRAL',
  },

  // Failed Runs
  {
    runId: 'r-uk-2',
    displayName: 'Apr 16 - Apr 30',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    entityDisplayName: 'Carter-Ruiz, GB Pvt. Ltd.',
    numberOfEmployeesInvolved: 38,
    takeActionBy: 'May 8, 2026, 5:00 PM',
    overdueCaption: '(in 3 days)',
    payDate: 'May 10, 2026',
    status: 'On hold',
    statusTone: 'NEGATIVE',
  },
  {
    runId: 'r-ca-1',
    displayName: 'Apr 16 - Apr 30',
    countryCode: 'CA',
    countryName: 'Canada',
    entityDisplayName: 'Carter-Ruiz, CA',
    numberOfEmployeesInvolved: 22,
    takeActionBy: 'May 9, 2026, 5:00 PM',
    overdueCaption: '(in 4 days)',
    payDate: 'May 12, 2026',
    status: 'Action required',
    statusTone: 'NEGATIVE',
  },

  // Submitted
  {
    runId: 'r-us-2',
    displayName: 'Apr 01 - Apr 15',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 142,
    takeActionBy: null,
    payDate: 'May 1, 2026',
    status: 'Submitted',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-fr-2',
    displayName: 'Avril 2026',
    countryCode: 'FR',
    countryName: 'France',
    entityDisplayName: 'Carter-Ruiz, FR Pvt Ltd.',
    numberOfEmployeesInvolved: 18,
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    status: 'Pending Funding',
    statusTone: 'WARNING',
  },

  // Completed
  {
    runId: 'r-us-c1',
    displayName: 'Correction: May 01 - M...',
    subTitle: 'May 01 - May 30: Regular Pay ...',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 3,
    takeActionBy: 'May 27, 2026',
    payDate: 'May 29, 2026',
    status: 'Approved',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-us-c2',
    displayName: 'Correction 3: May 01 - ...',
    subTitle: 'Correction 2: May 01 - May 30:...',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 3,
    takeActionBy: 'May 27, 2026',
    payDate: 'May 29, 2026',
    status: 'Approved',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-us-c3',
    displayName: 'Correction 2: May 01 - ...',
    subTitle: 'Correction: May 01 - May 30: R...',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 3,
    takeActionBy: 'May 27, 2026',
    payDate: 'May 29, 2026',
    status: 'Approved',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-ca-c1',
    displayName: 'Feb 16 - Feb 28: Cana...',
    subTitle: 'Semi-Monthly Auto Approve: Tr...',
    countryCode: 'CA',
    countryName: 'Canada',
    entityDisplayName: 'Carter-Ruiz, CA',
    numberOfEmployeesInvolved: 31,
    takeActionBy: 'Apr 27, 2026',
    payDate: 'May 01, 2026',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-uk-3',
    displayName: 'Apr 1 – Apr 15',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    entityDisplayName: 'Carter-Ruiz, GB Pvt. Ltd.',
    numberOfEmployeesInvolved: 38,
    takeActionBy: null,
    payDate: 'Apr 22, 2026',
    status: 'Approved',
    statusTone: 'POSITIVE',
  },
  {
    runId: 'r-de-3',
    displayName: 'April 2026',
    countryCode: 'DE',
    countryName: 'Germany',
    entityDisplayName: 'Testfirma Systemprüf...',
    numberOfEmployeesInvolved: 24,
    takeActionBy: null,
    payDate: 'Apr 30, 2026',
    status: 'Paid',
    statusTone: 'POSITIVE',
  },

  // Corrections
  {
    runId: 'r-us-corr-1',
    displayName: 'Correction: Q1 wage adjustment',
    subTitle: 'Reconciliation process',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 12,
    takeActionBy: 'May 14, 2026, 5:00 PM',
    overdueCaption: '(in 9 days)',
    payDate: 'Apr 15, 2026',
    status: 'Not Ready',
    statusTone: 'WARNING',
  },

  // Archived
  {
    runId: 'r-us-a1',
    displayName: 'Mar 1 – Mar 15',
    countryCode: 'US',
    countryName: 'United States',
    entityDisplayName: 'Carter-Ruiz',
    entityIdentifier: '862103462',
    numberOfEmployeesInvolved: 140,
    takeActionBy: null,
    payDate: 'Mar 15, 2026',
    status: 'Archived',
    statusTone: 'NEUTRAL',
    changedByDisplayName: 'Naga Bala',
  },
  {
    runId: 'r-uk-a1',
    displayName: 'Mar 1 – Mar 15',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    entityDisplayName: 'Carter-Ruiz, GB Pvt. Ltd.',
    numberOfEmployeesInvolved: 36,
    takeActionBy: null,
    payDate: 'Mar 22, 2026',
    status: 'Archived',
    statusTone: 'NEUTRAL',
    changedByDisplayName: 'Subhankar G.',
  },
];

export function runsForTab(tab: Tab, runs: PayRun[]): PayRun[] {
  switch (tab) {
    case 'upcomingAndDraft':
      return runs.filter(
        r => r.status === 'Draft' || r.status === 'Upcoming' || r.status === 'Late',
      );
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

export const TAB_TITLES: Record<Tab, string> = {
  upcomingAndDraft: 'Upcoming / Drafts',
  failed: 'Failed Runs',
  submitted: 'Submitted Runs',
  completed: 'Completed Runs',
  corrections: 'Corrections',
  archived: 'Archived Runs',
};
