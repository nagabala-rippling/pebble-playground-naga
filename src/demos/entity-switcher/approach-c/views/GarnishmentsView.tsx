import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import TableBasic from '@rippling/pebble/TableBasic';
import { GARNISHMENTS, getEntity, filterByEntities } from '../../data';
import StatusBadge, { getVariantForStatus } from '../../shared/StatusBadge';
import type { Garnishment } from '../../types';
import { useScopeContext } from '../ScopeContext';

function groupByEntity<T extends { entityId: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.entityId]) groups[item.entityId] = [];
    groups[item.entityId].push(item);
  }
  return groups;
}

const COLUMN_COUNT = 8;

const GarnishmentsView: React.FC = () => {
  const { theme } = useTheme();
  const { selectedEntityIds } = useScopeContext();

  const filtered = useMemo(
    () => filterByEntities(GARNISHMENTS, selectedEntityIds),
    [selectedEntityIds],
  );

  const grouped = useMemo(() => groupByEntity(filtered), [filtered]);

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Employee</TableBasic.Th>
          <TableBasic.Th>Type</TableBasic.Th>
          <TableBasic.Th>Total amount</TableBasic.Th>
          <TableBasic.Th>Per period</TableBasic.Th>
          <TableBasic.Th>Garnishment type</TableBasic.Th>
          <TableBasic.Th>Status</TableBasic.Th>
          <TableBasic.Th>Entity</TableBasic.Th>
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {Object.entries(grouped).map(([entityId, rows]) => {
          const entity = getEntity(entityId);
          return (
            <React.Fragment key={entityId}>
              <TableBasic.Tr>
                <GroupHeaderCell theme={theme} colSpan={COLUMN_COUNT}>
                  {entity?.flag} {entity?.name}
                </GroupHeaderCell>
              </TableBasic.Tr>
              {rows.map((row: Garnishment) => (
                <TableBasic.Tr key={row.id}>
                  <TableBasic.Td>{row.employee}</TableBasic.Td>
                  <TableBasic.Td>{row.type}</TableBasic.Td>
                  <TableBasic.Td>{row.totalAmount}</TableBasic.Td>
                  <TableBasic.Td>{row.perPeriodAmount}</TableBasic.Td>
                  <TableBasic.Td>{row.garnishmentType}</TableBasic.Td>
                  <TableBasic.Td>
                    <StatusBadge variant={getVariantForStatus(row.status)}>{row.status}</StatusBadge>
                  </TableBasic.Td>
                  <TableBasic.Td>{entity?.name}</TableBasic.Td>
                </TableBasic.Tr>
              ))}
            </React.Fragment>
          );
        })}
      </TableBasic.TBody>
    </TableBasic>
  );
};

const GroupHeaderCell = styled(TableBasic.Td)`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
`;

export default GarnishmentsView;
