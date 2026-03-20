import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import ObjectUI from '@rippling/pebble/ObjectUI';

/**
 * Payroll Register Report
 *
 * Tree-table layout: employees → categories → line items.
 * Columns: Hours, YTD Hours, Amount, YTD Amount.
 * Each level is expand/collapse.
 */

// --- Mock Data ---

const ENTITY = {
  name: 'ABC Inc.',
  address: '1234 W Easton Ave\nVancouver, BC',
  paymentDate: 'Apr 17, 2026',
  payPeriod: 'Apr 1, 2026 – Apr 15, 2026',
  paySchedule: 'Semi-monthly',
  payPeriodNumber: '7',
};

interface Employee {
  name: string;
  title: string;
  department: string;
  classification: string;
  phone: string;
  address: string;
  summary: { grossPay: number; taxes: number; deductions: number; netPay: number };
  summaryYtd: { grossPay: number; taxes: number; deductions: number; netPay: number };
  earnings: Array<{ label: string; rate: number; hours: number; amount: number; ytdHours: number; ytdAmount: number }>;
  deductions: Array<{ label: string; amount: number; ytdAmount: number }>;
  taxes: Array<{ label: string; amount: number; ytdAmount: number }>;
  taxableBenefits: Array<{ label: string; amount: number; ytdAmount: number }>;
  employerContributions: Array<{ label: string; amount: number; ytdAmount: number }>;
  otherPayments: Array<{ label: string; amount: number; ytdAmount: number }>;
  timeOff: Array<{ label: string; used: number; accrued: number; balance: number }>;
}

const EMPLOYEES: Employee[] = [
  {
    name: 'Ethan Smith',
    title: 'Accounting Lead',
    department: 'Finance',
    classification: 'W-2',
    phone: '(404) 123-1234',
    address: '1234 W Easton Ave\nVancouver, BC',
    summary: { grossPay: 3846.15, taxes: 862.42, deductions: 425.00, netPay: 2558.73 },
    summaryYtd: { grossPay: 27123.05, taxes: 6036.94, deductions: 2975.00, netPay: 18111.11 },
    earnings: [
      { label: 'Regular salary', rate: 100000, hours: 86.67, amount: 3461.54, ytdHours: 606.69, ytdAmount: 24230.78 },
      { label: 'Overtime', rate: 72.12, hours: 5.33, amount: 384.61, ytdHours: 40.14, ytdAmount: 2892.27 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 275.00, ytdAmount: 1925.00 },
      { label: '401(k)', amount: 150.00, ytdAmount: 1050.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 542.42, ytdAmount: 3796.94 },
      { label: 'State income tax', amount: 180.00, ytdAmount: 1260.00 },
      { label: 'Social Security', amount: 95.00, ytdAmount: 665.00 },
      { label: 'Medicare', amount: 45.00, ytdAmount: 315.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 12.50, ytdAmount: 87.50 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 192.31, ytdAmount: 1346.17 },
      { label: 'EI', amount: 62.50, ytdAmount: 437.50 },
    ],
    otherPayments: [
      { label: 'Mileage reimbursement', amount: 85.00, ytdAmount: 510.00 },
    ],
    timeOff: [
      { label: 'Vacation', used: 8, accrued: 3.33, balance: 15.31 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 11.69 },
    ],
  },
  {
    name: 'Maya Chen',
    title: 'Software Engineer',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(604) 555-7890',
    address: '890 Pacific Blvd\nVancouver, BC',
    summary: { grossPay: 4615.38, taxes: 1058.23, deductions: 525.00, netPay: 3032.15 },
    summaryYtd: { grossPay: 32307.66, taxes: 7407.61, deductions: 3675.00, netPay: 21225.05 },
    earnings: [
      { label: 'Regular salary', rate: 120000, hours: 86.67, amount: 4615.38, ytdHours: 606.69, ytdAmount: 32307.66 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 325.00, ytdAmount: 2275.00 },
      { label: '401(k)', amount: 200.00, ytdAmount: 1400.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 698.23, ytdAmount: 4887.61 },
      { label: 'State income tax', amount: 215.00, ytdAmount: 1505.00 },
      { label: 'Social Security', amount: 100.00, ytdAmount: 700.00 },
      { label: 'Medicare', amount: 45.00, ytdAmount: 315.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 15.00, ytdAmount: 105.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 230.77, ytdAmount: 1615.39 },
      { label: 'EI', amount: 75.00, ytdAmount: 525.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 16, accrued: 4.17, balance: 13.19 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 11.69 },
    ],
  },
  {
    name: 'Tracy Erickson',
    title: 'Account Executive',
    department: 'Sales',
    classification: 'W-2',
    phone: '(404) 555-0142',
    address: '742 Evergreen Terrace\nSan Francisco, CA',
    summary: { grossPay: 5145.71, taxes: 1544.98, deductions: 102.91, netPay: 3498.22 },
    summaryYtd: { grossPay: 61748.52, taxes: 18539.76, deductions: 1234.92, netPay: 41978.64 },
    earnings: [
      { label: 'Salary', rate: 120000, hours: 86.67, amount: 5145.71, ytdHours: 1040.04, ytdAmount: 61748.52 },
    ],
    deductions: [
      { label: '401(K) Employee', amount: 102.91, ytdAmount: 1234.92 },
    ],
    taxes: [
      { label: 'Federal Income Tax', amount: 762.23, ytdAmount: 9146.76 },
      { label: 'Medicare', amount: 74.61, ytdAmount: 895.32 },
      { label: 'SDI Withholding – CA', amount: 61.75, ytdAmount: 741.00 },
      { label: 'Social Security', amount: 319.03, ytdAmount: 3828.36 },
      { label: 'State Withholding – CA', amount: 326.96, ytdAmount: 3923.52 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'Employer Medicare Tax', amount: 74.61, ytdAmount: 895.32 },
      { label: 'Social Security – Employer', amount: 319.03, ytdAmount: 3828.36 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'PTO', used: 8.00, accrued: 6.67, balance: 45.33 },
      { label: 'Sick Leave', used: 0, accrued: 3.33, balance: 24.00 },
    ],
  },
  {
    name: 'Andrea Jackson',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    classification: 'W-2',
    phone: '(312) 555-0198',
    address: '55 W Monroe St\nChicago, IL',
    summary: { grossPay: 4833.33, taxes: 1412.50, deductions: 96.67, netPay: 3324.16 },
    summaryYtd: { grossPay: 57999.96, taxes: 16950.00, deductions: 1160.04, netPay: 39889.92 },
    earnings: [
      { label: 'Salary', rate: 116000, hours: 86.67, amount: 4833.33, ytdHours: 1040.04, ytdAmount: 57999.96 },
    ],
    deductions: [
      { label: '401(K) Employee', amount: 96.67, ytdAmount: 1160.04 },
    ],
    taxes: [
      { label: 'Federal Income Tax', amount: 698.50, ytdAmount: 8382.00 },
      { label: 'Medicare', amount: 70.08, ytdAmount: 840.96 },
      { label: 'Social Security', amount: 299.67, ytdAmount: 3596.04 },
      { label: 'State Withholding – IL', amount: 344.25, ytdAmount: 4131.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'Employer Medicare Tax', amount: 70.08, ytdAmount: 840.96 },
      { label: 'Social Security – Employer', amount: 299.67, ytdAmount: 3596.04 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'PTO', used: 0, accrued: 6.67, balance: 46.67 },
      { label: 'Sick Leave', used: 0, accrued: 3.33, balance: 24.00 },
    ],
  },
  {
    name: 'Michael Jackson',
    title: 'SMB Account Rep',
    department: 'SMB',
    classification: 'W-2',
    phone: '(213) 555-0177',
    address: '100 Wilshire Blvd\nLos Angeles, CA',
    summary: { grossPay: 4166.67, taxes: 1208.33, deductions: 83.33, netPay: 2875.01 },
    summaryYtd: { grossPay: 50000.04, taxes: 14499.96, deductions: 999.96, netPay: 34500.12 },
    earnings: [
      { label: 'Salary', rate: 100000, hours: 86.67, amount: 4166.67, ytdHours: 1040.04, ytdAmount: 50000.04 },
    ],
    deductions: [
      { label: '401(K) Employee', amount: 83.33, ytdAmount: 999.96 },
    ],
    taxes: [
      { label: 'Federal Income Tax', amount: 583.33, ytdAmount: 6999.96 },
      { label: 'Medicare', amount: 60.42, ytdAmount: 725.04 },
      { label: 'SDI Withholding – CA', amount: 50.00, ytdAmount: 600.00 },
      { label: 'Social Security', amount: 258.33, ytdAmount: 3099.96 },
      { label: 'State Withholding – CA', amount: 256.25, ytdAmount: 3075.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'Employer Medicare Tax', amount: 60.42, ytdAmount: 725.04 },
      { label: 'Social Security – Employer', amount: 258.33, ytdAmount: 3099.96 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'PTO', used: 16.00, accrued: 6.67, balance: 30.67 },
      { label: 'Sick Leave', used: 0, accrued: 3.33, balance: 24.00 },
    ],
  },
  {
    name: 'Sarah Kim',
    title: 'Product Manager',
    department: 'Product',
    classification: 'W-2',
    phone: '(206) 555-0134',
    address: '401 2nd Ave S\nSeattle, WA',
    summary: { grossPay: 5416.67, taxes: 1625.00, deductions: 541.67, netPay: 3250.00 },
    summaryYtd: { grossPay: 65000.04, taxes: 19500.00, deductions: 6500.04, netPay: 39000.00 },
    earnings: [
      { label: 'Regular salary', rate: 130000, hours: 86.67, amount: 5416.67, ytdHours: 1040.04, ytdAmount: 65000.04 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 341.67, ytdAmount: 4100.04 },
      { label: '401(k)', amount: 200.00, ytdAmount: 2400.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1083.33, ytdAmount: 12999.96 },
      { label: 'Social Security', amount: 335.83, ytdAmount: 4029.96 },
      { label: 'Medicare', amount: 78.54, ytdAmount: 942.48 },
      { label: 'State income tax – WA', amount: 127.30, ytdAmount: 1527.60 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 18.75, ytdAmount: 225.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 270.83, ytdAmount: 3249.96 },
      { label: 'EI', amount: 87.50, ytdAmount: 1050.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 8, accrued: 5.00, balance: 37.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'James Rodriguez',
    title: 'DevOps Engineer',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(503) 555-0156',
    address: '1120 NW Couch St\nPortland, OR',
    summary: { grossPay: 5000.00, taxes: 1450.00, deductions: 500.00, netPay: 3050.00 },
    summaryYtd: { grossPay: 60000.00, taxes: 17400.00, deductions: 6000.00, netPay: 36600.00 },
    earnings: [
      { label: 'Regular salary', rate: 120000, hours: 86.67, amount: 5000.00, ytdHours: 1040.04, ytdAmount: 60000.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 300.00, ytdAmount: 3600.00 },
      { label: '401(k)', amount: 200.00, ytdAmount: 2400.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 950.00, ytdAmount: 11400.00 },
      { label: 'State income tax – OR', amount: 225.00, ytdAmount: 2700.00 },
      { label: 'Social Security', amount: 202.50, ytdAmount: 2430.00 },
      { label: 'Medicare', amount: 72.50, ytdAmount: 870.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 12.50, ytdAmount: 150.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 250.00, ytdAmount: 3000.00 },
      { label: 'EI', amount: 81.25, ytdAmount: 975.00 },
    ],
    otherPayments: [
      { label: 'Home office stipend', amount: 100.00, ytdAmount: 1200.00 },
    ],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 5.00, balance: 40.00 },
      { label: 'Sick leave', used: 4, accrued: 1.67, balance: 16.04 },
    ],
  },
  {
    name: 'Priya Patel',
    title: 'Data Scientist',
    department: 'Analytics',
    classification: 'W-2',
    phone: '(617) 555-0189',
    address: '75 State St\nBoston, MA',
    summary: { grossPay: 5833.33, taxes: 1750.00, deductions: 583.33, netPay: 3500.00 },
    summaryYtd: { grossPay: 69999.96, taxes: 21000.00, deductions: 6999.96, netPay: 42000.00 },
    earnings: [
      { label: 'Regular salary', rate: 140000, hours: 86.67, amount: 5833.33, ytdHours: 1040.04, ytdAmount: 69999.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 375.00, ytdAmount: 4500.00 },
      { label: '401(k)', amount: 208.33, ytdAmount: 2499.96 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1166.67, ytdAmount: 14000.04 },
      { label: 'State income tax – MA', amount: 291.67, ytdAmount: 3500.04 },
      { label: 'Social Security', amount: 210.00, ytdAmount: 2520.00 },
      { label: 'Medicare', amount: 81.66, ytdAmount: 979.92 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 20.00, ytdAmount: 240.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 291.67, ytdAmount: 3500.04 },
      { label: 'EI', amount: 93.75, ytdAmount: 1125.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 16, accrued: 5.83, balance: 29.96 },
      { label: 'Sick leave', used: 8, accrued: 1.67, balance: 12.04 },
    ],
  },
  {
    name: 'David Nguyen',
    title: 'UX Designer',
    department: 'Design',
    classification: 'W-2',
    phone: '(415) 555-0123',
    address: '580 Howard St\nSan Francisco, CA',
    summary: { grossPay: 4583.33, taxes: 1375.00, deductions: 458.33, netPay: 2750.00 },
    summaryYtd: { grossPay: 54999.96, taxes: 16500.00, deductions: 5499.96, netPay: 33000.00 },
    earnings: [
      { label: 'Regular salary', rate: 110000, hours: 86.67, amount: 4583.33, ytdHours: 1040.04, ytdAmount: 54999.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 300.00, ytdAmount: 3600.00 },
      { label: '401(k)', amount: 158.33, ytdAmount: 1899.96 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 870.83, ytdAmount: 10449.96 },
      { label: 'State income tax – CA', amount: 229.17, ytdAmount: 2750.04 },
      { label: 'Social Security', amount: 193.75, ytdAmount: 2325.00 },
      { label: 'Medicare', amount: 81.25, ytdAmount: 975.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 229.17, ytdAmount: 2750.04 },
      { label: 'EI', amount: 75.00, ytdAmount: 900.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 5.00, balance: 45.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Lisa Thompson',
    title: 'HR Business Partner',
    department: 'People',
    classification: 'W-2',
    phone: '(512) 555-0167',
    address: '300 W 6th St\nAustin, TX',
    summary: { grossPay: 4375.00, taxes: 1093.75, deductions: 437.50, netPay: 2843.75 },
    summaryYtd: { grossPay: 52500.00, taxes: 13125.00, deductions: 5250.00, netPay: 34125.00 },
    earnings: [
      { label: 'Regular salary', rate: 105000, hours: 86.67, amount: 4375.00, ytdHours: 1040.04, ytdAmount: 52500.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 287.50, ytdAmount: 3450.00 },
      { label: '401(k)', amount: 150.00, ytdAmount: 1800.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 787.50, ytdAmount: 9450.00 },
      { label: 'Social Security', amount: 218.75, ytdAmount: 2625.00 },
      { label: 'Medicare', amount: 87.50, ytdAmount: 1050.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 10.00, ytdAmount: 120.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 218.75, ytdAmount: 2625.00 },
      { label: 'EI', amount: 71.25, ytdAmount: 855.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 8, accrued: 4.17, balance: 32.04 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Carlos Mendez',
    title: 'Sales Engineer',
    department: 'Sales',
    classification: 'W-2',
    phone: '(305) 555-0145',
    address: '200 S Biscayne Blvd\nMiami, FL',
    summary: { grossPay: 5208.33, taxes: 1302.08, deductions: 520.83, netPay: 3385.42 },
    summaryYtd: { grossPay: 62499.96, taxes: 15624.96, deductions: 6249.96, netPay: 40625.04 },
    earnings: [
      { label: 'Regular salary', rate: 125000, hours: 86.67, amount: 5208.33, ytdHours: 1040.04, ytdAmount: 62499.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 350.00, ytdAmount: 4200.00 },
      { label: '401(k)', amount: 170.83, ytdAmount: 2049.96 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1041.67, ytdAmount: 12500.04 },
      { label: 'Social Security', amount: 182.29, ytdAmount: 2187.48 },
      { label: 'Medicare', amount: 78.12, ytdAmount: 937.44 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 260.42, ytdAmount: 3125.04 },
      { label: 'EI', amount: 84.38, ytdAmount: 1012.56 },
    ],
    otherPayments: [
      { label: 'Commission', amount: 2500.00, ytdAmount: 15000.00 },
    ],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 5.00, balance: 50.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Emily Zhang',
    title: 'Frontend Engineer',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(646) 555-0112',
    address: '350 5th Ave\nNew York, NY',
    summary: { grossPay: 5625.00, taxes: 1687.50, deductions: 562.50, netPay: 3375.00 },
    summaryYtd: { grossPay: 67500.00, taxes: 20250.00, deductions: 6750.00, netPay: 40500.00 },
    earnings: [
      { label: 'Regular salary', rate: 135000, hours: 86.67, amount: 5625.00, ytdHours: 1040.04, ytdAmount: 67500.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 362.50, ytdAmount: 4350.00 },
      { label: '401(k)', amount: 200.00, ytdAmount: 2400.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1125.00, ytdAmount: 13500.00 },
      { label: 'State income tax – NY', amount: 281.25, ytdAmount: 3375.00 },
      { label: 'Social Security', amount: 200.00, ytdAmount: 2400.00 },
      { label: 'Medicare', amount: 81.25, ytdAmount: 975.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 16.25, ytdAmount: 195.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 281.25, ytdAmount: 3375.00 },
      { label: 'EI', amount: 90.63, ytdAmount: 1087.56 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 24, accrued: 5.00, balance: 21.00 },
      { label: 'Sick leave', used: 8, accrued: 1.67, balance: 12.04 },
    ],
  },
  {
    name: 'Robert Williams',
    title: 'Controller',
    department: 'Finance',
    classification: 'W-2',
    phone: '(720) 555-0188',
    address: '1600 Broadway\nDenver, CO',
    summary: { grossPay: 6250.00, taxes: 1875.00, deductions: 625.00, netPay: 3750.00 },
    summaryYtd: { grossPay: 75000.00, taxes: 22500.00, deductions: 7500.00, netPay: 45000.00 },
    earnings: [
      { label: 'Regular salary', rate: 150000, hours: 86.67, amount: 6250.00, ytdHours: 1040.04, ytdAmount: 75000.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 400.00, ytdAmount: 4800.00 },
      { label: '401(k)', amount: 225.00, ytdAmount: 2700.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1375.00, ytdAmount: 16500.00 },
      { label: 'State income tax – CO', amount: 281.25, ytdAmount: 3375.00 },
      { label: 'Social Security', amount: 137.50, ytdAmount: 1650.00 },
      { label: 'Medicare', amount: 81.25, ytdAmount: 975.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 25.00, ytdAmount: 300.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 312.50, ytdAmount: 3750.00 },
      { label: 'EI', amount: 100.00, ytdAmount: 1200.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 6.67, balance: 60.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Jennifer Park',
    title: 'Marketing Manager',
    department: 'Marketing',
    classification: 'W-2',
    phone: '(310) 555-0199',
    address: '9440 Santa Monica Blvd\nBeverly Hills, CA',
    summary: { grossPay: 4791.67, taxes: 1437.50, deductions: 479.17, netPay: 2875.00 },
    summaryYtd: { grossPay: 57500.04, taxes: 17250.00, deductions: 5750.04, netPay: 34500.00 },
    earnings: [
      { label: 'Regular salary', rate: 115000, hours: 86.67, amount: 4791.67, ytdHours: 1040.04, ytdAmount: 57500.04 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 312.50, ytdAmount: 3750.00 },
      { label: '401(k)', amount: 166.67, ytdAmount: 2000.04 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 911.42, ytdAmount: 10937.04 },
      { label: 'State income tax – CA', amount: 239.58, ytdAmount: 2874.96 },
      { label: 'Social Security', amount: 207.50, ytdAmount: 2490.00 },
      { label: 'Medicare', amount: 79.00, ytdAmount: 948.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 239.58, ytdAmount: 2874.96 },
      { label: 'EI', amount: 77.50, ytdAmount: 930.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 16, accrued: 5.00, balance: 29.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Alex Rivera',
    title: 'QA Lead',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(408) 555-0176',
    address: '2025 Gateway Pl\nSan Jose, CA',
    summary: { grossPay: 4750.00, taxes: 1425.00, deductions: 475.00, netPay: 2850.00 },
    summaryYtd: { grossPay: 57000.00, taxes: 17100.00, deductions: 5700.00, netPay: 34200.00 },
    earnings: [
      { label: 'Regular salary', rate: 114000, hours: 86.67, amount: 4750.00, ytdHours: 1040.04, ytdAmount: 57000.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 300.00, ytdAmount: 3600.00 },
      { label: '401(k)', amount: 175.00, ytdAmount: 2100.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 902.50, ytdAmount: 10830.00 },
      { label: 'State income tax – CA', amount: 237.50, ytdAmount: 2850.00 },
      { label: 'Social Security', amount: 206.25, ytdAmount: 2475.00 },
      { label: 'Medicare', amount: 78.75, ytdAmount: 945.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 12.50, ytdAmount: 150.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 237.50, ytdAmount: 2850.00 },
      { label: 'EI', amount: 76.88, ytdAmount: 922.56 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 8, accrued: 5.00, balance: 37.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Olivia Brown',
    title: 'Recruiter',
    department: 'People',
    classification: 'W-2',
    phone: '(773) 555-0133',
    address: '233 S Wacker Dr\nChicago, IL',
    summary: { grossPay: 3750.00, taxes: 937.50, deductions: 375.00, netPay: 2437.50 },
    summaryYtd: { grossPay: 45000.00, taxes: 11250.00, deductions: 4500.00, netPay: 29250.00 },
    earnings: [
      { label: 'Regular salary', rate: 90000, hours: 86.67, amount: 3750.00, ytdHours: 1040.04, ytdAmount: 45000.00 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 250.00, ytdAmount: 3000.00 },
      { label: '401(k)', amount: 125.00, ytdAmount: 1500.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 637.50, ytdAmount: 7650.00 },
      { label: 'State income tax – IL', amount: 112.50, ytdAmount: 1350.00 },
      { label: 'Social Security', amount: 131.25, ytdAmount: 1575.00 },
      { label: 'Medicare', amount: 56.25, ytdAmount: 675.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 187.50, ytdAmount: 2250.00 },
      { label: 'EI', amount: 60.00, ytdAmount: 720.00 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 4.17, balance: 37.53 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Daniel Lee',
    title: 'Backend Engineer',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(425) 555-0154',
    address: '929 108th Ave NE\nBellevue, WA',
    summary: { grossPay: 5416.67, taxes: 1354.17, deductions: 541.67, netPay: 3520.83 },
    summaryYtd: { grossPay: 65000.04, taxes: 16250.04, deductions: 6500.04, netPay: 42249.96 },
    earnings: [
      { label: 'Regular salary', rate: 130000, hours: 86.67, amount: 5416.67, ytdHours: 1040.04, ytdAmount: 65000.04 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 341.67, ytdAmount: 4100.04 },
      { label: '401(k)', amount: 200.00, ytdAmount: 2400.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1083.33, ytdAmount: 12999.96 },
      { label: 'Social Security', amount: 193.75, ytdAmount: 2325.00 },
      { label: 'Medicare', amount: 77.09, ytdAmount: 925.08 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 15.00, ytdAmount: 180.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 270.83, ytdAmount: 3249.96 },
      { label: 'EI', amount: 87.50, ytdAmount: 1050.00 },
    ],
    otherPayments: [
      { label: 'Home office stipend', amount: 100.00, ytdAmount: 1200.00 },
    ],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 5.00, balance: 45.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Maria Santos',
    title: 'Payroll Specialist',
    department: 'Finance',
    classification: 'W-2',
    phone: '(214) 555-0122',
    address: '1700 Pacific Ave\nDallas, TX',
    summary: { grossPay: 3541.67, taxes: 885.42, deductions: 354.17, netPay: 2302.08 },
    summaryYtd: { grossPay: 42500.04, taxes: 10625.04, deductions: 4250.04, netPay: 27624.96 },
    earnings: [
      { label: 'Regular salary', rate: 85000, hours: 86.67, amount: 3541.67, ytdHours: 1040.04, ytdAmount: 42500.04 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 229.17, ytdAmount: 2750.04 },
      { label: '401(k)', amount: 125.00, ytdAmount: 1500.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 637.50, ytdAmount: 7650.00 },
      { label: 'Social Security', amount: 177.08, ytdAmount: 2124.96 },
      { label: 'Medicare', amount: 70.84, ytdAmount: 850.08 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 177.08, ytdAmount: 2124.96 },
      { label: 'EI', amount: 56.67, ytdAmount: 680.04 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 4.17, balance: 37.53 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Kevin O\'Brien',
    title: 'Solutions Architect',
    department: 'Engineering',
    classification: 'W-2',
    phone: '(704) 555-0143',
    address: '401 N Tryon St\nCharlotte, NC',
    summary: { grossPay: 5833.33, taxes: 1458.33, deductions: 583.33, netPay: 3791.67 },
    summaryYtd: { grossPay: 69999.96, taxes: 17499.96, deductions: 6999.96, netPay: 45500.04 },
    earnings: [
      { label: 'Regular salary', rate: 140000, hours: 86.67, amount: 5833.33, ytdHours: 1040.04, ytdAmount: 69999.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 375.00, ytdAmount: 4500.00 },
      { label: '401(k)', amount: 208.33, ytdAmount: 2499.96 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1049.99, ytdAmount: 12599.88 },
      { label: 'State income tax – NC', amount: 175.00, ytdAmount: 2100.00 },
      { label: 'Social Security', amount: 152.08, ytdAmount: 1824.96 },
      { label: 'Medicare', amount: 81.26, ytdAmount: 975.12 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 20.00, ytdAmount: 240.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 291.67, ytdAmount: 3500.04 },
      { label: 'EI', amount: 93.75, ytdAmount: 1125.00 },
    ],
    otherPayments: [
      { label: 'Travel reimbursement', amount: 450.00, ytdAmount: 2700.00 },
    ],
    timeOff: [
      { label: 'Vacation', used: 8, accrued: 6.67, balance: 52.04 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Rachel Green',
    title: 'Content Strategist',
    department: 'Marketing',
    classification: 'W-2',
    phone: '(202) 555-0166',
    address: '1050 Connecticut Ave NW\nWashington, DC',
    summary: { grossPay: 3958.33, taxes: 1187.50, deductions: 395.83, netPay: 2375.00 },
    summaryYtd: { grossPay: 47499.96, taxes: 14250.00, deductions: 4749.96, netPay: 28500.00 },
    earnings: [
      { label: 'Regular salary', rate: 95000, hours: 86.67, amount: 3958.33, ytdHours: 1040.04, ytdAmount: 47499.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 270.83, ytdAmount: 3249.96 },
      { label: '401(k)', amount: 125.00, ytdAmount: 1500.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 791.67, ytdAmount: 9500.04 },
      { label: 'State income tax – DC', amount: 197.92, ytdAmount: 2375.04 },
      { label: 'Social Security', amount: 138.54, ytdAmount: 1662.48 },
      { label: 'Medicare', amount: 59.37, ytdAmount: 712.44 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 197.92, ytdAmount: 2375.04 },
      { label: 'EI', amount: 63.33, ytdAmount: 759.96 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 4.17, balance: 37.53 },
      { label: 'Sick leave', used: 8, accrued: 1.67, balance: 12.04 },
    ],
  },
  {
    name: 'Tom Mitchell',
    title: 'IT Support Specialist',
    department: 'IT',
    classification: 'W-2',
    phone: '(602) 555-0111',
    address: '2 N Central Ave\nPhoenix, AZ',
    summary: { grossPay: 3333.33, taxes: 833.33, deductions: 333.33, netPay: 2166.67 },
    summaryYtd: { grossPay: 39999.96, taxes: 9999.96, deductions: 3999.96, netPay: 26000.04 },
    earnings: [
      { label: 'Regular salary', rate: 80000, hours: 86.67, amount: 3333.33, ytdHours: 1040.04, ytdAmount: 39999.96 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 208.33, ytdAmount: 2499.96 },
      { label: '401(k)', amount: 125.00, ytdAmount: 1500.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 566.67, ytdAmount: 6800.04 },
      { label: 'Social Security', amount: 191.66, ytdAmount: 2299.92 },
      { label: 'Medicare', amount: 75.00, ytdAmount: 900.00 },
    ],
    taxableBenefits: [],
    employerContributions: [
      { label: 'CPP', amount: 166.67, ytdAmount: 2000.04 },
      { label: 'EI', amount: 53.33, ytdAmount: 639.96 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 16, accrued: 4.17, balance: 21.53 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
  {
    name: 'Sophia Adams',
    title: 'Legal Counsel',
    department: 'Legal',
    classification: 'W-2',
    phone: '(404) 555-0188',
    address: '191 Peachtree St NE\nAtlanta, GA',
    summary: { grossPay: 6666.67, taxes: 2000.00, deductions: 666.67, netPay: 4000.00 },
    summaryYtd: { grossPay: 80000.04, taxes: 24000.00, deductions: 8000.04, netPay: 48000.00 },
    earnings: [
      { label: 'Regular salary', rate: 160000, hours: 86.67, amount: 6666.67, ytdHours: 1040.04, ytdAmount: 80000.04 },
    ],
    deductions: [
      { label: 'Health insurance', amount: 416.67, ytdAmount: 5000.04 },
      { label: '401(k)', amount: 250.00, ytdAmount: 3000.00 },
    ],
    taxes: [
      { label: 'Federal income tax', amount: 1466.67, ytdAmount: 17600.04 },
      { label: 'State income tax – GA', amount: 266.67, ytdAmount: 3200.04 },
      { label: 'Social Security', amount: 186.66, ytdAmount: 2239.92 },
      { label: 'Medicare', amount: 80.00, ytdAmount: 960.00 },
    ],
    taxableBenefits: [
      { label: 'Group life insurance', amount: 25.00, ytdAmount: 300.00 },
    ],
    employerContributions: [
      { label: 'CPP', amount: 333.33, ytdAmount: 3999.96 },
      { label: 'EI', amount: 106.67, ytdAmount: 1280.04 },
    ],
    otherPayments: [],
    timeOff: [
      { label: 'Vacation', used: 0, accrued: 6.67, balance: 60.00 },
      { label: 'Sick leave', used: 0, accrued: 1.67, balance: 20.04 },
    ],
  },
];

// --- Helpers ---

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtNum = (n: number) =>
  n % 1 === 0 ? n.toString() : n.toFixed(2);

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function sumField<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((s, item) => s + fn(item), 0);
}

function getEmpAggregates(emp: Employee) {
  return {
    earningsCurHours: sumField(emp.earnings, e => e.hours),
    earningsYtdHours: sumField(emp.earnings, e => e.ytdHours),
    earningsCurAmt: sumField(emp.earnings, e => e.amount),
    earningsYtdAmt: sumField(emp.earnings, e => e.ytdAmount),
    tbCurAmt: sumField(emp.taxableBenefits, b => b.amount),
    tbYtdAmt: sumField(emp.taxableBenefits, b => b.ytdAmount),
    dedCurAmt: sumField(emp.deductions, d => d.amount),
    dedYtdAmt: sumField(emp.deductions, d => d.ytdAmount),
    erCurAmt: sumField(emp.employerContributions, c => c.amount),
    erYtdAmt: sumField(emp.employerContributions, c => c.ytdAmount),
    opCurAmt: sumField(emp.otherPayments, p => p.amount),
    opYtdAmt: sumField(emp.otherPayments, p => p.ytdAmount),
    taxCurAmt: sumField(emp.taxes, t => t.amount),
    taxYtdAmt: sumField(emp.taxes, t => t.ytdAmount),
    toCurAmt: sumField(emp.timeOff, t => t.accrued),
    toYtdAmt: sumField(emp.timeOff, t => t.balance),
  };
}

interface DetailRow {
  earningsCode?: string; earningsCurHours?: number; earningsYtdHours?: number; earningsCurAmt?: number; earningsYtdAmt?: number;
  tbCode?: string; tbCurAmt?: number; tbYtdAmt?: number;
  dedCode?: string; dedCurAmt?: number; dedYtdAmt?: number;
  erCode?: string; erCurAmt?: number; erYtdAmt?: number;
  opCode?: string; opCurAmt?: number; opYtdAmt?: number;
  taxCode?: string; taxCurAmt?: number; taxYtdAmt?: number;
  toCode?: string; toCurAmt?: number; toYtdAmt?: number;
}

function getDetailRows(emp: Employee): DetailRow[] {
  const maxLen = Math.max(
    emp.earnings.length, emp.taxableBenefits.length, emp.deductions.length,
    emp.employerContributions.length, emp.otherPayments.length,
    emp.taxes.length, emp.timeOff.length,
  );
  const rows: DetailRow[] = [];
  for (let i = 0; i < maxLen; i++) {
    const e = emp.earnings[i];
    const tb = emp.taxableBenefits[i];
    const d = emp.deductions[i];
    const er = emp.employerContributions[i];
    const op = emp.otherPayments[i];
    const tx = emp.taxes[i];
    const to = emp.timeOff[i];
    rows.push({
      earningsCode: e?.label, earningsCurHours: e?.hours, earningsYtdHours: e?.ytdHours, earningsCurAmt: e?.amount, earningsYtdAmt: e?.ytdAmount,
      tbCode: tb?.label, tbCurAmt: tb?.amount, tbYtdAmt: tb?.ytdAmount,
      dedCode: d?.label, dedCurAmt: d?.amount, dedYtdAmt: d?.ytdAmount,
      erCode: er?.label, erCurAmt: er?.amount, erYtdAmt: er?.ytdAmount,
      opCode: op?.label, opCurAmt: op?.amount, opYtdAmt: op?.ytdAmount,
      taxCode: tx?.label, taxCurAmt: tx?.amount, taxYtdAmt: tx?.ytdAmount,
      toCode: to?.label, toCurAmt: to?.accrued, toYtdAmt: to?.balance,
    });
  }
  return rows;
}

// --- Styled Components (page shell) ---

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

const TopBarTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const ReportBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  margin: 0 auto;
`;

// --- Styled Components (grouped table) ---

const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 2800px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const GroupHeaderCell = styled.th<{ groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: center;
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurface};
  white-space: nowrap;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;

const SubHeaderCell = styled.th<{ textAlign?: string; groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 2px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurface};
  white-space: nowrap;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;

const NameHeaderCell = styled(SubHeaderCell)`
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space400};
`;

const AvatarCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimaryContainer};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  flex-shrink: 0;
`;

const EmpNameBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const EmpNameInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const EmpNameText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmpSubText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmpRow = styled.tr`
  & > td {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const TotalLabelCell = styled.td<{ groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;

const TotalValueCell = styled.td<{ groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: right;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;

const EmpNameCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  vertical-align: middle;
`;


const DetLabelCell = styled.td<{ groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;

const DetValueCell = styled.td<{ groupBorder?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: right;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
  ${({ groupBorder, theme }) => groupBorder ? `border-left: 1px solid ${(theme as StyledTheme).colorOutlineVariant};` : ''}
`;


// --- Main Component ---

const PayrollRegisterReportDemo: React.FC = () => {

  return (
    <Overlay>
      <TopBar>
        <TopBarTitle>Payroll register report</TopBarTitle>
        <TopBarActions>
          <Button
            appearance={Button.APPEARANCES.OUTLINE}
            size={Button.SIZES.S}
            icon={Icon.TYPES.DOWNLOAD}
          >
            Download PDF
          </Button>
          <Button.Icon
            icon={Icon.TYPES.CLOSE}
            aria-label="Close"
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            onClick={() => {}}
          />
        </TopBarActions>
      </TopBar>

      <Content>
        <ReportBody>
          <ObjectUI.Template>
            <ObjectUI.Header title={ENTITY.name} />
            <ObjectUI.Stats
              list={[
                { label: 'Address', renderer: ObjectUI.Stats.Renderer.TextRenderer, props: { value: ENTITY.address } },
                { label: 'Pay period', renderer: ObjectUI.Stats.Renderer.TextRenderer, props: { value: ENTITY.payPeriod } },
                { label: 'Payment date', renderer: ObjectUI.Stats.Renderer.TextRenderer, props: { value: ENTITY.paymentDate } },
                { label: 'Pay schedule', renderer: ObjectUI.Stats.Renderer.TextRenderer, props: { value: ENTITY.paySchedule } },
                { label: 'Pay period number', renderer: ObjectUI.Stats.Renderer.TextRenderer, props: { value: ENTITY.payPeriodNumber } },
              ]}
            />
          </ObjectUI.Template>

          <TableCard>
            <TableScroll>
              <Table>
                <colgroup>
                  {/* Employee */}
                  <col style={{ width: 280 }} />
                  {/* Summary: Label, Gross, Taxes, Deductions, Net */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Earnings: Code, CurHrs, YtdHrs, CurAmt, YtdAmt */}
                  <col style={{ width: 140 }} /><col style={{ width: 80 }} /><col style={{ width: 80 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Taxable Benefits: Code, Cur, YTD */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Deductions: Code, Cur, YTD */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Employer Contribution: Code, Cur, YTD */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Other Payments: Code, Cur, YTD */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Taxes: Code, Cur, YTD */}
                  <col style={{ width: 140 }} /><col style={{ width: 100 }} /><col style={{ width: 100 }} />
                  {/* Time Off: Code, Cur, YTD */}
                  <col style={{ width: 120 }} /><col style={{ width: 80 }} /><col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <GroupHeaderCell>Employee</GroupHeaderCell>
                    <GroupHeaderCell colSpan={5} groupBorder>Summary</GroupHeaderCell>
                    <GroupHeaderCell colSpan={5} groupBorder>Earnings</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Taxable Benefits</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Deductions</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Employer Contribution</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Other Payments</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Taxes</GroupHeaderCell>
                    <GroupHeaderCell colSpan={3} groupBorder>Time Off</GroupHeaderCell>
                  </tr>
                  <tr>
                    <NameHeaderCell>Name</NameHeaderCell>
                    {/* Summary */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Gross</SubHeaderCell>
                    <SubHeaderCell textAlign="right">Taxes</SubHeaderCell>
                    <SubHeaderCell textAlign="right">Deductions</SubHeaderCell>
                    <SubHeaderCell textAlign="right">Net</SubHeaderCell>
                    {/* Earnings */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Cur Hrs</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD Hrs</SubHeaderCell>
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Taxable Benefits */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Deductions */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Employer Contribution */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Other Payments */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Taxes */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                    {/* Time Off */}
                    <SubHeaderCell groupBorder />
                    <SubHeaderCell textAlign="right">Current</SubHeaderCell>
                    <SubHeaderCell textAlign="right">YTD</SubHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.flatMap(emp => {
                    const empKey = `emp:${emp.name}`;
                    const a = getEmpAggregates(emp);
                    const rows: React.ReactNode[] = [];

                    {/* Employee name group header — blank after name */}
                    rows.push(
                      <EmpRow key={empKey}>
                        <EmpNameCell>
                          <EmpNameBlock>
                            <AvatarCircle>{getInitials(emp.name)}</AvatarCircle>
                            <EmpNameInfo>
                              <EmpNameText>{emp.name}</EmpNameText>
                              <EmpSubText>{emp.title} · {emp.classification}</EmpSubText>
                            </EmpNameInfo>
                          </EmpNameBlock>
                        </EmpNameCell>
                        {Array.from({ length: 28 }, (_, i) => (
                          <td key={i} />
                        ))}
                      </EmpRow>,
                    );

                    {/* Detail rows */}
                    getDetailRows(emp).forEach((d, i) => {
                      rows.push(
                        <tr key={`${empKey}:det:${i}`}>
                          <DetLabelCell />
                          <DetLabelCell groupBorder /><DetValueCell /><DetValueCell /><DetValueCell /><DetValueCell />
                          <DetLabelCell groupBorder>{d.earningsCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.earningsCurHours != null ? fmtNum(d.earningsCurHours) : ''}</DetValueCell>
                          <DetValueCell>{d.earningsYtdHours != null ? fmtNum(d.earningsYtdHours) : ''}</DetValueCell>
                          <DetValueCell>{d.earningsCurAmt != null ? fmt(d.earningsCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.earningsYtdAmt != null ? fmt(d.earningsYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.tbCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.tbCurAmt != null ? fmt(d.tbCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.tbYtdAmt != null ? fmt(d.tbYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.dedCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.dedCurAmt != null ? fmt(d.dedCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.dedYtdAmt != null ? fmt(d.dedYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.erCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.erCurAmt != null ? fmt(d.erCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.erYtdAmt != null ? fmt(d.erYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.opCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.opCurAmt != null ? fmt(d.opCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.opYtdAmt != null ? fmt(d.opYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.taxCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.taxCurAmt != null ? fmt(d.taxCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.taxYtdAmt != null ? fmt(d.taxYtdAmt) : ''}</DetValueCell>
                          <DetLabelCell groupBorder>{d.toCode ?? ''}</DetLabelCell>
                          <DetValueCell>{d.toCurAmt != null ? fmtNum(d.toCurAmt) : ''}</DetValueCell>
                          <DetValueCell>{d.toYtdAmt != null ? fmtNum(d.toYtdAmt) : ''}</DetValueCell>
                        </tr>,
                      );
                    });

                    {/* Totals row */}
                    rows.push(
                      <tr key={`${empKey}:total`}>
                        <TotalLabelCell />
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmt(emp.summary.grossPay)}</TotalValueCell>
                        <TotalValueCell>{fmt(emp.summary.taxes)}</TotalValueCell>
                        <TotalValueCell>{fmt(emp.summary.deductions)}</TotalValueCell>
                        <TotalValueCell>{fmt(emp.summary.netPay)}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmtNum(a.earningsCurHours)}</TotalValueCell>
                        <TotalValueCell>{fmtNum(a.earningsYtdHours)}</TotalValueCell>
                        <TotalValueCell>{fmt(a.earningsCurAmt)}</TotalValueCell>
                        <TotalValueCell>{fmt(a.earningsYtdAmt)}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{a.tbCurAmt ? fmt(a.tbCurAmt) : '—'}</TotalValueCell>
                        <TotalValueCell>{a.tbYtdAmt ? fmt(a.tbYtdAmt) : '—'}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmt(a.dedCurAmt)}</TotalValueCell>
                        <TotalValueCell>{fmt(a.dedYtdAmt)}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmt(a.erCurAmt)}</TotalValueCell>
                        <TotalValueCell>{fmt(a.erYtdAmt)}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{a.opCurAmt ? fmt(a.opCurAmt) : '—'}</TotalValueCell>
                        <TotalValueCell>{a.opYtdAmt ? fmt(a.opYtdAmt) : '—'}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmt(a.taxCurAmt)}</TotalValueCell>
                        <TotalValueCell>{fmt(a.taxYtdAmt)}</TotalValueCell>
                        <TotalLabelCell groupBorder>Totals</TotalLabelCell>
                        <TotalValueCell>{fmtNum(a.toCurAmt)}</TotalValueCell>
                        <TotalValueCell>{fmtNum(a.toYtdAmt)}</TotalValueCell>
                      </tr>,
                    );

                    return rows;
                  })}

                </tbody>
              </Table>
            </TableScroll>
          </TableCard>
        </ReportBody>
      </Content>
    </Overlay>
  );
};

export default PayrollRegisterReportDemo;
