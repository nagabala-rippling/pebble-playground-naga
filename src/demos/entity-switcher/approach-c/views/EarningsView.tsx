import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import TableBasic from '@rippling/pebble/TableBasic';
import { EARNINGS, getEntity, filterByEntities } from '../../data';
import type { Earning } from '../../types';
import { useScopeContext } from '../ScopeContext';

function groupByEntity<T extends { entityId: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.entityId]) groups[item.entityId] = [];
    groups[item.entityId].push(item);
  }
  return groups;
}

const COLUMN_COUNT = 6;

const EarningsView: React.FC = () => {
  const { theme } = useTheme();
  const { selectedEntityIds } = useScopeContext();

  const filtered = useMemo(
    () => filterByEntities(EARNINGS, selectedEntityIds),
    [selectedEntityIds],
  );

  const grouped = useMemo(() => groupByEntity(filtered), [filtered]);

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Name</TableBasic.Th>
          <TableBasic.Th>Classification</TableBasic.Th>
          <TableBasic.Th>Recurring</TableBasic.Th>
          <TableBasic.Th>Supplemental</TableBasic.Th>
          <TableBasic.Th>Applicable to</TableBasic.Th>
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
              {rows.map((row: Earning) => (
                <TableBasic.Tr key={row.id}>
                  <TableBasic.Td>{row.name}</TableBasic.Td>
                  <TableBasic.Td>{row.classification}</TableBasic.Td>
                  <TableBasic.Td>{row.recurring ? 'Yes' : 'No'}</TableBasic.Td>
                  <TableBasic.Td>{row.supplemental ? 'Yes' : 'No'}</TableBasic.Td>
                  <TableBasic.Td>{row.applicableTo}</TableBasic.Td>
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

export default EarningsView;
