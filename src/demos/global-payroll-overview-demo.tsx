import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Atoms from '@rippling/pebble/Atoms';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';
import TextInput from '@rippling/pebble/Inputs/Text';
import { StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import {
  PAY_RUNS,
  PayRun,
  RunStatusTone,
  Tab,
  TAB_LABELS,
  TAB_ORDER,
  TAB_TITLES,
  runsForTab,
} from './global-payroll-overview/data';

// ─── Sub-tab strip with vertical separators ────────────────────────

const SubTabStrip = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SubTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 14px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorSurfaceContainerHigh : 'transparent'};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  font-weight: ${({ active }) => (active ? '535' : '430')};
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: ${({ active, theme }) =>
      active
        ? (theme as StyledTheme).colorSurfaceContainerHigh
        : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const TabSeparator = styled.span`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0 4px;
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  color: white;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 535;
  font-size: 11px;
`;

// ─── Surface card ──────────────────────────────────────────────────

const Surface = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

// ─── Grid header — 3 rows ─────────────────────────────────────────

const HeaderContainer = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 535;
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const TitleCount = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 430;
  &::before {
    content: '·';
    margin: 0 6px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  cursor: pointer;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

// Search row
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchWrapper = styled.div`
  width: 320px;
  & > div {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const GroupByButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-left: auto;
  padding: 6px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

// Filter row
const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
`;

const FilterLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const FilterDropdown = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 6px 12px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

// ─── Table ─────────────────────────────────────────────────────────

const TableScroll = styled.div`
  overflow-x: auto;
  overflow-y: visible;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const Table = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
`;

const Th = styled.th<{ width?: number; align?: 'left' | 'right' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: ${({ align }) => align ?? 'left'};
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  font-weight: 535;
  white-space: nowrap;
  ${({ width }) => (width ? `min-width: ${width}px;` : '')}
`;

const Td = styled.td<{ align?: 'left' | 'right' }>`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  vertical-align: top;
  text-align: ${({ align }) => align ?? 'left'};
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

const ColumnHeader = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Pay run cell — title (link) + subtitle
const PayRunLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  text-decoration: none;
  cursor: pointer;
  font-weight: 535;
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;

const PayRunSub = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

// People count — clickable underlined link
const PeopleLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-decoration: underline;
  cursor: pointer;
`;

// Take action by — date + red overdue caption
const TakeActionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OverdueCaption = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorError ?? '#A50E0E'};
`;

// Status — dot + colored text (NOT a pill)
const StatusContent = styled.span<{ tone: RunStatusTone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  ${({ tone, theme }) => {
    const t = theme as StyledTheme;
    switch (tone) {
      case 'POSITIVE':
        return `color: ${t.colorSuccess ?? '#137333'};`;
      case 'NEGATIVE':
        return `color: ${t.colorError ?? '#A50E0E'};`;
      case 'WARNING':
        return `color: ${t.colorWarning ?? '#7A4F01'};`;
      case 'NEUTRAL':
      default:
        return `color: ${t.colorPrimary ?? '#1A56A2'};`;
    }
  }}
`;

const StatusDot = styled.span<{ tone: RunStatusTone }>`
  width: 8px;
  height: 8px;
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
        return `background-color: ${t.colorPrimary ?? '#1A56A2'};`;
    }
  }}
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const EmptyBox = styled.div`
  padding: 64px 16px;
  text-align: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
`;

// ─── Country cell — flag + name ───────────────────────────────────

const CountryCell: React.FC<{ countryCode: string; countryName: string }> = ({
  countryCode,
  countryName,
}) => (
  <HStack gap="0.5rem">
    <Atoms.Country countryCode={countryCode} size={Atoms.Country.SIZES.S} onlyFlag />
    <span>{countryName}</span>
  </HStack>
);

// ─── Run list grid ─────────────────────────────────────────────────

interface RunListGridProps {
  title: string;
  runs: PayRun[];
  showStatus: boolean;
  showChangedBy: boolean;
  showAction: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  isPrimaryDisabled?: boolean;
  searchPlaceholder: string;
  emptyText: string;
  payDateRangeLabel: string;
}

const RunListGrid: React.FC<RunListGridProps> = ({
  title,
  runs,
  showStatus,
  showChangedBy,
  showAction,
  primaryActionLabel,
  onPrimaryAction,
  isPrimaryDisabled,
  searchPlaceholder,
  emptyText,
  payDateRangeLabel,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return runs;
    return runs.filter(
      r =>
        r.displayName.toLowerCase().includes(s) ||
        r.entityDisplayName.toLowerCase().includes(s) ||
        r.countryName.toLowerCase().includes(s),
    );
  }, [runs, search]);

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(r => r.runId)));
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
        {/* Row 1: Title + actions */}
        <HeaderTopRow>
          <HeaderTitle>
            {title}
            <TitleCount>{runs.length}</TitleCount>
          </HeaderTitle>
          <HeaderActions>
            {showAction && (
              <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S}>
                Create an off-cycle run
              </Button>
            )}
            {primaryActionLabel && (
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.S}
                onClick={onPrimaryAction}
                isDisabled={isPrimaryDisabled}
              >
                {primaryActionLabel}
              </Button>
            )}
            <IconButton aria-label="Customize columns">
              <Icon type={Icon.TYPES.TABLE_COLUMN_OUTLINE} size={16} />
            </IconButton>
            <IconButton aria-label="Expand">
              <Icon type={Icon.TYPES.EXPAND_PANEL_OUTLINE} size={16} />
            </IconButton>
          </HeaderActions>
        </HeaderTopRow>

        {/* Row 2: Search + Group by */}
        <SearchRow>
          <SearchWrapper>
            <TextInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={v => setSearch(v ?? '')}
              prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} />}
              size={TextInput.SIZES.S}
              canClear
            />
          </SearchWrapper>
          <GroupByButton>
            <Icon type={Icon.TYPES.LIST_OUTLINE} size={14} />
            Group by
          </GroupByButton>
        </SearchRow>

        {/* Row 3: Named filter dropdowns */}
        <FiltersRow>
          <FilterField>
            <FilterLabel>Entity</FilterLabel>
            <FilterDropdown>
              <span>All entities</span>
              <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
            </FilterDropdown>
          </FilterField>
          <FilterField>
            <FilterLabel>Pay run type</FilterLabel>
            <FilterDropdown>
              <span>All types</span>
              <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
            </FilterDropdown>
          </FilterField>
          <FilterField>
            <FilterLabel>Pay date range</FilterLabel>
            <FilterDropdown>
              <span>{payDateRangeLabel}</span>
              <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
            </FilterDropdown>
          </FilterField>
        </FiltersRow>
      </HeaderContainer>

      {filtered.length === 0 ? (
        <EmptyBox>{emptyText}</EmptyBox>
      ) : (
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th width={40}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    aria-label="Select all runs"
                  />
                </Th>
                <Th width={220}>
                  <ColumnHeader>
                    Pay Run
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                <Th width={140}>
                  <ColumnHeader>
                    Country
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                <Th width={200}>
                  <ColumnHeader>
                    Entity
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                <Th width={80}>
                  <ColumnHeader>
                    People
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                <Th width={210}>
                  <ColumnHeader>
                    Take action by
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                <Th width={150}>
                  <ColumnHeader>
                    Pay date
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeader>
                </Th>
                {showStatus && (
                  <Th width={130}>
                    <ColumnHeader>
                      Status
                      <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                    </ColumnHeader>
                  </Th>
                )}
                {showChangedBy && (
                  <Th width={140}>
                    <ColumnHeader>
                      Archived by
                      <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                    </ColumnHeader>
                  </Th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map(run => (
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
                    <PayRunLink>{run.displayName}</PayRunLink>
                    {run.subTitle && <PayRunSub>{run.subTitle}</PayRunSub>}
                  </Td>
                  <Td>
                    <CountryCell countryCode={run.countryCode} countryName={run.countryName} />
                  </Td>
                  <Td>
                    {run.entityIdentifier ? (
                      <Atoms.TitleCaption
                        title={run.entityDisplayName}
                        caption={run.entityIdentifier}
                      />
                    ) : (
                      <span>{run.entityDisplayName}</span>
                    )}
                  </Td>
                  <Td>
                    <PeopleLink>{run.numberOfEmployeesInvolved}</PeopleLink>
                  </Td>
                  <Td>
                    {run.takeActionBy ? (
                      <TakeActionContent>
                        <span>{run.takeActionBy}</span>
                        {run.overdueCaption && (
                          <OverdueCaption>{run.overdueCaption}</OverdueCaption>
                        )}
                      </TakeActionContent>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td>{run.payDate}</Td>
                  {showStatus && (
                    <Td>
                      <StatusContent tone={run.statusTone}>
                        <StatusDot tone={run.statusTone} />
                        {run.status}
                      </StatusContent>
                    </Td>
                  )}
                  {showChangedBy && <Td>{run.changedByDisplayName ?? '—'}</Td>}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      )}
    </Surface>
  );
};

// ─── Page ──────────────────────────────────────────────────────────

const PRIMARY_TABS = [
  'Overview',
  'People',
  'Settings',
  'Entities',
  'Accounting',
  'Balances',
  'Reports',
  'Earnings',
  'Deductions',
  'Garnishments',
  'Filings',
];

const tabConfig: Record<
  Tab,
  {
    primaryActionLabel?: string;
    isPrimaryDisabled?: boolean;
    showChangedBy: boolean;
    emptyText: string;
    searchPlaceholder: string;
    payDateRangeLabel: string;
  }
> = {
  upcomingAndDraft: {
    primaryActionLabel: 'Run Payroll',
    isPrimaryDisabled: true,
    showChangedBy: false,
    emptyText: 'No upcoming or draft pay runs.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'All time',
  },
  failed: {
    primaryActionLabel: 'Run Payroll',
    isPrimaryDisabled: true,
    showChangedBy: false,
    emptyText: 'No failed pay runs. Nice.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'All time',
  },
  submitted: {
    showChangedBy: false,
    emptyText: 'Nothing currently submitted.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'Last 3 months',
  },
  completed: {
    primaryActionLabel: 'View Payroll',
    isPrimaryDisabled: true,
    showChangedBy: false,
    emptyText: 'No completed runs in the selected range.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'Last 3 months',
  },
  corrections: {
    primaryActionLabel: 'Create a correction',
    showChangedBy: false,
    emptyText: 'No corrections to review.',
    searchPlaceholder: 'Search corrections',
    payDateRangeLabel: 'Last 3 months',
  },
  archived: {
    showChangedBy: true,
    emptyText: 'No archived runs.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'Last 3 months',
  },
};

const GlobalPayrollOverviewDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('upcomingAndDraft');
  const cfg = tabConfig[activeTab];
  const tabRuns = useMemo(() => runsForTab(activeTab, PAY_RUNS), [activeTab]);

  // Counts per tab for badges
  const counts = useMemo(() => {
    const result: Partial<Record<Tab, number>> = {};
    for (const tab of TAB_ORDER) {
      result[tab] = runsForTab(tab, PAY_RUNS).length;
    }
    return result;
  }, []);

  // Page header actions: "Help docs" link
  const pageActions = (
    <a
      href="#"
      style={{
        color: 'var(--color-on-surface-variant, #5F6368)',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      Help docs
      <Icon type={Icon.TYPES.ARROW_UP_RIGHT_BOX} size={12} />
    </a>
  );

  return (
    <AppShellLayout
      pageTitle="Payroll"
      pageTabs={PRIMARY_TABS}
      defaultActiveTab={0}
      pageActions={pageActions}
      defaultAdminMode
      companyName="Carter-Ruiz"
      userInitial="C"
      showNotificationBadge
      notificationCount={2}
    >
      <VStack gap={0}>
        {/* Sub-tab strip with vertical separators */}
        <SubTabStrip>
          {TAB_ORDER.map((tab, i) => (
            <React.Fragment key={tab}>
              {i > 0 && <TabSeparator />}
              <SubTab active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {TAB_LABELS[tab]}
                {tab === 'upcomingAndDraft' && counts.upcomingAndDraft ? (
                  <CountBadge>{counts.upcomingAndDraft}</CountBadge>
                ) : null}
              </SubTab>
            </React.Fragment>
          ))}
        </SubTabStrip>

        <RunListGrid
          title={TAB_TITLES[activeTab]}
          runs={tabRuns}
          showStatus
          showChangedBy={cfg.showChangedBy}
          showAction={!cfg.showChangedBy && activeTab !== 'corrections'}
          primaryActionLabel={cfg.primaryActionLabel}
          isPrimaryDisabled={cfg.isPrimaryDisabled}
          searchPlaceholder={cfg.searchPlaceholder}
          emptyText={cfg.emptyText}
          payDateRangeLabel={cfg.payDateRangeLabel}
        />
      </VStack>
    </AppShellLayout>
  );
};

export default GlobalPayrollOverviewDemo;
