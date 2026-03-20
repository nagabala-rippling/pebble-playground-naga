import React, { useMemo } from 'react';
import TableBasic from '@rippling/pebble/TableBasic';
import { BALANCES, getEntity, filterByEntities } from '../../data';
import { useScopeContext } from '../ScopeContext';

const BalancesView: React.FC = () => {
  const { selectedEntityIds } = useScopeContext();
  const rows = useMemo(
    () => filterByEntities(BALANCES, selectedEntityIds),
    [selectedEntityIds],
  );

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Employee</TableBasic.Th>
          <TableBasic.Th>Role</TableBasic.Th>
          <TableBasic.Th>Type</TableBasic.Th>
          <TableBasic.Th>Amount</TableBasic.Th>
          <TableBasic.Th>Entity</TableBasic.Th>
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {rows.map(row => {
          const entity = getEntity(row.entityId);
          return (
            <TableBasic.Tr key={row.id}>
              <TableBasic.Td>{row.employee}</TableBasic.Td>
              <TableBasic.Td>{row.role}</TableBasic.Td>
              <TableBasic.Td>{row.type}</TableBasic.Td>
              <TableBasic.Td>{row.amount}</TableBasic.Td>
              <TableBasic.Td>{entity?.flag} {entity?.name}</TableBasic.Td>
            </TableBasic.Tr>
          );
        })}
      </TableBasic.TBody>
    </TableBasic>
  );
};

export default BalancesView;
