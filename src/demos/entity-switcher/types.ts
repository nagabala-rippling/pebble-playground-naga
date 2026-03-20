export interface Entity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
}

export interface PayRun {
  id: string;
  name: string;
  entityId: string;
  people: number;
  actionBy: string;
  payDate: string;
  status: 'Late' | 'Approved' | 'Pending' | 'Processing';
}

export interface Person {
  id: string;
  name: string;
  employmentType: string;
  entityId: string;
  currency: string;
  paySchedule: string;
}

export interface EntitySettings {
  entityId: string;
  fundingType: string;
  paymentMethod: string;
  paySchedules: string[];
  approvalPolicy: string;
}

export interface Balance {
  id: string;
  employee: string;
  role: string;
  type: string;
  amount: string;
  entityId: string;
}

export interface Earning {
  id: string;
  name: string;
  classification: string;
  recurring: boolean;
  supplemental: boolean;
  entityId: string;
  applicableTo: string;
}

export interface Deduction {
  id: string;
  name: string;
  classification: string;
  taxType: string;
  recurring: boolean;
  frequency: string;
  entityId: string;
  applicableTo: string;
}

export interface Garnishment {
  id: string;
  employee: string;
  type: string;
  totalAmount: string;
  status: 'Active' | 'Completed' | 'Pending';
  garnishmentType: string;
  perPeriodAmount: string;
  entityId: string;
}

export interface FilingAction {
  id: string;
  issue: string;
  employee: string;
  entityId: string;
  dueDate: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface TaxSetting {
  id: string;
  category: string;
  status: 'Configured' | 'Pending' | 'Not started';
  entityId: string;
}

export type ViewMode = 'operational' | 'configuration' | 'hybrid' | 'hidden';

export interface ViewModeConfig {
  default: ViewMode;
  allowMulti: boolean;
}

export const TAB_NAMES = [
  'Overview', 'People', 'Settings', 'Entities', 'Accounting',
  'Balances', 'Reports', 'Earnings', 'Deductions', 'Garnishments', 'Filings',
] as const;

export type TabName = (typeof TAB_NAMES)[number];
