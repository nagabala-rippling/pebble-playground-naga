export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
export type EmploymentType = 'employee' | 'contractor';
export type ArrearDaysUnit = 'calendar' | 'business';

export interface SuperGroup {
  id: string;
  name: string;
  type: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl?: string;
  status: 'included' | 'not-included';
}

export interface PaySchedule {
  id: string;
  name: string;
  priority: number;
  employmentType: EmploymentType;
  entity: string;
  country: string;
  countryCode: string;
  fundingType: string;
  fundingAccount: string;
  autoApproval: boolean;
  payFrequency: PayFrequency;
  holidayHandling: string;
  arrearDaysUnit: ArrearDaysUnit;
  arrearDays: number;
  firstPaymentDate: string;
  paymentDateDetails: Record<string, string>;
  superGroups: SuperGroup[];
  assignedEmployeeCount: number;
}

export interface PayScheduleFormData {
  name: string;
  employmentType: EmploymentType;
  entity: string;
  payFrequency: PayFrequency;
  holidayHandling: string;
  arrearDaysUnit: ArrearDaysUnit;
  arrearDays: number;
  firstPaymentDate: string;
  paymentDateDetails: Record<string, string>;
  superGroups: SuperGroup[];
  autoApproval: boolean;
}

export const EMPTY_FORM_DATA: PayScheduleFormData = {
  name: '',
  employmentType: 'employee',
  entity: 'Acme, Inc.',
  payFrequency: 'semi-monthly',
  holidayHandling: 'Previous business day',
  arrearDaysUnit: 'calendar',
  arrearDays: 5,
  firstPaymentDate: '2026-04-15',
  paymentDateDetails: {},
  superGroups: [],
  autoApproval: true,
};

export const FREQUENCY_LABELS: Record<PayFrequency, string> = {
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-weekly',
  'semi-monthly': 'Semi-monthly',
  'monthly': 'Monthly',
};

export const DUMMY_SUPER_GROUPS: SuperGroup[] = [
  { id: 'sg-1', name: 'All - Employees', type: 'all' },
  { id: 'sg-2', name: 'Engineering', type: 'department' },
  { id: 'sg-3', name: 'Sales', type: 'department' },
  { id: 'sg-4', name: 'Marketing', type: 'department' },
  { id: 'sg-5', name: 'Operations', type: 'department' },
  { id: 'sg-6', name: 'All - Contractors', type: 'all' },
];

export const DUMMY_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Sarah Chen', role: 'Senior Engineer', department: 'Engineering', status: 'included' },
  { id: 'emp-2', name: 'Marcus Johnson', role: 'Product Manager', department: 'Product', status: 'included' },
  { id: 'emp-3', name: 'Priya Patel', role: 'Staff Designer', department: 'Design', status: 'included' },
  { id: 'emp-4', name: 'James Wilson', role: 'Engineering Manager', department: 'Engineering', status: 'included' },
  { id: 'emp-5', name: 'Aisha Rahman', role: 'Data Scientist', department: 'Data', status: 'included' },
  { id: 'emp-6', name: 'Carlos Rivera', role: 'Sales Director', department: 'Sales', status: 'not-included' },
  { id: 'emp-7', name: 'Emily Nakamura', role: 'Marketing Lead', department: 'Marketing', status: 'not-included' },
  { id: 'emp-8', name: 'David Okonkwo', role: 'DevOps Engineer', department: 'Engineering', status: 'included' },
  { id: 'emp-9', name: 'Lisa Bergmann', role: 'Finance Analyst', department: 'Finance', status: 'not-included' },
  { id: 'emp-10', name: 'Raj Gupta', role: 'QA Lead', department: 'Engineering', status: 'included' },
  { id: 'emp-11', name: 'Tom Bradley', role: 'Account Executive', department: 'Sales', status: 'not-included' },
  { id: 'emp-12', name: 'Mei Ling', role: 'Frontend Engineer', department: 'Engineering', status: 'included' },
];

export const DUMMY_PAY_SCHEDULES: PaySchedule[] = [
  {
    id: 'ps-1',
    name: 'Salaried Semi-Monthly',
    priority: 1,
    employmentType: 'employee',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Two-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: true,
    payFrequency: 'semi-monthly',
    holidayHandling: 'Previous business day',
    arrearDaysUnit: 'calendar',
    arrearDays: 5,
    firstPaymentDate: '2026-01-15',
    paymentDateDetails: { firstCheck: '15th', secondCheck: '30th' },
    superGroups: [
      { id: 'sg-1', name: 'All - Employees', type: 'all' },
    ],
    assignedEmployeeCount: 142,
  },
  {
    id: 'ps-2',
    name: 'Hourly Bi-Weekly',
    priority: 2,
    employmentType: 'employee',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Two-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: false,
    payFrequency: 'bi-weekly',
    holidayHandling: 'Next business day',
    arrearDaysUnit: 'business',
    arrearDays: 3,
    firstPaymentDate: '2026-01-10',
    paymentDateDetails: { payDay: 'Friday' },
    superGroups: [
      { id: 'sg-2', name: 'Engineering', type: 'department' },
      { id: 'sg-5', name: 'Operations', type: 'department' },
    ],
    assignedEmployeeCount: 87,
  },
  {
    id: 'ps-4',
    name: 'Executive Monthly',
    priority: 3,
    employmentType: 'employee',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Two-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: true,
    payFrequency: 'monthly',
    holidayHandling: 'Previous business day',
    arrearDaysUnit: 'calendar',
    arrearDays: 5,
    firstPaymentDate: '2026-02-01',
    paymentDateDetails: { payDay: '1st' },
    superGroups: [
      { id: 'sg-7', name: 'Leadership', type: 'department' },
    ],
    assignedEmployeeCount: 12,
  },
  {
    id: 'ps-5',
    name: 'Sales Weekly',
    priority: 4,
    employmentType: 'employee',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Two-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: false,
    payFrequency: 'weekly',
    holidayHandling: 'Next business day',
    arrearDaysUnit: 'business',
    arrearDays: 2,
    firstPaymentDate: '2026-01-06',
    paymentDateDetails: { payDay: 'Friday' },
    superGroups: [
      { id: 'sg-3', name: 'Sales', type: 'department' },
      { id: 'sg-4', name: 'Marketing', type: 'department' },
    ],
    assignedEmployeeCount: 34,
  },
  {
    id: 'ps-3',
    name: 'Contractor Weekly',
    priority: 1,
    employmentType: 'contractor',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Same-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: false,
    payFrequency: 'weekly',
    holidayHandling: 'Previous business day',
    arrearDaysUnit: 'calendar',
    arrearDays: 7,
    firstPaymentDate: '2026-01-06',
    paymentDateDetails: { payDay: 'Monday' },
    superGroups: [
      { id: 'sg-6', name: 'All - Contractors', type: 'all' },
    ],
    assignedEmployeeCount: 23,
  },
  {
    id: 'ps-6',
    name: 'Contractor Monthly',
    priority: 2,
    employmentType: 'contractor',
    entity: 'Acme, Inc.',
    country: 'United States',
    countryCode: 'US',
    fundingType: 'Two-day',
    fundingAccount: 'Chase Business ****4829',
    autoApproval: true,
    payFrequency: 'monthly',
    holidayHandling: 'Previous business day',
    arrearDaysUnit: 'calendar',
    arrearDays: 10,
    firstPaymentDate: '2026-02-01',
    paymentDateDetails: { payDay: '1st' },
    superGroups: [
      { id: 'sg-8', name: 'Consulting', type: 'department' },
      { id: 'sg-9', name: 'Freelance', type: 'department' },
    ],
    assignedEmployeeCount: 8,
  },
];
