import type {
  Entity, PayRun, Person, EntitySettings, Balance,
  Earning, Deduction, Garnishment, FilingAction, TaxSetting, ViewModeConfig,
} from './types';

// ── Entities ──────────────────────────────────────────────────────────────────

export const ENTITIES: Entity[] = [
  { id: 'xingco-us', name: 'Xingco', country: 'United States', countryCode: 'US', flag: '\u{1F1FA}\u{1F1F8}', currency: 'USD' },
  { id: 'xingco-us-2', name: 'Xingco Labs', country: 'United States', countryCode: 'US', flag: '\u{1F1FA}\u{1F1F8}', currency: 'USD' },
  { id: 'xingco-us-3', name: 'Xingco Services', country: 'United States', countryCode: 'US', flag: '\u{1F1FA}\u{1F1F8}', currency: 'USD' },
  { id: 'xingco-ca', name: 'Xingco Canada', country: 'Canada', countryCode: 'CA', flag: '\u{1F1E8}\u{1F1E6}', currency: 'CAD' },
  { id: 'xingco-ca-2', name: 'Xingco Canada West', country: 'Canada', countryCode: 'CA', flag: '\u{1F1E8}\u{1F1E6}', currency: 'CAD' },
  { id: 'xingco-gb', name: 'Xingco UK', country: 'United Kingdom', countryCode: 'GB', flag: '\u{1F1EC}\u{1F1E7}', currency: 'GBP' },
  { id: 'xingco-gb-2', name: 'Xingco UK Services', country: 'United Kingdom', countryCode: 'GB', flag: '\u{1F1EC}\u{1F1E7}', currency: 'GBP' },
  { id: 'xingco-in', name: 'Xingco India', country: 'India', countryCode: 'IN', flag: '\u{1F1EE}\u{1F1F3}', currency: 'INR' },
  { id: 'xingco-in-2', name: 'Xingco India Tech', country: 'India', countryCode: 'IN', flag: '\u{1F1EE}\u{1F1F3}', currency: 'INR' },
  { id: 'xingco-de', name: 'Xingco Germany', country: 'Germany', countryCode: 'DE', flag: '\u{1F1E9}\u{1F1EA}', currency: 'EUR' },
  { id: 'xingco-fr', name: 'Xingco France', country: 'France', countryCode: 'FR', flag: '\u{1F1EB}\u{1F1F7}', currency: 'EUR' },
  { id: 'xingco-au', name: 'Xingco Australia', country: 'Australia', countryCode: 'AU', flag: '\u{1F1E6}\u{1F1FA}', currency: 'AUD' },
];

export const getEntity = (id: string): Entity | undefined => ENTITIES.find(e => e.id === id);

export const getEntitiesByCountry = (): Record<string, Entity[]> => {
  const grouped: Record<string, Entity[]> = {};
  for (const entity of ENTITIES) {
    if (!grouped[entity.country]) grouped[entity.country] = [];
    grouped[entity.country].push(entity);
  }
  return grouped;
};

// ── Pay Runs (Overview) ──────────────────────────────────────────────────────

export const PAY_RUNS: PayRun[] = [
  { id: 'pr-1', name: 'Jan 2026 Biweekly', entityId: 'xingco-us', people: 142, actionBy: 'Sarah Chen', payDate: '2026-01-31', status: 'Late' },
  { id: 'pr-2', name: 'Jan 2026 Biweekly', entityId: 'xingco-us-2', people: 38, actionBy: 'Sarah Chen', payDate: '2026-01-31', status: 'Approved' },
  { id: 'pr-3', name: 'Jan 2026 Semi-Monthly', entityId: 'xingco-ca', people: 67, actionBy: 'Marc Leblanc', payDate: '2026-01-30', status: 'Approved' },
  { id: 'pr-4', name: 'Jan 2026 Monthly', entityId: 'xingco-gb', people: 24, actionBy: 'James Wilson', payDate: '2026-01-28', status: 'Pending' },
  { id: 'pr-5', name: 'Jan 2026 Monthly', entityId: 'xingco-in', people: 89, actionBy: 'Priya Sharma', payDate: '2026-01-31', status: 'Processing' },
  { id: 'pr-6', name: 'Jan 2026 Monthly', entityId: 'xingco-de', people: 15, actionBy: 'Hans Mueller', payDate: '2026-01-31', status: 'Approved' },
  { id: 'pr-7', name: 'Jan 2026 Monthly', entityId: 'xingco-fr', people: 12, actionBy: 'Claire Dupont', payDate: '2026-01-31', status: 'Pending' },
  { id: 'pr-8', name: 'Jan 2026 Monthly', entityId: 'xingco-au', people: 19, actionBy: 'Liam O\'Brien', payDate: '2026-01-30', status: 'Approved' },
];

// ── People ────────────────────────────────────────────────────────────────────

export const PEOPLE: Person[] = [
  { id: 'p-1', name: 'Sarah Chen', employmentType: 'Full-time', entityId: 'xingco-us', currency: 'USD', paySchedule: 'Biweekly' },
  { id: 'p-2', name: 'Michael Torres', employmentType: 'Full-time', entityId: 'xingco-us', currency: 'USD', paySchedule: 'Biweekly' },
  { id: 'p-3', name: 'Emily Rodriguez', employmentType: 'Part-time', entityId: 'xingco-us-2', currency: 'USD', paySchedule: 'Biweekly' },
  { id: 'p-4', name: 'David Kim', employmentType: 'Contractor', entityId: 'xingco-us-3', currency: 'USD', paySchedule: 'Monthly' },
  { id: 'p-5', name: 'Marc Leblanc', employmentType: 'Full-time', entityId: 'xingco-ca', currency: 'CAD', paySchedule: 'Semi-Monthly' },
  { id: 'p-6', name: 'Sophie Tremblay', employmentType: 'Full-time', entityId: 'xingco-ca-2', currency: 'CAD', paySchedule: 'Biweekly' },
  { id: 'p-7', name: 'James Wilson', employmentType: 'Full-time', entityId: 'xingco-gb', currency: 'GBP', paySchedule: 'Monthly' },
  { id: 'p-8', name: 'Emma Thompson', employmentType: 'Part-time', entityId: 'xingco-gb-2', currency: 'GBP', paySchedule: 'Monthly' },
  { id: 'p-9', name: 'Priya Sharma', employmentType: 'Full-time', entityId: 'xingco-in', currency: 'INR', paySchedule: 'Monthly' },
  { id: 'p-10', name: 'Raj Patel', employmentType: 'Full-time', entityId: 'xingco-in-2', currency: 'INR', paySchedule: 'Monthly' },
  { id: 'p-11', name: 'Hans Mueller', employmentType: 'Full-time', entityId: 'xingco-de', currency: 'EUR', paySchedule: 'Monthly' },
  { id: 'p-12', name: 'Claire Dupont', employmentType: 'Full-time', entityId: 'xingco-fr', currency: 'EUR', paySchedule: 'Monthly' },
  { id: 'p-13', name: 'Liam O\'Brien', employmentType: 'Full-time', entityId: 'xingco-au', currency: 'AUD', paySchedule: 'Monthly' },
  { id: 'p-14', name: 'Jessica Park', employmentType: 'Full-time', entityId: 'xingco-us', currency: 'USD', paySchedule: 'Biweekly' },
];

// ── Settings (per-entity) ─────────────────────────────────────────────────────

export const SETTINGS_DATA: EntitySettings[] = [
  { entityId: 'xingco-us', fundingType: 'Bank Transfer (Wire)', paymentMethod: 'Direct Deposit', paySchedules: ['Biweekly', 'Monthly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-us-2', fundingType: 'Bank Transfer (Wire)', paymentMethod: 'Direct Deposit', paySchedules: ['Biweekly'], approvalPolicy: 'Manager Only' },
  { entityId: 'xingco-us-3', fundingType: 'Bank Transfer (ACH)', paymentMethod: 'Direct Deposit', paySchedules: ['Monthly'], approvalPolicy: 'Finance Only' },
  { entityId: 'xingco-ca', fundingType: 'Bank Transfer (EFT)', paymentMethod: 'Direct Deposit', paySchedules: ['Semi-Monthly', 'Biweekly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-ca-2', fundingType: 'Bank Transfer (EFT)', paymentMethod: 'Direct Deposit', paySchedules: ['Biweekly'], approvalPolicy: 'Manager Only' },
  { entityId: 'xingco-gb', fundingType: 'BACS Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-gb-2', fundingType: 'BACS Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Finance Only' },
  { entityId: 'xingco-in', fundingType: 'NEFT Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Manager + Finance + HR' },
  { entityId: 'xingco-in-2', fundingType: 'NEFT Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-de', fundingType: 'SEPA Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-fr', fundingType: 'SEPA Transfer', paymentMethod: 'Bank Transfer', paySchedules: ['Monthly'], approvalPolicy: 'Manager + Finance' },
  { entityId: 'xingco-au', fundingType: 'Bank Transfer (BPAY)', paymentMethod: 'Direct Deposit', paySchedules: ['Monthly'], approvalPolicy: 'Manager Only' },
];

// ── Balances ──────────────────────────────────────────────────────────────────

export const BALANCES: Balance[] = [
  { id: 'b-1', employee: 'Sarah Chen', role: 'Engineering Manager', type: 'PTO', amount: '80.00 hrs', entityId: 'xingco-us' },
  { id: 'b-2', employee: 'Michael Torres', role: 'Software Engineer', type: 'Sick Leave', amount: '40.00 hrs', entityId: 'xingco-us' },
  { id: 'b-3', employee: 'Emily Rodriguez', role: 'Designer', type: 'PTO', amount: '32.00 hrs', entityId: 'xingco-us-2' },
  { id: 'b-4', employee: 'Marc Leblanc', role: 'Product Manager', type: 'Vacation', amount: '15.00 days', entityId: 'xingco-ca' },
  { id: 'b-5', employee: 'Sophie Tremblay', role: 'Analyst', type: 'Sick Leave', amount: '10.00 days', entityId: 'xingco-ca-2' },
  { id: 'b-6', employee: 'James Wilson', role: 'Director', type: 'Annual Leave', amount: '25.00 days', entityId: 'xingco-gb' },
  { id: 'b-7', employee: 'Emma Thompson', role: 'Coordinator', type: 'Annual Leave', amount: '12.00 days', entityId: 'xingco-gb-2' },
  { id: 'b-8', employee: 'Priya Sharma', role: 'Tech Lead', type: 'Earned Leave', amount: '18.00 days', entityId: 'xingco-in' },
  { id: 'b-9', employee: 'Raj Patel', role: 'Engineer', type: 'Casual Leave', amount: '7.00 days', entityId: 'xingco-in-2' },
  { id: 'b-10', employee: 'Hans Mueller', role: 'Engineer', type: 'Annual Leave', amount: '30.00 days', entityId: 'xingco-de' },
  { id: 'b-11', employee: 'Claire Dupont', role: 'Marketing', type: 'RTT', amount: '10.00 days', entityId: 'xingco-fr' },
  { id: 'b-12', employee: 'Liam O\'Brien', role: 'Sales', type: 'Annual Leave', amount: '20.00 days', entityId: 'xingco-au' },
];

// ── Earnings ──────────────────────────────────────────────────────────────────

export const EARNINGS: Earning[] = [
  { id: 'e-1', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-us', applicableTo: 'All employees' },
  { id: 'e-2', name: 'Overtime', classification: 'Hourly', recurring: false, supplemental: true, entityId: 'xingco-us', applicableTo: 'Non-exempt employees' },
  { id: 'e-3', name: 'Bonus', classification: 'Supplemental', recurring: false, supplemental: true, entityId: 'xingco-us', applicableTo: 'All employees' },
  { id: 'e-4', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-ca', applicableTo: 'All employees' },
  { id: 'e-5', name: 'Statutory Holiday Pay', classification: 'Holiday', recurring: false, supplemental: false, entityId: 'xingco-ca', applicableTo: 'All employees' },
  { id: 'e-6', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-gb', applicableTo: 'All employees' },
  { id: 'e-7', name: 'Bank Holiday Pay', classification: 'Holiday', recurring: false, supplemental: false, entityId: 'xingco-gb', applicableTo: 'All employees' },
  { id: 'e-8', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-in', applicableTo: 'All employees' },
  { id: 'e-9', name: 'Dearness Allowance', classification: 'Allowance', recurring: true, supplemental: false, entityId: 'xingco-in', applicableTo: 'All employees' },
  { id: 'e-10', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-de', applicableTo: 'All employees' },
  { id: 'e-11', name: 'Commission', classification: 'Variable', recurring: false, supplemental: true, entityId: 'xingco-us-2', applicableTo: 'Sales team' },
  { id: 'e-12', name: 'Regular Pay', classification: 'Salary', recurring: true, supplemental: false, entityId: 'xingco-fr', applicableTo: 'All employees' },
];

// ── Deductions ────────────────────────────────────────────────────────────────

export const DEDUCTIONS: Deduction[] = [
  { id: 'd-1', name: 'Medical Insurance', classification: 'Health', taxType: 'Pre-tax', recurring: true, frequency: 'Per paycheck', entityId: 'xingco-us', applicableTo: 'All employees' },
  { id: 'd-2', name: 'Dental Insurance', classification: 'Health', taxType: 'Pre-tax', recurring: true, frequency: 'Per paycheck', entityId: 'xingco-us', applicableTo: 'All employees' },
  { id: 'd-3', name: '401(k)', classification: 'Retirement', taxType: 'Pre-tax', recurring: true, frequency: 'Per paycheck', entityId: 'xingco-us', applicableTo: 'Eligible employees' },
  { id: 'd-4', name: 'RRSP', classification: 'Retirement', taxType: 'Pre-tax', recurring: true, frequency: 'Per paycheck', entityId: 'xingco-ca', applicableTo: 'All employees' },
  { id: 'd-5', name: 'EI Premium', classification: 'Government', taxType: 'Pre-tax', recurring: true, frequency: 'Per paycheck', entityId: 'xingco-ca', applicableTo: 'All employees' },
  { id: 'd-6', name: 'Pension Contribution', classification: 'Retirement', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-gb', applicableTo: 'All employees' },
  { id: 'd-7', name: 'Student Loan', classification: 'Government', taxType: 'Post-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-gb', applicableTo: 'Applicable employees' },
  { id: 'd-8', name: 'Provident Fund', classification: 'Retirement', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-in', applicableTo: 'All employees' },
  { id: 'd-9', name: 'Professional Tax', classification: 'Government', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-in', applicableTo: 'All employees' },
  { id: 'd-10', name: 'Social Security', classification: 'Government', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-de', applicableTo: 'All employees' },
  { id: 'd-11', name: 'CSG/CRDS', classification: 'Government', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-fr', applicableTo: 'All employees' },
  { id: 'd-12', name: 'Superannuation', classification: 'Retirement', taxType: 'Pre-tax', recurring: true, frequency: 'Monthly', entityId: 'xingco-au', applicableTo: 'All employees' },
];

// ── Garnishments ──────────────────────────────────────────────────────────────

export const GARNISHMENTS: Garnishment[] = [
  { id: 'g-1', employee: 'Michael Torres', type: 'Child Support', totalAmount: '$12,000.00', status: 'Active', garnishmentType: 'Court Order', perPeriodAmount: '$500.00', entityId: 'xingco-us' },
  { id: 'g-2', employee: 'Emily Rodriguez', type: 'Tax Levy', totalAmount: '$4,200.00', status: 'Active', garnishmentType: 'IRS Levy', perPeriodAmount: '$175.00', entityId: 'xingco-us-2' },
  { id: 'g-3', employee: 'Marc Leblanc', type: 'Support Order', totalAmount: 'CA$8,400.00', status: 'Active', garnishmentType: 'Court Order', perPeriodAmount: 'CA$350.00', entityId: 'xingco-ca' },
  { id: 'g-4', employee: 'James Wilson', type: 'Student Loan', totalAmount: '\u00A315,000.00', status: 'Active', garnishmentType: 'HMRC Order', perPeriodAmount: '\u00A3250.00', entityId: 'xingco-gb' },
  { id: 'g-5', employee: 'Priya Sharma', type: 'Loan Recovery', totalAmount: '\u20B9200,000', status: 'Pending', garnishmentType: 'Court Order', perPeriodAmount: '\u20B910,000', entityId: 'xingco-in' },
  { id: 'g-6', employee: 'David Kim', type: 'Creditor Garnishment', totalAmount: '$6,000.00', status: 'Completed', garnishmentType: 'Court Order', perPeriodAmount: '$250.00', entityId: 'xingco-us-3' },
  { id: 'g-7', employee: 'Hans Mueller', type: 'Tax Debt', totalAmount: '\u20AC3,500.00', status: 'Active', garnishmentType: 'Finanzamt Order', perPeriodAmount: '\u20AC291.67', entityId: 'xingco-de' },
  { id: 'g-8', employee: 'Liam O\'Brien', type: 'Child Support', totalAmount: 'A$9,600.00', status: 'Active', garnishmentType: 'Court Order', perPeriodAmount: 'A$400.00', entityId: 'xingco-au' },
];

// ── Filing Actions ────────────────────────────────────────────────────────────

export const FILING_ACTIONS: FilingAction[] = [
  { id: 'fa-1', issue: 'W-2 filing deadline approaching', employee: 'All US employees', entityId: 'xingco-us', dueDate: '2026-01-31', severity: 'Critical' },
  { id: 'fa-2', issue: 'State tax registration pending', employee: 'Jessica Park', entityId: 'xingco-us', dueDate: '2026-02-15', severity: 'High' },
  { id: 'fa-3', issue: 'T4 summary not submitted', employee: 'All CA employees', entityId: 'xingco-ca', dueDate: '2026-02-28', severity: 'Medium' },
  { id: 'fa-4', issue: 'P60 forms pending', employee: 'All UK employees', entityId: 'xingco-gb', dueDate: '2026-04-05', severity: 'Low' },
  { id: 'fa-5', issue: 'TDS quarterly return overdue', employee: 'All IN employees', entityId: 'xingco-in', dueDate: '2026-01-15', severity: 'Critical' },
  { id: 'fa-6', issue: 'Lohnsteuer filing due', employee: 'All DE employees', entityId: 'xingco-de', dueDate: '2026-02-10', severity: 'High' },
];

// ── Tax Settings ──────────────────────────────────────────────────────────────

export const TAX_SETTINGS: TaxSetting[] = [
  { id: 'ts-1', category: 'Federal Income Tax', status: 'Configured', entityId: 'xingco-us' },
  { id: 'ts-2', category: 'State Income Tax', status: 'Configured', entityId: 'xingco-us' },
  { id: 'ts-3', category: 'FICA (Social Security & Medicare)', status: 'Configured', entityId: 'xingco-us' },
  { id: 'ts-4', category: 'FUTA', status: 'Configured', entityId: 'xingco-us' },
  { id: 'ts-5', category: 'Federal Income Tax', status: 'Configured', entityId: 'xingco-ca' },
  { id: 'ts-6', category: 'Provincial Income Tax', status: 'Configured', entityId: 'xingco-ca' },
  { id: 'ts-7', category: 'CPP/QPP', status: 'Configured', entityId: 'xingco-ca' },
  { id: 'ts-8', category: 'PAYE', status: 'Configured', entityId: 'xingco-gb' },
  { id: 'ts-9', category: 'National Insurance', status: 'Configured', entityId: 'xingco-gb' },
  { id: 'ts-10', category: 'Income Tax (TDS)', status: 'Configured', entityId: 'xingco-in' },
  { id: 'ts-11', category: 'Professional Tax', status: 'Pending', entityId: 'xingco-in' },
  { id: 'ts-12', category: 'Lohnsteuer', status: 'Configured', entityId: 'xingco-de' },
  { id: 'ts-13', category: 'Solidarity Surcharge', status: 'Configured', entityId: 'xingco-de' },
  { id: 'ts-14', category: 'Imp\u00F4t sur le revenu', status: 'Configured', entityId: 'xingco-fr' },
  { id: 'ts-15', category: 'PAYG Withholding', status: 'Configured', entityId: 'xingco-au' },
  { id: 'ts-16', category: 'Medicare Levy', status: 'Not started', entityId: 'xingco-au' },
];

// ── View Mode Config (for Approach C) ─────────────────────────────────────────

export const VIEW_MODES: Record<string, ViewModeConfig> = {
  overview: { default: 'operational', allowMulti: true },
  people: { default: 'operational', allowMulti: true },
  settings: { default: 'configuration', allowMulti: false },
  entities: { default: 'operational', allowMulti: true },
  accounting: { default: 'operational', allowMulti: true },
  balances: { default: 'operational', allowMulti: true },
  reports: { default: 'operational', allowMulti: true },
  earnings: { default: 'hybrid', allowMulti: true },
  deductions: { default: 'hybrid', allowMulti: true },
  garnishments: { default: 'hybrid', allowMulti: true },
  filings: { default: 'hybrid', allowMulti: true },
  'filings-action-required': { default: 'operational', allowMulti: true },
  'filings-tax-settings': { default: 'configuration', allowMulti: false },
};

// ── Helper: filter any array by entityId ──────────────────────────────────────

export function filterByEntities<T extends { entityId: string }>(
  items: T[],
  selectedEntityIds: string[],
): T[] {
  if (selectedEntityIds.length === 0 || selectedEntityIds.length === ENTITIES.length) return items;
  return items.filter(item => selectedEntityIds.includes(item.entityId));
}
