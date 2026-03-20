import React, { useMemo } from 'react';
import TableBasic from '@rippling/pebble/TableBasic';
import { PEOPLE, getEntity, filterByEntities } from '../../data';
import { useScopeContext } from '../ScopeContext';

const PeopleView: React.FC = () => {
  const { selectedEntityIds } = useScopeContext();
  const rows = useMemo(
    () => filterByEntities(PEOPLE, selectedEntityIds),
    [selectedEntityIds],
  );

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Employee</TableBasic.Th>
          <TableBasic.Th>Employment type</TableBasic.Th>
          <TableBasic.Th>Country</TableBasic.Th>
          <TableBasic.Th>Entity</TableBasic.Th>
          <TableBasic.Th>Currency</TableBasic.Th>
          <TableBasic.Th>Pay schedule</TableBasic.Th>
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {rows.map(row => {
          const entity = getEntity(row.entityId);
          return (
            <TableBasic.Tr key={row.id}>
              <TableBasic.Td>{row.name}</TableBasic.Td>
              <TableBasic.Td>{row.employmentType}</TableBasic.Td>
              <TableBasic.Td>{entity?.flag} {entity?.country}</TableBasic.Td>
              <TableBasic.Td>{entity?.name}</TableBasic.Td>
              <TableBasic.Td>{row.currency}</TableBasic.Td>
              <TableBasic.Td>{row.paySchedule}</TableBasic.Td>
            </TableBasic.Tr>
          );
        })}
      </TableBasic.TBody>
    </TableBasic>
  );
};

export default PeopleView;
