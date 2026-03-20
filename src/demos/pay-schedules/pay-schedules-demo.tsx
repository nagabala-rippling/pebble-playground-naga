import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { AppNavBarNewRouter as AppNavBar } from '@rippling/pebble/AppNavBar/AppNavBar';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { PaySchedule, PayScheduleFormData, DUMMY_PAY_SCHEDULES } from './types';
import PaySchedulesList from './PaySchedulesList';
import DeleteScheduleModal from './DeleteScheduleModal';
import PriorityModal from './PriorityModal';
import CreateEditFlow from './CreateEditFlow';

// Settings vertical nav tab item
interface SettingsNavItem {
  id: string;
  label: string;
}

interface SettingsNavSection {
  heading: string;
  items: SettingsNavItem[];
}

const SETTINGS_NAV: SettingsNavSection[] = [
  {
    heading: 'Pay run and processing',
    items: [
      { id: 'pay-schedule', label: 'Pay schedule' },
      { id: 'retro-pay', label: 'Retro pay' },
      { id: 'payroll-approvals', label: 'Payroll approvals' },
      { id: 'additional-pay-runs', label: 'Additional pay runs' },
      { id: 'pay-calculations', label: 'Pay calculations' },
      { id: 'deduction-preferences', label: 'Deduction preferences' },
      { id: 'paystub-and-pay-runs', label: 'Paystub and pay runs' },
    ],
  },
  {
    heading: 'Payment and disbursement',
    items: [
      { id: 'funding-method', label: 'Funding method' },
      { id: 'employee-payment-methods', label: 'Employee payment methods' },
      { id: 'check-printing', label: 'Check printing' },
      { id: 'check-mailing', label: 'Check mailing' },
    ],
  },
];

// Styled components for the settings vertical nav
const SettingsLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  align-items: flex-start;
  width: 100%;
`;

const SettingsNav = styled.nav`
  flex-shrink: 0;
  border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutline};
  display: flex;
  flex-direction: column;
`;

const SettingsNavHeading = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space400}`};
  padding-top: ${({ theme }) => (theme as StyledTheme).space600};

  &:first-of-type {
    padding-top: ${({ theme }) => (theme as StyledTheme).space300};
  }
`;

const SettingsNavTab = styled.button<{ isActive: boolean }>`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme, isActive }) =>
    isActive
      ? (theme as StyledTheme).colorOnSurface
      : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: ${({ isActive }) => (isActive ? 535 : 400)};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space200} ${(theme as StyledTheme).space400}`};
  border-left: 2px solid
    ${({ theme, isActive }) =>
      isActive ? (theme as StyledTheme).colorOnSurface : 'transparent'};
  margin-left: -1px;
  white-space: nowrap;
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

const SettingsContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PaySchedulesDemo: React.FC = () => {
  const [schedules, setSchedules] = useState<PaySchedule[]>(DUMMY_PAY_SCHEDULES);
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PaySchedule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<PaySchedule | null>(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('pay-schedule');

  const handleAddSchedule = useCallback(() => {
    setEditingSchedule(null);
    setShowCreateEdit(true);
  }, []);

  const handleEditSchedule = useCallback((schedule: PaySchedule) => {
    setEditingSchedule(schedule);
    setShowCreateEdit(true);
  }, []);

  const handleDeleteSchedule = useCallback((schedule: PaySchedule) => {
    setScheduleToDelete(schedule);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (scheduleToDelete) {
      setSchedules(prev => {
        const filtered = prev.filter(s => s.id !== scheduleToDelete.id);
        return filtered.map((s, i) => ({ ...s, priority: i + 1 }));
      });
    }
    setShowDeleteModal(false);
    setScheduleToDelete(null);
  }, [scheduleToDelete]);

  const handleSaveSchedule = useCallback((formData: PayScheduleFormData) => {
    if (editingSchedule) {
      setSchedules(prev =>
        prev.map(s =>
          s.id === editingSchedule.id
            ? { ...s, ...formData, name: formData.name }
            : s
        )
      );
    } else {
      const newSchedule: PaySchedule = {
        id: `ps-${Date.now()}`,
        name: formData.name,
        priority: schedules.length + 1,
        employmentType: formData.employmentType,
        entity: formData.entity,
        country: 'United States',
        countryCode: 'US',
        fundingType: 'Two-day',
        fundingAccount: 'Chase Business ****4829',
        autoApproval: formData.autoApproval,
        payFrequency: formData.payFrequency,
        holidayHandling: formData.holidayHandling,
        arrearDaysUnit: formData.arrearDaysUnit,
        arrearDays: formData.arrearDays,
        firstPaymentDate: formData.firstPaymentDate,
        paymentDateDetails: formData.paymentDateDetails,
        superGroups: formData.superGroups,
        assignedEmployeeCount: 0,
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    setShowCreateEdit(false);
    setEditingSchedule(null);
  }, [editingSchedule, schedules.length]);

  const handlePrioritySave = useCallback((reorderedIds: string[]) => {
    setSchedules(prev => {
      const map = new Map(prev.map(s => [s.id, s]));
      return reorderedIds
        .map((id, i) => {
          const s = map.get(id);
          return s ? { ...s, priority: i + 1 } : null;
        })
        .filter((s): s is PaySchedule => s !== null);
    });
    setShowPriorityModal(false);
  }, []);

  // Standard Rippling sidebar navigation (collapsed, matching Figma)
  const topSection: NavSectionData = {
    items: [
      { id: 'home', label: 'Home', icon: Icon.TYPES.HOME_OUTLINE },
      { id: 'org-chart', label: 'Org Chart', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
    ],
  };

  const appsSection: NavSectionData = {
    items: [
      { id: 'favorites', label: 'Favorites', icon: Icon.TYPES.STAR_OUTLINE, hasSubmenu: true },
      { id: 'time', label: 'Time', icon: Icon.TYPES.TIME_OUTLINE, hasSubmenu: true },
    ],
  };

  const adminSection: NavSectionData = {
    items: [
      { id: 'hr', label: 'HR', icon: Icon.TYPES.PEOPLE_HEART_OUTLINE, hasSubmenu: true },
      { id: 'it', label: 'IT', icon: Icon.TYPES.LAPTOP_OUTLINE, hasSubmenu: true },
      { id: 'finance', label: 'Finance', icon: Icon.TYPES.CREDIT_CARD_OUTLINE, hasSubmenu: true },
      { id: 'payroll', label: 'Payroll', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, hasSubmenu: true },
    ],
  };

  const settingsSection: NavSectionData = {
    items: [
      { id: 'benefits', label: 'Benefits', icon: Icon.TYPES.HEART_OUTLINE, hasSubmenu: true },
      { id: 'talent', label: 'Talent', icon: Icon.TYPES.TALENT_OUTLINE, hasSubmenu: true },
      { id: 'compliance', label: 'Compliance', icon: Icon.TYPES.SHIELD_OUTLINE, hasSubmenu: true },
      { id: 'global', label: 'Global', icon: Icon.TYPES.GLOBE_OUTLINE, hasSubmenu: true },
    ],
  };

  const platformSection: NavSectionData = {
    items: [
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'company-settings', label: 'Company settings', icon: Icon.TYPES.SETTINGS_OUTLINE, hasSubmenu: true },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  return (
    <>
      <AppShellLayout
        pageTitle="Payroll settings"
        headerContent={
          <AppNavBar
            title="Payroll settings"
            links={[]}
            size={AppNavBar.SIZES.FLUID}
          />
        }
        mainNavSections={[topSection, appsSection, adminSection, settingsSection]}
        platformNavSection={platformSection}
        companyName="Acme, Inc."
        userInitial="A"
        defaultAdminMode
        defaultSidebarCollapsed
      >
        <SettingsLayout>
          <SettingsNav>
            {SETTINGS_NAV.map(section => (
              <React.Fragment key={section.heading}>
                <SettingsNavHeading>{section.heading}</SettingsNavHeading>
                {section.items.map(item => (
                  <SettingsNavTab
                    key={item.id}
                    isActive={activeSettingsTab === item.id}
                    onClick={() => setActiveSettingsTab(item.id)}
                  >
                    {item.label}
                  </SettingsNavTab>
                ))}
              </React.Fragment>
            ))}
          </SettingsNav>

          <SettingsContent>
            {activeSettingsTab === 'pay-schedule' && (
              <PaySchedulesList
                schedules={schedules}
                onAddSchedule={handleAddSchedule}
                onEditSchedule={handleEditSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onChangePriority={() => setShowPriorityModal(true)}
              />
            )}
          </SettingsContent>
        </SettingsLayout>
      </AppShellLayout>

      <CreateEditFlow
        isOpen={showCreateEdit}
        editingSchedule={editingSchedule}
        onClose={() => {
          setShowCreateEdit(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule}
      />

      <DeleteScheduleModal
        isVisible={showDeleteModal}
        scheduleName={scheduleToDelete?.name || ''}
        assignedEmployeeCount={scheduleToDelete?.assignedEmployeeCount || 0}
        onCancel={() => {
          setShowDeleteModal(false);
          setScheduleToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <PriorityModal
        isVisible={showPriorityModal}
        schedules={schedules}
        onCancel={() => setShowPriorityModal(false)}
        onSave={handlePrioritySave}
      />
    </>
  );
};

export default PaySchedulesDemo;
