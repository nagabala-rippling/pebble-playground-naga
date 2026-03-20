import React, { useMemo } from 'react';
import TableBasic from '@rippling/pebble/TableBasic';
import { PAY_RUNS, getEntity, filterByEntities } from '../../data';
import StatusBadge, { getVariantForStatus } from '../../shared/StatusBadge';
import { useScopeContext } from '../ScopeContext';

const OverviewView: React.FC = () => {
  const { selectedEntityIds } = useScopeContext();
  const rows = useMemo(
    () => filterByEntities(PAY_RUNS, selectedEntityIds),
    [selectedEntityIds],
  );

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Pay run</TableBasic.Th>
          <TableBasic.Th>Country</TableBasic.Th>
          <TableBasic.Th>Entity</TableBasic.Th>
          <TableBasic.Th>People</TableBasic.Th>
          <TableBasic.Th>Action by</TableBasic.Th>
          <TableBasic.Th>Pay date</TableBasic.Th>
          <TableBasic.Th>Status</TableBasic.Th>
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {rows.map(row => {
          const entity = getEntity(row.entityId);
          return (
            <TableBasic.Tr key={row.id}>
              <TableBasic.Td>{row.name}</TableBasic.Td>
              <TableBasic.Td>{entity?.flag} {entity?.country}</TableBasic.Td>
              <TableBasic.Td>{entity?.name}</TableBasic.Td>
              <TableBasic.Td>{row.people}</TableBasic.Td>
              <TableBasic.Td>{row.actionBy}</TableBasic.Td>
              <TableBasic.Td>{row.payDate}</TableBasic.Td>
              <TableBasic.Td>
                <StatusBadge variant={getVariantForStatus(row.status)}>{row.status}</StatusBadge>
              </TableBasic.Td>
            </TableBasic.Tr>
          );
        })}
      </TableBasic.TBody>
    </TableBasic>
  );
};

export default OverviewView;
