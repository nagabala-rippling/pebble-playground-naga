import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import Atoms from '@rippling/pebble/Atoms';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { HStack } from '@rippling/pebble/Layout/Stack';
import TextInput from '@rippling/pebble/Inputs/Text';
import { AppNavBarNewRouter } from '@rippling/pebble/AppNavBar';
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
import {
  GP_CHAIN,
  US_CHAIN,
  Variation,
  VARIATION_LABELS,
  VARIATION_ORDER,
  VARIATION_KIND,
} from './correction-on-correction/data';
import {
  VariationRenderer,
  V4SmartPill,
  V5InlineChainStrip,
  V6PromotedNotice,
  V7Workspace,
  V8SmartRouting,
} from './correction-on-correction/variations';
import Modal from '@rippling/pebble/Modal';

// ─── Status mapping (matches GPStatusRenderer's STATUS_TYPE_CLASS_IDENTIFIER_MAP) ─

const statusColorFor = (tone: RunStatusTone, theme: StyledTheme): string => {
  switch (tone) {
    case 'POSITIVE':
      return theme.colorSuccess ?? '#137333';
    case 'NEGATIVE':
      return theme.colorError ?? '#A50E0E';
    case 'WARNING':
      return theme.colorWarning ?? '#7A4F01';
    case 'NEUTRAL':
    default:
      // Production GP uses colorInfo (blue) for NEUTRAL → playground has colorPrimary
      return theme.colorPrimary ?? '#1A56A2';
  }
};

// ─── GridV2 surface (matches app/blocks/Grid/Grid.module.scss) ────

const GridSurface = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner3xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) =>
    (theme as StyledTheme).colorSurfaceContainerLowest ?? (theme as StyledTheme).colorSurface};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

// ─── GridHeader (matches GridHeader.styles.ts exactly) ────────────

const HeaderContainer = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: ${({ theme }) => (theme as StyledTheme).space300};
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  align-self: stretch;
  min-height: 56px; /* size800 */
`;

const HeaderTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex: 1 0 0;
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const HeaderTitleText = styled.h6`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 535;
`;

const RowCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  &::before {
    content: '·';
    margin-right: 6px;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  align-self: stretch;
`;

const HeaderBottom = styled.div`
  display: flex;
  align-items: flex-end;
  align-self: stretch;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SearchContainer = styled.div`
  width: 360px; /* size5600 */
`;

// ─── Filter dropdown row (matches GP RunFilters) ──────────────────

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  min-width: 200px;
`;

const FilterLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
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
  background-color: ${({ theme }) =>
    (theme as StyledTheme).colorSurfaceContainerLowest ?? (theme as StyledTheme).colorSurface};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

// ─── Group by + filter button row ─────────────────────────────────

const GroupByButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: 6px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

// ─── Table (matches GridV2 + CellV2 module.scss) ──────────────────

const TableScroll = styled.div`
  overflow-x: auto;
  overflow-y: visible;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1280px;
  border-collapse: collapse;
`;

const Th = styled.th<{ width?: number; align?: 'left' | 'right' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: ${({ align }) => align ?? 'left'};
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  font-weight: 535;
  white-space: nowrap;
  ${({ width }) => (width ? `min-width: ${width}px;` : '')}
`;

const Td = styled.td<{ align?: 'left' | 'right' }>`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  vertical-align: top;
  text-align: ${({ align }) => align ?? 'left'};
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover td {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const ColumnHeaderInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Pay run name + sub-text
const PayRunLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
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

// People count = underlined number link
const PeopleLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
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

// Status cell — Atoms.Circle + Text (matches GPStatusRenderer exactly)
const StatusInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StatusText = styled.span<{ tone: RunStatusTone }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ tone, theme }) => statusColorFor(tone, theme as StyledTheme)};
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

// ─── Status cell — exactly matches GPStatusCellRenderer ───────────

const StatusCell: React.FC<{ status: string; tone: RunStatusTone }> = ({ status, tone }) => {
  // Resolve the dot color from theme via a CSS var trick: read from the StatusText computed style.
  // Simpler: just compute it inline via theme accessor in styled component below.
  return (
    <StatusInner>
      <StatusDot tone={tone} />
      <StatusText tone={tone}>{status}</StatusText>
    </StatusInner>
  );
};

const StatusDot = styled.span<{ tone: RunStatusTone }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ tone, theme }) => statusColorFor(tone, theme as StyledTheme)};
`;

// ─── Run list grid ─────────────────────────────────────────────────

interface RunListGridProps {
  title: string;
  runs: PayRun[];
  showStatus: boolean;
  showChangedBy: boolean;
  primaryActionLabel?: string;
  isPrimaryDisabled?: boolean;
  showOffCycle?: boolean;
  searchPlaceholder: string;
  emptyText: string;
  payDateRangeLabel: string;
  onCreateCorrection?: (run: PayRun) => void;
  /** Custom renderer for the action cell. If provided, replaces the default Create Correction button. */
  renderRowAction?: (run: PayRun) => React.ReactNode;
}

const RunListGrid: React.FC<RunListGridProps> = ({
  title,
  runs,
  showStatus,
  showChangedBy,
  primaryActionLabel,
  isPrimaryDisabled,
  showOffCycle,
  searchPlaceholder,
  emptyText,
  payDateRangeLabel,
  onCreateCorrection,
  renderRowAction,
}) => {
  const hasRowAction = !!onCreateCorrection || !!renderRowAction;
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
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(r => r.runId)));
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
    <GridSurface>
      <HeaderContainer>
        {/* Top row: Title + Action Buttons */}
        <HeaderTop>
          <HeaderTitleWrap>
            <HeaderTitleRow>
              <HeaderTitleText>{title}</HeaderTitleText>
              <RowCount>{runs.length}</RowCount>
            </HeaderTitleRow>
          </HeaderTitleWrap>
          <HeaderButtons>
            {showOffCycle && (
              <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S}>
                Create an off-cycle run
              </Button>
            )}
            {primaryActionLabel && (
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.S}
                isDisabled={isPrimaryDisabled}
              >
                {primaryActionLabel}
              </Button>
            )}
            <Button.Icon
              icon={Icon.TYPES.TABLE_COLUMN_OUTLINE}
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.S}
              aria-label="Customize columns"
            />
            <Button.Icon
              icon={Icon.TYPES.EXPAND_PANEL_OUTLINE}
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.S}
              aria-label="Expand"
            />
          </HeaderButtons>
        </HeaderTop>

        {/* Bottom row 1: Search + Group by */}
        <HeaderBottom>
          <SearchContainer>
            <TextInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={v => setSearch(v ?? '')}
              prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} />}
              size={TextInput.SIZES.S}
              canClear
            />
          </SearchContainer>
          <GroupByButton style={{ marginLeft: 'auto' }}>
            <Icon type={Icon.TYPES.LIST_OUTLINE} size={14} />
            Group by
          </GroupByButton>
        </HeaderBottom>

        {/* Bottom row 2: Filter dropdowns */}
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
                  <ColumnHeaderInner>
                    Pay Run <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                <Th width={140}>
                  <ColumnHeaderInner>
                    Country <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                <Th width={200}>
                  <ColumnHeaderInner>
                    Entity <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                <Th width={80}>
                  <ColumnHeaderInner>
                    People <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                <Th width={210}>
                  <ColumnHeaderInner>
                    Take action by <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                <Th width={150}>
                  <ColumnHeaderInner>
                    Pay date <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                  </ColumnHeaderInner>
                </Th>
                {showStatus && (
                  <Th width={130}>
                    <ColumnHeaderInner>
                      Status <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                    </ColumnHeaderInner>
                  </Th>
                )}
                {showChangedBy && (
                  <Th width={140}>
                    <ColumnHeaderInner>
                      Archived by <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                    </ColumnHeaderInner>
                  </Th>
                )}
                {hasRowAction && <Th width={200}>Action</Th>}
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
                      <StatusCell status={run.status} tone={run.statusTone} />
                    </Td>
                  )}
                  {showChangedBy && <Td>{run.changedByDisplayName ?? '—'}</Td>}
                  {hasRowAction && (
                    <Td>
                      {renderRowAction ? (
                        renderRowAction(run)
                      ) : (
                        <Button
                          appearance={Button.APPEARANCES.OUTLINE}
                          size={Button.SIZES.S}
                          onClick={() => onCreateCorrection?.(run)}
                        >
                          Create Correction
                        </Button>
                      )}
                    </Td>
                  )}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      )}
    </GridSurface>
  );
};

// ─── Page ──────────────────────────────────────────────────────────

const tabConfig: Record<
  Tab,
  {
    primaryActionLabel?: string;
    isPrimaryDisabled?: boolean;
    showOffCycle?: boolean;
    showChangedBy: boolean;
    emptyText: string;
    searchPlaceholder: string;
    payDateRangeLabel: string;
  }
> = {
  upcomingAndDraft: {
    primaryActionLabel: 'Run Payroll',
    isPrimaryDisabled: true,
    showOffCycle: true,
    showChangedBy: false,
    emptyText: 'No upcoming or draft pay runs.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'All time',
  },
  failed: {
    primaryActionLabel: 'Run Payroll',
    isPrimaryDisabled: true,
    showOffCycle: true,
    showChangedBy: false,
    emptyText: 'No failed pay runs. Nice.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'All time',
  },
  submitted: {
    showOffCycle: true,
    showChangedBy: false,
    emptyText: 'Nothing currently submitted.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'Last 3 months',
  },
  completed: {
    primaryActionLabel: 'View Payroll',
    isPrimaryDisabled: true,
    showOffCycle: true,
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
    showOffCycle: false,
    showChangedBy: true,
    emptyText: 'No archived runs.',
    searchPlaceholder: 'Search for a pay run name',
    payDateRangeLabel: 'Last 3 months',
  },
};

const SUB_TAB_PATHS: Record<Tab, string> = {
  upcomingAndDraft: '?section=upcomingAndDraft',
  failed: '?section=failed',
  submitted: '?section=submitted',
  completed: '?section=completed',
  corrections: '?section=corrections',
  archived: '?section=archived',
};

const PAGE_PADDING = '24px 32px';

const Page = styled.div`
  padding: ${PAGE_PADDING};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-height: 100%;
`;

const VariationBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  border: 1px dashed ${({ theme }) => (theme as StyledTheme).colorOutline};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  flex-wrap: wrap;
`;

const VariationChip = styled.button<{ active: boolean }>`
  padding: 4px 10px;
  border: 1px solid
    ${({ active, theme }) =>
      active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ active, theme }) =>
    active
      ? ((theme as StyledTheme).colorPrimaryContainer ??
        (theme as StyledTheme).colorSurfaceContainerHigh)
      : (theme as StyledTheme).colorSurfaceContainerLowest};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  border-radius: 999px;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: ${({ active }) => (active ? 535 : 430)};
`;

const InlineToast = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const GlobalPayrollOverviewDemo: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get('section') as Tab | null;
  const activeTab: Tab =
    sectionParam && TAB_ORDER.includes(sectionParam) ? sectionParam : 'upcomingAndDraft';
  const cfg = tabConfig[activeTab];
  const tabRuns = useMemo(() => runsForTab(activeTab, PAY_RUNS), [activeTab]);

  // Variation state — read from URL ?variation=…
  const variationParam = searchParams.get('variation') as Variation | null;
  const variation: Variation =
    variationParam && VARIATION_ORDER.includes(variationParam) ? variationParam : 'v1';

  const variationKind = VARIATION_KIND[variation];

  // For overlay variations (v1-v3)
  const [openChainCountry, setOpenChainCountry] = useState<'GP' | 'US' | null>(null);
  // For workspace (v7)
  const [workspaceChainCountry, setWorkspaceChainCountry] = useState<'GP' | 'US' | null>(null);
  // For transient toast (v8)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setVariation = (v: Variation) => {
    const next = new URLSearchParams(searchParams);
    next.set('variation', v);
    setSearchParams(next);
    // Reset any open overlays / toasts when switching variations
    setOpenChainCountry(null);
    setWorkspaceChainCountry(null);
    setToastMessage(null);
  };

  const chainForRun = (run: PayRun) => (run.countryCode === 'US' ? US_CHAIN : GP_CHAIN);

  const handleCreateCorrection = (run: PayRun) => {
    const country = run.countryCode === 'US' ? 'US' : 'GP';
    const chain = chainForRun(run);
    const tip = chain.corrections[chain.corrections.length - 1];

    if (variation === 'v1' || variation === 'v2' || variation === 'v3') {
      setOpenChainCountry(country);
      return;
    }
    if (variation === 'v6') {
      // For v6, the notice is already rendered above the table; the row button just opens v1
      setOpenChainCountry(country);
      return;
    }
    if (variation === 'v7') {
      setWorkspaceChainCountry(country);
      return;
    }
    if (variation === 'v8') {
      const isGP = country === 'GP';
      setToastMessage(
        isGP
          ? `Routed to chain tip: ${tip.ordinal} pre-selected on ${run.entityDisplayName}`
          : `Started new correction on ${run.displayName} (US linear model)`,
      );
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    // v4 / v5 / composite — handled via custom row renderer / inline panel
  };

  const activeChain =
    openChainCountry === 'US' ? US_CHAIN : openChainCountry === 'GP' ? GP_CHAIN : null;
  const activeWorkspaceChain =
    workspaceChainCountry === 'US' ? US_CHAIN : workspaceChainCountry === 'GP' ? GP_CHAIN : null;

  // Row action renderer that depends on the active variation
  const renderRowActionForVariation = (run: PayRun): React.ReactNode => {
    const chain = chainForRun(run);
    if (variation === 'v4' || variation === 'composite') {
      return (
        <V4SmartPill
          chain={chain}
          onPrimary={() => handleCreateCorrection(run)}
          onSecondary={() => setToastMessage(`Opened correction list for ${run.entityDisplayName}`)}
        />
      );
    }
    return (
      <Button
        appearance={Button.APPEARANCES.OUTLINE}
        size={Button.SIZES.S}
        onClick={() => handleCreateCorrection(run)}
      >
        Create Correction
      </Button>
    );
  };

  // Sample chain for top-of-page surfaces (notice / strip / smart routing)
  const sampleChainForBanner = GP_CHAIN;

  const counts = useMemo(() => {
    const r: Partial<Record<Tab, number>> = {};
    for (const t of TAB_ORDER) r[t] = runsForTab(t, PAY_RUNS).length;
    return r;
  }, []);

  // AppNavBar links — primary tabs with nested sub-tabs under "Overview"
  const navLinks = useMemo(
    () => [
      {
        path: '/global-payroll-overview',
        title: 'Overview',
        links: TAB_ORDER.map(tab => ({
          title: TAB_LABELS[tab],
          path: SUB_TAB_PATHS[tab],
          ...(tab === 'upcomingAndDraft' && counts.upcomingAndDraft
            ? { badge: { text: String(counts.upcomingAndDraft) } }
            : {}),
        })),
      },
      { path: '/people', title: 'People' },
      { path: '/settings', title: 'Settings' },
      { path: '/entities', title: 'Entities' },
      { path: '/accounting', title: 'Accounting' },
      { path: '/balances', title: 'Balances' },
      { path: '/reports', title: 'Reports' },
      { path: '/earnings', title: 'Earnings' },
      { path: '/deductions', title: 'Deductions' },
      { path: '/garnishments', title: 'Garnishments' },
      { path: '/filings', title: 'Filings' },
    ],
    [counts.upcomingAndDraft],
  );

  // We need to set sub-tab via custom click handler since the sub-tab "paths" are query params, not real routes
  const handleNavInterception = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    // Sub-tab clicks: convert to query param updates
    for (const t of TAB_ORDER) {
      if (href.endsWith(SUB_TAB_PATHS[t])) {
        e.preventDefault();
        setSearchParams({ section: t });
        return;
      }
    }
    // Primary tab clicks (other than overview): prevent navigation in this prototype
    const allowed = ['/global-payroll-overview'];
    const matched = navLinks.find(n => href.endsWith(n.path) || href.includes(n.path));
    if (matched && !allowed.includes(matched.path)) {
      e.preventDefault();
    }
  };

  return (
    <AppShellLayout
      pageTitle=""
      defaultAdminMode
      companyName="Carter-Ruiz"
      userInitial="C"
      superAppName="Payroll"
      showNotificationBadge
      notificationCount={2}
    >
      <div onClickCapture={handleNavInterception}>
        <AppNavBarNewRouter
          title="Payroll"
          logoUrl="https://static-assets.ripplingcdn.com/global-payroll/global-payroll-logo.png"
          supportLink="https://help.rippling.com/s/article/13108698638"
          links={navLinks}
        >
          <Page>
            {activeTab === 'completed' && (
              <>
                <VariationBanner>
                  <span style={{ flexShrink: 0 }}>Correction-on-correction variation:</span>
                  {VARIATION_ORDER.map(v => (
                    <VariationChip key={v} active={variation === v} onClick={() => setVariation(v)}>
                      {VARIATION_LABELS[v]}
                    </VariationChip>
                  ))}
                </VariationBanner>

                {/* V6 / Composite: Notice banner above the table */}
                {(variation === 'v6' || variation === 'composite') && (
                  <div style={{ marginBottom: 16 }}>
                    <V6PromotedNotice
                      chain={sampleChainForBanner}
                      onPrimary={() => setOpenChainCountry('GP')}
                      onSecondary={() => setOpenChainCountry('GP')}
                    />
                  </div>
                )}

                {/* V5 / Composite: Inline chain strip above the table */}
                {(variation === 'v5' || variation === 'composite') && (
                  <div style={{ marginBottom: 16 }}>
                    <V5InlineChainStrip chain={sampleChainForBanner} defaultOpen={false} />
                  </div>
                )}

                {/* V8 transient toast */}
                {toastMessage && <InlineToast>✓ {toastMessage}</InlineToast>}
              </>
            )}

            <RunListGrid
              title={TAB_TITLES[activeTab]}
              runs={tabRuns}
              showStatus
              showChangedBy={cfg.showChangedBy}
              showOffCycle={cfg.showOffCycle}
              primaryActionLabel={cfg.primaryActionLabel}
              isPrimaryDisabled={cfg.isPrimaryDisabled}
              searchPlaceholder={cfg.searchPlaceholder}
              emptyText={cfg.emptyText}
              payDateRangeLabel={cfg.payDateRangeLabel}
              onCreateCorrection={activeTab === 'completed' ? handleCreateCorrection : undefined}
              renderRowAction={
                activeTab === 'completed' && (variation === 'v4' || variation === 'composite')
                  ? renderRowActionForVariation
                  : undefined
              }
            />

            {/* V8 standalone explanation panel when v8 active */}
            {activeTab === 'completed' && variation === 'v8' && (
              <div style={{ marginTop: 24 }}>
                <V8SmartRouting chain={sampleChainForBanner} />
              </div>
            )}
          </Page>
        </AppNavBarNewRouter>
      </div>

      {/* Overlay variations: V1, V2, V3 + V6 (clicking row btn still opens overlay) */}
      {activeChain && variationKind === 'overlay' && (
        <VariationRenderer
          variation={variation}
          isOpen={openChainCountry !== null}
          chain={activeChain}
          onClose={() => setOpenChainCountry(null)}
        />
      )}
      {activeChain && variation === 'v6' && (
        <VariationRenderer
          variation="v1"
          isOpen={openChainCountry !== null}
          chain={activeChain}
          onClose={() => setOpenChainCountry(null)}
        />
      )}

      {/* V7 workspace as a full-screen modal */}
      <Modal
        isVisible={activeWorkspaceChain !== null}
        onCancel={() => setWorkspaceChainCountry(null)}
        title="Create correction · Workspace"
        isFullScreen
      >
        {activeWorkspaceChain && (
          <div style={{ padding: 24, minHeight: '70vh' }}>
            <V7Workspace chain={activeWorkspaceChain} />
          </div>
        )}
      </Modal>
    </AppShellLayout>
  );
};

export default GlobalPayrollOverviewDemo;
