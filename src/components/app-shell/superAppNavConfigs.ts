import Icon from '@rippling/pebble/Icon';
import { NavSectionData, SuperAppNavConfig } from './types';

/**
 * Home view navigation sections.
 *
 * Sourced from rippling-webapp `getSideNavConfig.ts` and the integration test mock.
 * All icons use _OUTLINE variants; NavItem swaps to _FILLED when active.
 */

export const HOME_TOP_SECTION: NavSectionData = {
  items: [
    { id: 'hire', label: 'Hire', icon: Icon.TYPES.PROVISION_USERS_ONBOARD_OUTLINE },
    { id: 'offboard', label: 'Offboard', icon: Icon.TYPES.PROVISION_USERS_OFFBOARD_OUTLINE },
    { id: 'org-chart', label: 'Org Chart', icon: Icon.TYPES.DEPARTMENTS_OUTLINE },
  ],
};

export const HOME_MAIN_SECTION: NavSectionData = {
  items: [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Icon.TYPES.STAR_OUTLINE,
      hasSubmenu: true,
      navigable: false,
    },
    { id: 'time', label: 'Time', icon: Icon.TYPES.TIME_OUTLINE, hasSubmenu: true, navigable: true },
    {
      id: 'benefits',
      label: 'Benefits',
      icon: Icon.TYPES.HEART_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: Icon.TYPES.STACKED_COINS_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: Icon.TYPES.CREDIT_CARD_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    {
      id: 'talent',
      label: 'Talent',
      icon: Icon.TYPES.TALENT_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    { id: 'it', label: 'IT', icon: Icon.TYPES.IT_OUTLINE, hasSubmenu: true, navigable: true },
    { id: 'hr', label: 'HR', icon: Icon.TYPES.USERS_OUTLINE, hasSubmenu: true, navigable: true },
    {
      id: 'custom-apps',
      label: 'Custom Apps',
      icon: Icon.TYPES.CUSTOM_APPS_OUTLINE,
      hasSubmenu: true,
      navigable: false,
    },
  ],
};

export const HOME_PLATFORM_SECTION: NavSectionData = {
  label: 'Platform',
  items: [
    {
      id: 'tools',
      label: 'Tools',
      icon: Icon.TYPES.TOOLS_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    {
      id: 'data',
      label: 'Data',
      icon: Icon.TYPES.SERVER_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    {
      id: 'global-settings',
      label: 'Global Settings',
      icon: Icon.TYPES.COG_GLOBE_OUTLINE,
      hasSubmenu: true,
      navigable: true,
    },
    { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.APPS_OUTLINE },
    { id: 'help', label: 'Help', icon: Icon.TYPES.HELP_OUTLINE },
  ],
};

/** Platform footer shared across all super app views (same items as Home). */
export const PLATFORM_FOOTER_SECTION = HOME_PLATFORM_SECTION;

// ─── Super App Configs ────────────────────────────────────────────────────────

const TIME_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [
      { id: 'time-overview', label: 'Overview', icon: Icon.TYPES.COMBO_CHART_OUTLINE },
      { id: 'time-my-time', label: 'My Time', icon: Icon.TYPES.USER_OUTLINE },
    ],
  },
  mainSection: {
    items: [
      { id: 'time-approvals', label: 'Approvals', icon: Icon.TYPES.TASKS_OUTLINE },
      { id: 'time-schedules', label: 'Schedules', icon: Icon.TYPES.CALENDAR_OUTLINE },
      { id: 'time-timecards', label: 'Timecards', icon: Icon.TYPES.OVERTIME_POLICY_OUTLINE },
      { id: 'time-attendance', label: 'Attendance', icon: Icon.TYPES.STAR_OUTLINE },
      { id: 'time-time-off', label: 'Time Off', icon: Icon.TYPES.LEAVE_MANAGEMENT_OUTLINED },
      { id: 'time-kiosk', label: 'Kiosk Management', icon: Icon.TYPES.REASSIGN_COMPUTER_OUTLINE },
      { id: 'time-policies', label: 'Policies', icon: Icon.TYPES.INPOLICY_OUTLINE },
      { id: 'time-people', label: 'People', icon: Icon.TYPES.USERS_OUTLINE },
      { id: 'time-settings', label: 'Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
    ],
  },
};

const BENEFITS_CONFIG: SuperAppNavConfig = {
  countrySelector: {
    options: [
      { label: 'United States', value: 'us', flagCode: 'US' },
      { label: 'Canada', value: 'ca', flagCode: 'CA' },
      { label: 'United Kingdom', value: 'gb', flagCode: 'GB' },
      { label: 'India', value: 'in', flagCode: 'IN' },
      { label: 'Australia', value: 'au', flagCode: 'AU' },
    ],
    defaultValue: 'us',
  },
  topSection: {
    items: [
      { id: 'benefits-overview', label: 'Benefits Overview', icon: Icon.TYPES.HEART_OUTLINE },
      { id: 'benefits-my-benefits', label: 'My Benefits', icon: Icon.TYPES.NONPROFIT_OUTLINE },
    ],
  },
  mainSection: {
    items: [
      { id: 'benefits-enrollments', label: 'Enrollments', icon: Icon.TYPES.USERS_OUTLINE },
      {
        id: 'benefits-deductions',
        label: 'Deductions',
        icon: Icon.TYPES.GENERAL_LEDGER_DOLLAR_OUTLINE,
      },
      { id: 'benefits-transfer', label: 'Transfer', icon: Icon.TYPES.CHANGE_OUTLINE },
      {
        id: 'benefits-open-enrollment',
        label: 'Open Enrollment',
        icon: Icon.TYPES.HOURGLASS_CHECKED_OUTLINE,
      },
      {
        id: 'benefits-integrations',
        label: 'Integrations',
        icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE,
      },
      {
        id: 'benefits-commuter',
        label: 'Commuter',
        icon: Icon.TYPES.CHANGE_COMMUTER_BENEFITS_OUTLINE,
      },
      { id: 'benefits-fsa', label: 'FSA', icon: Icon.TYPES.FSA_OUTLINE },
      { id: 'benefits-hsa', label: 'HSA', icon: Icon.TYPES.HSA_OUTLINE },
      {
        id: 'benefits-aca',
        label: 'Affordable Care Act',
        icon: Icon.TYPES.FILE_SHIELD_PLUS_OUTLINE,
      },
      { id: 'benefits-retirement', label: 'Retirement', icon: Icon.TYPES.UMBRELLA_OUTLINE },
      {
        id: 'benefits-workers-comp',
        label: "Workers' Comp",
        icon: Icon.TYPES.BANDAGED_FOOT_OUTLINE,
      },
      { id: 'benefits-settings', label: 'Benefits Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
    ],
  },
};

const PAYROLL_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [
      { id: 'payroll-overview', label: 'Payroll Overview', icon: Icon.TYPES.DOLLAR_SIGN_GRAPH },
      { id: 'payroll-my-pay', label: 'My Pay', icon: Icon.TYPES.HAND_DOLLAR_OUTLINE },
    ],
  },
  mainSection: {
    items: [
      {
        id: 'payroll-accounting',
        label: 'Accounting Integrations',
        icon: Icon.TYPES.ACCOUNTING_OUTLINE,
      },
      { id: 'payroll-global', label: 'Global Payroll', icon: Icon.TYPES.GLOBE_OUTLINE },
      { id: 'payroll-us', label: 'Payroll (US)', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE },
      {
        id: 'payroll-variable-comp',
        label: 'Variable Compensation',
        icon: Icon.TYPES.STACKED_COINS_OUTLINE,
      },
    ],
  },
};

const FINANCE_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [
      { id: 'finance-overview', label: 'Finance Overview', icon: Icon.TYPES.FINANCES_OUTLINE },
      {
        id: 'finance-my-finances',
        label: 'My Finances',
        icon: Icon.TYPES.HAND_CREDIT_CARD_OUTLINE,
      },
    ],
  },
  mainSection: {
    items: [
      { id: 'finance-tasks', label: 'Tasks', icon: Icon.TYPES.TASKS_OUTLINE },
      { id: 'finance-cards', label: 'Cards', icon: Icon.TYPES.CREDIT_CARD_OUTLINE },
      {
        id: 'finance-transactions',
        label: 'Transactions',
        icon: Icon.TYPES.DOLLAR_CIRCLE_ARROWS_OUTLINE,
      },
      { id: 'finance-expenses', label: 'Expenses', icon: Icon.TYPES.RECEIPT_OUTLINE },
      { id: 'finance-travel', label: 'Travel', icon: Icon.TYPES.TRAVEL_OUTLINE },
      { id: 'finance-bills', label: 'Bills', icon: Icon.TYPES.INVOICE_DOLLAR_OUTLINE },
      { id: 'finance-procurement', label: 'Procurement', icon: Icon.TYPES.DELIVERY_TRUCK_OUTLINE },
      { id: 'finance-vendors', label: 'Vendors', icon: Icon.TYPES.VENDOR_OUTLINE },
      { id: 'finance-accounting', label: 'Accounting', icon: Icon.TYPES.ACCOUNTING_OUTLINE },
      { id: 'finance-forms', label: 'Forms', icon: Icon.TYPES.FEEDBACK_FORM_OUTLINE },
      { id: 'finance-policies', label: 'Policies', icon: Icon.TYPES.CUSTOMIZE_POLICY_OUTLINE },
      { id: 'finance-people', label: 'People', icon: Icon.TYPES.USERS_OUTLINE },
      { id: 'finance-settings', label: 'Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
    ],
  },
};

const TALENT_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [
      { id: 'talent-overview', label: 'Talent Overview', icon: Icon.TYPES.STAR_GRAPH_OUTLINE },
    ],
  },
  mainSection: {
    items: [
      { id: 'talent-headcount', label: 'Headcount Planning', icon: Icon.TYPES.USERS_OUTLINE },
      {
        id: 'talent-compensation',
        label: 'Compensation Bands',
        icon: Icon.TYPES.STACKED_COINS_OUTLINE,
      },
      { id: 'talent-feedback', label: 'Feedback', icon: Icon.TYPES.FEEDBACK_FORM_OUTLINE },
      { id: 'talent-goals', label: 'Goals', icon: Icon.TYPES.GOALS_OUTLINE },
      { id: 'talent-lms', label: 'Learning Management', icon: Icon.TYPES.LMS_OUTLINE },
      { id: 'talent-one-on-one', label: '1:1s', icon: Icon.TYPES.ONE_ON_ONE_OUTLINE },
      { id: 'talent-recruiting', label: 'Recruiting', icon: Icon.TYPES.RECRUITING_OUTLINE },
      {
        id: 'talent-review-cycles',
        label: 'Review Cycles',
        icon: Icon.TYPES.REVIEW_CYCLES_OUTLINE,
      },
      { id: 'talent-surveys', label: 'Surveys', icon: Icon.TYPES.SURVEY_NEUTRAL_OUTLINE },
    ],
  },
};

const IT_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [
      { id: 'it-getting-started', label: 'Getting Started', icon: Icon.TYPES.DEPLOY_OUTLINE },
      { id: 'it-overview', label: 'IT Overview', icon: Icon.TYPES.COLUMN_BAR_CHART_OUTLINE },
      { id: 'it-my-it', label: 'My IT', icon: Icon.TYPES.HAND_LAPTOP_OUTLINE },
    ],
  },
  mainSection: {
    items: [
      { id: 'it-people', label: 'People', icon: Icon.TYPES.USERS_OUTLINE },
      {
        id: 'it-third-party',
        label: 'Third-Party Access',
        icon: Icon.TYPES.APP_MANAGEMENT_OUTLINE,
      },
      { id: 'it-devices', label: 'Devices', icon: Icon.TYPES.LAPTOP_OUTLINE },
      { id: 'it-rpass', label: 'RPass', icon: Icon.TYPES.RPASS_OUTLINE },
      {
        id: 'it-automated-compliance',
        label: 'Automated Compliance',
        icon: Icon.TYPES.AUTOMATED_COMPLIANCE_OUTLINE,
      },
      { id: 'it-device-store', label: 'Device Store', icon: Icon.TYPES.GROCERIES_OUTLINE },
      { id: 'it-approvals', label: 'Approvals', icon: Icon.TYPES.TASKS_OUTLINE },
      { id: 'it-automations', label: 'IT Automations', icon: Icon.TYPES.THUNDERBOLT_OUTLINE },
    ],
  },
};

const HR_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [{ id: 'hr-overview', label: 'HR Overview', icon: Icon.TYPES.USER_GRAPH_OUTLINE }],
  },
  mainSection: {
    items: [
      { id: 'hr-people', label: 'People', icon: Icon.TYPES.USERS_OUTLINE },
      { id: 'hr-work-auth', label: 'Work Authorization', icon: Icon.TYPES.EMPLOYMENT_INFO_OUTLINE },
      {
        id: 'hr-compliance',
        label: 'Compliance 360',
        icon: Icon.TYPES.APPROVE_REJECT_SHIELD_OUTLINE,
      },
      { id: 'hr-contractor-hub', label: 'Contractor Hub', icon: Icon.TYPES.HANDSHAKE_OUTLINE },
      { id: 'hr-org-chart', label: 'Org Chart', icon: Icon.TYPES.DEPARTMENTS_OUTLINE },
    ],
  },
};

const TOOLS_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [],
  },
  mainSection: {
    items: [
      {
        id: 'tools-activity-log',
        label: 'Activity Log',
        icon: Icon.TYPES.AUDIT_OBSERVATION_OUTLINE,
      },
      { id: 'tools-approvals', label: 'Approvals', icon: Icon.TYPES.TASKS_OUTLINE },
      { id: 'tools-custom-apps', label: 'Custom Apps', icon: Icon.TYPES.CUSTOM_APPS_OUTLINE },
      { id: 'tools-developer', label: 'Developer', icon: Icon.TYPES.PUSH_OUTLINE },
      { id: 'tools-documents', label: 'Documents', icon: Icon.TYPES.DOCUMENT_OUTLINE },
      { id: 'tools-inbox', label: 'Inbox', icon: Icon.TYPES.INBOX_OUTLINE },
      {
        id: 'tools-notification-center',
        label: 'Notification Center',
        icon: Icon.TYPES.NOTIFICATION_OUTLINE,
      },
      { id: 'tools-recipes', label: 'Recipes', icon: Icon.TYPES.RECIPES_OUTLINE },
      { id: 'tools-reports', label: 'Reports', icon: Icon.TYPES.REPORTS_OUTLINE },
      { id: 'tools-sandbox', label: 'Sandbox', icon: Icon.TYPES.SANDBOX_OUTLINE },
      {
        id: 'tools-workflow-studio',
        label: 'Workflow Studio',
        icon: Icon.TYPES.THUNDERBOLT_OUTLINE,
      },
    ],
  },
};

const DATA_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [],
  },
  mainSection: {
    items: [
      { id: 'data-catalog', label: 'Catalog', icon: Icon.TYPES.TABLE_COLUMN_OUTLINE },
      { id: 'data-connections', label: 'Connections', icon: Icon.TYPES.CONNECT_DATABASE_OUTLINE },
      { id: 'data-dashboard', label: 'Data Dashboard', icon: Icon.TYPES.PIE_CHART_GRAPH_OUTLINE },
      { id: 'data-objects', label: 'Objects', icon: Icon.TYPES.OBJECT_OUTLINE },
      { id: 'data-permissions', label: 'Object Permissions', icon: Icon.TYPES.KEY },
      { id: 'data-pipelines', label: 'Data Pipelines', icon: Icon.TYPES.SWAP },
      {
        id: 'data-transformations',
        label: 'Transformations',
        icon: Icon.TYPES.TRANSFORMATIONS_OUTLINE,
      },
    ],
  },
};

const GLOBAL_SETTINGS_CONFIG: SuperAppNavConfig = {
  topSection: {
    items: [],
  },
  mainSection: {
    items: [
      {
        id: 'settings-company',
        label: 'Company Settings',
        icon: Icon.TYPES.COMPANY_SETTINGS_OUTLINE,
      },
      { id: 'settings-translations', label: 'Custom Translations', icon: Icon.TYPES.TRANSLATE },
      { id: 'settings-flow-config', label: 'Flow Configuration', icon: Icon.TYPES.OPTIONS },
      { id: 'settings-org-data', label: 'Organizational Data', icon: Icon.TYPES.OFFICE_OUTLINE },
      { id: 'settings-permissions', label: 'Permissions', icon: Icon.TYPES.FIDO_OUTLINE },
      { id: 'settings-supergroups', label: 'Saved Supergroups', icon: Icon.TYPES.USERS_OUTLINE },
      { id: 'settings-security', label: 'Security', icon: Icon.TYPES.LOCK_OUTLINE },
    ],
  },
};

/**
 * Maps super app display names to their navigation configs.
 *
 * The key must match the label displayed in the Home view's main nav section.
 */
export const SUPER_APP_NAV_CONFIGS: Record<string, SuperAppNavConfig> = {
  Time: TIME_CONFIG,
  Benefits: BENEFITS_CONFIG,
  Payroll: PAYROLL_CONFIG,
  Finance: FINANCE_CONFIG,
  Talent: TALENT_CONFIG,
  IT: IT_CONFIG,
  HR: HR_CONFIG,
  Tools: TOOLS_CONFIG,
  Data: DATA_CONFIG,
  'Global Settings': GLOBAL_SETTINGS_CONFIG,
};
