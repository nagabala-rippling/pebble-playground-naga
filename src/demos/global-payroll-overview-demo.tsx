import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Atoms from '@rippling/pebble/Atoms';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Notice from '@rippling/pebble/Notice';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';
import Tip from '@rippling/pebble/Tip';
import { StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import {
  PAY_RUNS,
  PayRun,
  RunStatusTone,
  Tab,
  TAB_LABELS,
  runsForTab,
} from './global-payroll-overview/data';

const TABS: Tab[] = [
  'upcomingAndDraft',
  'failed',
  'submitted',
  'completed',
  'corrections',
  'archived',
];

// ─── Layout primitives ─────────────────────────────────────────────

const Surface = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  overflow: hidden;
`;

// ─── Grid header (mirrors app/blocks/Grid/GridHeader/GridHeader.styles.ts) ───

const HeaderContainer = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  min-height: 40px;
`;

const HeaderTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  align-items: center;
`;

const HeaderBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  padding: 6px 12px;
  width: 320px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  padding: 6px 12px;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const RowCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-left: auto;
`;

// ─── Table ─────────────────────────────────────────────────────────

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th<{ width?: number; align?: 'left' | 'right' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: ${({ align }) => align ?? 'left'};
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  font-weight: 535;
  white-space: nowrap;
  ${({ width }) => (width ? `width: ${width}px;` : '')}
`;

const Td = styled.td<{ align?: 'left' | 'right' }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  vertical-align: middle;
  text-align: ${({ align }) => align ?? 'left'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const PayRunLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  text-decoration: none;
  cursor: pointer;
  font-weight: 535;
  &:hover {
    text-decoration: underline;
  }
`;

const SubText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

// ─── Status pill (mirrors Grid CELL_STATUS_TYPES) ─────────────────

const StatusPill = styled.span<{ tone: RunStatusTone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 535;
  white-space: nowrap;
  ${({ tone, theme }) => {
    const t = theme as StyledTheme;
    switch (tone) {
      case 'POSITIVE':
        return `background-color: ${t.colorSuccessVariant ?? '#E6F4EA'}; color: ${t.colorSuccess ?? '#137333'};`;
      case 'NEGATIVE':
        return `background-color: ${t.colorErrorVariant ?? '#FCE8E6'}; color: ${t.colorError ?? '#A50E0E'};`;
      case 'WARNING':
        return `background-color: ${t.colorWarningVariant ?? '#FEF7E0'}; color: ${t.colorWarning ?? '#7A4F01'};`;
      case 'NEUTRAL':
      default:
        return `background-color: ${t.colorSurfaceContainerHigh ?? '#E8EAED'}; color: ${t.colorOnSurfaceVariant ?? '#5F6368'};`;
    }
  }}
`;

const StatusDot = styled.span<{ tone: RunStatusTone }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  ${({ tone, theme }) => {
    const t = theme as StyledTheme;
    switch (tone) {
      case 'POSITIVE':
        return `background-color: ${t.colorSuccess ?? '#137333'};`;
      case 'NEGATIVE':
        return `background-color: ${t.colorError ?? '#A50E0E'};`;
      case 'WARNING':
        return `background-color: ${t.colorWarning ?? '#B27300'};`;
      case 'NEUTRAL':
      default:
        return `background-color: ${t.colorOnSurfaceVariant ?? '#5F6368'};`;
    }
  }}
`;

// ─── Empty state ───────────────────────────────────────────────────

const EmptyBox = styled.div`
  padding: 64px 16px;
  text-align: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
`;

// ─── Run list grid ─────────────────────────────────────────────────

interface RunListGridProps {
  title: string;
  runs: PayRun[];
  showStatus: boolean;
  showChangedBy: boolean;
  showAction: boolean;
  actionText: string;
  emptyText: string;
  searchPlaceholder: string;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

const RunListGrid: React.FC<RunListGridProps> = ({
  title,
  runs,
  showStatus,
  showChangedBy,
  showAction,
  emptyText,
  searchPlaceholder,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selectedIds.size === runs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(runs.map(r => r.runId)));
    }
  };
  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Surface>
      <HeaderContainer>
        <HeaderTopRow>
          <HeaderTitle>{title}</HeaderTitle>
          <HeaderActions>
            <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M}>
              Off-cycle run
            </Button>
            {primaryActionLabel && (
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.M}
                onClick={onPrimaryAction}
              >
                {primaryActionLabel}
              </Button>
            )}
          </HeaderActions>
        </HeaderTopRow>
        <HeaderBottomRow>
          <SearchBox>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />
            <span>{searchPlaceholder}</span>
          </SearchBox>
          <FilterChip>
            Country
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
          </FilterChip>
          <FilterChip>
            Entity
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
          </FilterChip>
          <FilterChip>
            Pay schedule
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
          </FilterChip>
          <RowCount>
            {runs.length} {runs.length === 1 ? 'run' : 'runs'}
          </RowCount>
        </HeaderBottomRow>
      </HeaderContainer>

      {runs.length === 0 ? (
        <EmptyBox>{emptyText}</EmptyBox>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th width={40}>
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.size === runs.length}
                  onChange={toggleAll}
                  aria-label="Select all runs"
                />
              </Th>
              <Th width={220}>Pay run</Th>
              <Th width={140}>Country</Th>
              <Th width={200}>Entity</Th>
              <Th width={80} align="right">
                People
              </Th>
              <Th width={210}>Take action by</Th>
              <Th width={150}>Pay date</Th>
              {showStatus && <Th width={140}>Status</Th>}
              {showChangedBy && <Th width={140}>Archived by</Th>}
              {showAction && <Th width={56} />}
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <Tr key={run.runId}>
                <Td>
                  <Checkbox
                    type="checkbox"
                    checked={selectedIds.has(run.runId)}
                    onChange={() => toggleOne(run.runId)}
                    aria-label={`Select ${run.displayName}`}
                  />
                </Td>
                <Td>
                  <PayRunLink>
                    <HStack gap="0.4rem">
                      <span>{run.displayName}</span>
                      {run.isPreviewPayrun && (
                        <Tip content="Entity not activated yet" placement={Tip.PLACEMENTS.TOP}>
                          <span>
                            <Icon
                              type={Icon.TYPES.WARNING_TRIANGLE_FILLED}
                              size={12}
                              color="#B27300"
                            />
                          </span>
                        </Tip>
                      )}
                    </HStack>
                  </PayRunLink>
                  {run.subTitle && <SubText>{run.subTitle}</SubText>}
                </Td>
                <Td>
                  <Atoms.Country countryCode={run.countryCode} size={Atoms.Country.SIZES.S} />
                </Td>
                <Td>
                  <Atoms.TitleCaption
                    title={run.entityDisplayName}
                    caption={run.entityIdentifier}
                  />
                </Td>
                <Td align="right">{run.numberOfEmployeesInvolved}</Td>
                <Td>
                  {run.takeActionBy ? (
                    <Atoms.TitleCaption
                      title={run.takeActionBy}
                      caption={run.takeActionByCaption}
                    />
                  ) : (
                    '—'
                  )}
                </Td>
                <Td>
                  <Atoms.TitleCaption title={run.payDate} caption={run.payDateCaption} />
                </Td>
                {showStatus && (
                  <Td>
                    <StatusPill tone={run.statusTone}>
                      <StatusDot tone={run.statusTone} />
                      {run.status}
                    </StatusPill>
                  </Td>
                )}
                {showChangedBy && <Td>{run.changedByDisplayName ?? '—'}</Td>}
                {showAction && (
                  <Td align="right">
                    <Button.Icon
                      icon={Icon.TYPES.MORE_HORIZONTAL}
                      aria-label="Run actions"
                      appearance={Button.APPEARANCES.GHOST}
                      size={Button.SIZES.S}
                    />
                  </Td>
                )}
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Surface>
  );
};

// ─── Page ──────────────────────────────────────────────────────────

const tabConfig: Record<
  Tab,
  {
    title: string;
    actionText: string;
    primaryActionLabel?: string;
    showChangedBy: boolean;
    emptyText: string;
    searchPlaceholder: string;
  }
> = {
  upcomingAndDraft: {
    title: 'Upcoming & Draft',
    actionText: 'Run payroll',
    primaryActionLabel: 'Run payroll',
    showChangedBy: false,
    emptyText: 'No upcoming or draft pay runs.',
    searchPlaceholder: 'Search pay runs',
  },
  failed: {
    title: 'Failed',
    actionText: 'Run payroll',
    primaryActionLabel: 'Run payroll',
    showChangedBy: false,
    emptyText: 'No failed pay runs. Nice.',
    searchPlaceholder: 'Search failed runs',
  },
  submitted: {
    title: 'Submitted',
    actionText: 'View payroll',
    showChangedBy: false,
    emptyText: 'Nothing currently submitted.',
    searchPlaceholder: 'Search submitted runs',
  },
  completed: {
    title: 'Completed',
    actionText: 'View payroll',
    showChangedBy: false,
    emptyText: 'No completed runs in the selected range.',
    searchPlaceholder: 'Search completed runs',
  },
  corrections: {
    title: 'Corrections',
    actionText: 'Review',
    showChangedBy: false,
    emptyText: 'No corrections to review.',
    searchPlaceholder: 'Search corrections',
  },
  archived: {
    title: 'Archived',
    actionText: 'View payroll',
    showChangedBy: true,
    emptyText: 'No archived runs.',
    searchPlaceholder: 'Search archived runs',
  },
};

const GlobalPayrollOverviewDemo: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showOnHoldBanner, setShowOnHoldBanner] = useState(true);
  const [showYearEndBanner, setShowYearEndBanner] = useState(true);

  const activeTab = TABS[activeTabIndex];
  const cfg = tabConfig[activeTab];
  const tabRuns = useMemo(() => runsForTab(activeTab, PAY_RUNS), [activeTab]);

  return (
    <AppShellLayout
      pageTitle="Run Payroll"
      pageTabs={TAB_LABELS}
      defaultActiveTab={0}
      onTabChange={setActiveTabIndex}
      defaultAdminMode
      companyName="Acme, Inc."
      userInitial="A"
      showNotificationBadge
      notificationCount={3}
    >
      <VStack gap={16}>
        {showOnHoldBanner && activeTab !== 'failed' && (
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

        <RunListGrid
          title={cfg.title}
          runs={tabRuns}
          showStatus
          showChangedBy={cfg.showChangedBy}
          showAction
          actionText={cfg.actionText}
          emptyText={cfg.emptyText}
          searchPlaceholder={cfg.searchPlaceholder}
          primaryActionLabel={cfg.primaryActionLabel}
        />
      </VStack>
    </AppShellLayout>
  );
};

export default GlobalPayrollOverviewDemo;
