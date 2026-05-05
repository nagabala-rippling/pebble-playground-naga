import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Notice from '@rippling/pebble/Notice';
import Status from '@rippling/pebble/Status';
import TableBasic from '@rippling/pebble/TableBasic';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';

type StatusAppearance = (typeof Status.APPEARANCES)[keyof typeof Status.APPEARANCES];
import { StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import { PAYROLL_RUNS, RunRecord, Tab, TAB_LABELS } from './global-payroll-overview/data';

const TABS: Tab[] = [
  'upcomingAndDraft',
  'failed',
  'submitted',
  'completed',
  'corrections',
  'archived',
];

const TableSection = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const EmptyStateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space1000};
  text-align: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
`;

const FlagEmoji = styled.span`
  font-size: 18px;
  line-height: 1;
`;

const EntityCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EntityName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const EntityCountry = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const STATUS_APPEARANCE: Record<RunRecord['status'], StatusAppearance> = {
  Draft: Status.APPEARANCES.TERTIARY,
  Upcoming: Status.APPEARANCES.PRIMARY,
  Submitted: Status.APPEARANCES.PRIMARY,
  Approved: Status.APPEARANCES.SUCCESS,
  Paid: Status.APPEARANCES.SUCCESS,
  'On hold': Status.APPEARANCES.ERROR,
  Failed: Status.APPEARANCES.ERROR,
  Archived: Status.APPEARANCES.DISABLED,
  'Needs review': Status.APPEARANCES.WARNING,
};

const RunListTable: React.FC<{
  runs: RunRecord[];
  showChangedBy?: boolean;
  emptyText: string;
  actionText: string;
}> = ({ runs, showChangedBy, emptyText, actionText }) => {
  if (runs.length === 0) {
    return <EmptyStateBox>{emptyText}</EmptyStateBox>;
  }
  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Entity</TableBasic.Th>
          <TableBasic.Th>Take action by</TableBasic.Th>
          <TableBasic.Th>Pay date</TableBasic.Th>
          <TableBasic.Th>Status</TableBasic.Th>
          {showChangedBy && <TableBasic.Th>Changed by</TableBasic.Th>}
          <TableBasic.Th />
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {runs.map(run => (
          <TableBasic.Tr key={run.id}>
            <TableBasic.Td>
              <HStack gap="0.75rem">
                <FlagEmoji>{run.flag}</FlagEmoji>
                <EntityCell>
                  <EntityName>{run.entityName}</EntityName>
                  <EntityCountry>{run.country}</EntityCountry>
                </EntityCell>
              </HStack>
            </TableBasic.Td>
            <TableBasic.Td>{run.takeActionBy ?? '—'}</TableBasic.Td>
            <TableBasic.Td>{run.payDate}</TableBasic.Td>
            <TableBasic.Td>
              <Status
                appearance={STATUS_APPEARANCE[run.status]}
                text={run.status}
                size={Status.SIZES.M}
              />
            </TableBasic.Td>
            {showChangedBy && <TableBasic.Td>{run.changedBy ?? '—'}</TableBasic.Td>}
            <TableBasic.Td>
              <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S}>
                {actionText}
              </Button>
            </TableBasic.Td>
          </TableBasic.Tr>
        ))}
      </TableBasic.TBody>
    </TableBasic>
  );
};

const GlobalPayrollOverviewDemo: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showOnHoldBanner, setShowOnHoldBanner] = useState(true);
  const [showYearEndBanner, setShowYearEndBanner] = useState(true);

  const activeTab = TABS[activeTabIndex];

  const tabRuns = useMemo(() => {
    const inTab = (run: RunRecord, tab: Tab) => {
      switch (tab) {
        case 'upcomingAndDraft':
          return run.status === 'Draft' || run.status === 'Upcoming';
        case 'failed':
          return run.status === 'On hold' || run.status === 'Failed';
        case 'submitted':
          return run.status === 'Submitted';
        case 'completed':
          return run.status === 'Approved' || run.status === 'Paid';
        case 'corrections':
          return run.status === 'Needs review';
        case 'archived':
          return run.status === 'Archived';
      }
    };
    return PAYROLL_RUNS.filter(r => inTab(r, activeTab));
  }, [activeTab]);

  const pageActions = (
    <HStack gap="0.5rem">
      <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M}>
        Off-cycle run
      </Button>
      <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M}>
        Run payroll
      </Button>
    </HStack>
  );

  const tabConfig: Record<Tab, { actionText: string; showChangedBy?: boolean; emptyText: string }> =
    {
      upcomingAndDraft: {
        actionText: 'Run payroll',
        emptyText: 'No upcoming or draft pay runs.',
      },
      failed: {
        actionText: 'Run payroll',
        emptyText: 'No failed pay runs. Nice.',
      },
      submitted: {
        actionText: 'View payroll',
        emptyText: 'Nothing currently submitted.',
      },
      completed: {
        actionText: 'View payroll',
        emptyText: 'No completed runs in the selected range.',
      },
      corrections: {
        actionText: 'Review',
        emptyText: 'No corrections to review.',
      },
      archived: {
        actionText: 'View payroll',
        showChangedBy: true,
        emptyText: 'No archived runs.',
      },
    };

  const cfg = tabConfig[activeTab];

  return (
    <AppShellLayout
      pageTitle="Global Payroll"
      pageTabs={TAB_LABELS}
      defaultActiveTab={0}
      onTabChange={setActiveTabIndex}
      pageActions={pageActions}
      defaultAdminMode
      companyName="Acme, Inc."
      userInitial="A"
      showNotificationBadge
      notificationCount={3}
    >
      <VStack gap={16}>
        {showOnHoldBanner && (
          <Notice.Error
            title="2 pay runs are on hold"
            description="Insufficient funds detected for ACME UK Ltd and ACME Canada Inc. Resolve before pay date to avoid disruption."
            isCloseable
            onClose={close => {
              setShowOnHoldBanner(false);
              close();
            }}
            primaryAction={{
              title: 'View blocked runs',
              onClick: () => setActiveTabIndex(1),
            }}
          />
        )}
        {showYearEndBanner && (
          <Notice.Info
            title="Year-end checklist available"
            description="Review your year-end tasks for US entities. 4 of 7 tasks remaining."
            isCloseable
            onClose={close => {
              setShowYearEndBanner(false);
              close();
            }}
            primaryAction={{
              title: 'Open checklist',
              onClick: () => undefined,
            }}
          />
        )}

        <TableSection>
          <SectionTitle>{TAB_LABELS[activeTabIndex]}</SectionTitle>
          <RunListTable
            runs={tabRuns}
            showChangedBy={cfg.showChangedBy}
            actionText={cfg.actionText}
            emptyText={cfg.emptyText}
          />
        </TableSection>
      </VStack>
    </AppShellLayout>
  );
};

export default GlobalPayrollOverviewDemo;
