import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import TableBasic from '@rippling/pebble/TableBasic';
import Icon from '@rippling/pebble/Icon';
import { VStack } from '@rippling/pebble/Layout/Stack';
import Snackbar from '@rippling/pebble/SnackBar';
import {
  FILING_ACTIONS, TAX_SETTINGS, ENTITIES,
  getEntity, filterByEntities,
} from '../../data';
import StatusBadge, { getVariantForStatus } from '../../shared/StatusBadge';
import { useScopeContext } from '../ScopeContext';

type FilingsSubTab = 'action-required' | 'tax-settings';

const FilingsView: React.FC = () => {
  const { theme } = useTheme();
  const [subTab, setSubTab] = useState<FilingsSubTab>('action-required');
  const {
    selectedEntityIds,
    setSelectedEntityIds,
    setMode,
    setAllowMulti,
    previousScope,
    setPreviousScope,
    configEntityId,
    setConfigEntityId,
  } = useScopeContext();

  const prevSubTabRef = useRef<FilingsSubTab>(subTab);

  useEffect(() => {
    const wasConfig = prevSubTabRef.current === 'tax-settings';
    const isConfig = subTab === 'tax-settings';

    if (isConfig && !wasConfig) {
      setPreviousScope(selectedEntityIds);
      setAllowMulti(false);

      const allIds = ENTITIES.map(e => e.id);
      const remembered = configEntityId ? getEntity(configEntityId) : null;
      const isAll = selectedEntityIds.length === allIds.length;
      const autoEntity = remembered ?? (isAll ? ENTITIES[0] : getEntity(selectedEntityIds[0]));
      const entityName = autoEntity?.name ?? 'entity';
      const entityId = autoEntity?.id ?? allIds[0];

      setSelectedEntityIds([entityId]);
      setConfigEntityId(entityId);
      setMode('configuration');

      Snackbar.info(`Showing tax settings for ${entityName}. Switch entity in the sidebar.`);
    } else if (!isConfig && wasConfig) {
      setConfigEntityId(selectedEntityIds[0] ?? null);
      const allIds = ENTITIES.map(e => e.id);
      const restored = previousScope.length > 0 ? previousScope : allIds;
      setSelectedEntityIds(restored);
      setAllowMulti(true);
      setMode('operational');
    }

    prevSubTabRef.current = subTab;
  }, [subTab]);

  return (
    <VStack gap="0">
      <SubTabBar theme={theme}>
        <SubTabButton
          theme={theme}
          isActive={subTab === 'action-required'}
          onClick={() => setSubTab('action-required')}
        >
          Action required
        </SubTabButton>
        <SubTabButton
          theme={theme}
          isActive={subTab === 'tax-settings'}
          onClick={() => setSubTab('tax-settings')}
        >
          Tax settings
        </SubTabButton>
      </SubTabBar>

      {subTab === 'action-required' ? (
        <ActionRequiredPane />
      ) : (
        <TaxSettingsPane />
      )}
    </VStack>
  );
};

const ActionRequiredPane: React.FC = () => {
  const { theme } = useTheme();
  const { selectedEntityIds, setSelectedEntityIds } = useScopeContext();

  const filtered = useMemo(
    () => filterByEntities(FILING_ACTIONS, selectedEntityIds),
    [selectedEntityIds],
  );

  const countryCounts = useMemo(() => {
    const counts: Record<string, { flag: string; country: string; count: number; entityIds: string[] }> = {};
    for (const action of FILING_ACTIONS) {
      const entity = getEntity(action.entityId);
      if (!entity) continue;
      const cc = entity.countryCode;
      if (!counts[cc]) {
        counts[cc] = { flag: entity.flag, country: entity.country, count: 0, entityIds: [] };
      }
      counts[cc].count++;
      if (!counts[cc].entityIds.includes(action.entityId)) {
        counts[cc].entityIds.push(action.entityId);
      }
    }
    return Object.values(counts);
  }, []);

  const handleCountryClick = (entityIds: string[]) => {
    setSelectedEntityIds(entityIds);
  };

  return (
    <VStack gap="1rem">
      <SummaryBar theme={theme}>
        {countryCounts.map(cc => (
          <CountryChip
            key={cc.country}
            theme={theme}
            onClick={() => handleCountryClick(cc.entityIds)}
          >
            {cc.flag} {cc.count} {cc.count === 1 ? 'issue' : 'issues'}
          </CountryChip>
        ))}
      </SummaryBar>

      <TableBasic>
        <TableBasic.THead>
          <TableBasic.Tr>
            <TableBasic.Th>Issue</TableBasic.Th>
            <TableBasic.Th>Employee</TableBasic.Th>
            <TableBasic.Th>Entity</TableBasic.Th>
            <TableBasic.Th>Due date</TableBasic.Th>
            <TableBasic.Th>Severity</TableBasic.Th>
          </TableBasic.Tr>
        </TableBasic.THead>
        <TableBasic.TBody>
          {filtered.map(row => {
            const entity = getEntity(row.entityId);
            return (
              <TableBasic.Tr key={row.id}>
                <TableBasic.Td>{row.issue}</TableBasic.Td>
                <TableBasic.Td>{row.employee}</TableBasic.Td>
                <TableBasic.Td>{entity?.flag} {entity?.name}</TableBasic.Td>
                <TableBasic.Td>{row.dueDate}</TableBasic.Td>
                <TableBasic.Td>
                  <StatusBadge variant={getVariantForStatus(row.severity)}>{row.severity}</StatusBadge>
                </TableBasic.Td>
              </TableBasic.Tr>
            );
          })}
        </TableBasic.TBody>
      </TableBasic>
    </VStack>
  );
};

const TaxSettingsPane: React.FC = () => {
  const { theme } = useTheme();
  const { selectedEntityIds } = useScopeContext();

  const entityId = selectedEntityIds[0];
  const entity = entityId ? getEntity(entityId) : null;

  const taxSettings = useMemo(
    () => TAX_SETTINGS.filter(ts => ts.entityId === entityId),
    [entityId],
  );

  if (!entity) {
    return (
      <PromptWrapper theme={theme}>
        <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={32} />
        <PromptText theme={theme}>Select an entity in the sidebar</PromptText>
      </PromptWrapper>
    );
  }

  return (
    <VStack gap="1rem">
      <EntityHeading theme={theme}>{entity.flag} {entity.name}</EntityHeading>
      <TableBasic>
        <TableBasic.THead>
          <TableBasic.Tr>
            <TableBasic.Th>Category</TableBasic.Th>
            <TableBasic.Th>Status</TableBasic.Th>
          </TableBasic.Tr>
        </TableBasic.THead>
        <TableBasic.TBody>
          {taxSettings.map(ts => (
            <TableBasic.Tr key={ts.id}>
              <TableBasic.Td>{ts.category}</TableBasic.Td>
              <TableBasic.Td>
                <StatusBadge variant={getVariantForStatus(ts.status)}>{ts.status}</StatusBadge>
              </TableBasic.Td>
            </TableBasic.Tr>
          ))}
        </TableBasic.TBody>
      </TableBasic>
    </VStack>
  );
};

const SubTabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SubTabButton = styled.button<{ isActive: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space400};
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurfaceVariant};
  border-bottom: 2px solid ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorPrimary : 'transparent'};
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

const SummaryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const CountryChip = styled.button`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
  }
`;

const EntityHeading = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  height: 200px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PromptText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export default FilingsView;
