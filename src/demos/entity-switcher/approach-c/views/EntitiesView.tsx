import React, { useMemo } from 'react';
import TableBasic from '@rippling/pebble/TableBasic';
import { ENTITIES } from '../../data';
import { useScopeContext } from '../ScopeContext';

const EntitiesView: React.FC = () => {
  const { selectedEntityIds } = useScopeContext();

  const filtered = useMemo(() => {
    if (selectedEntityIds.length === 0 || selectedEntityIds.length === ENTITIES.length) {
      return ENTITIES;
    }
    return ENTITIES.filter(e => selectedEntityIds.includes(e.id));
  }, [selectedEntityIds]);

  return (
    <TableBasic>
      <TableBasic.THead>
        <TableBasic.Tr>
          <TableBasic.Th>Legal name</TableBasic.Th>
          <TableBasic.Th>Country</TableBasic.Th>
          <TableBasic.Th>Currency</TableBasic.Th>
        </TableBasic.Tr>
      </TableBasic.THead>
      <TableBasic.TBody>
        {filtered.map(entity => (
          <TableBasic.Tr key={entity.id}>
            <TableBasic.Td>{entity.name}</TableBasic.Td>
            <TableBasic.Td>{entity.flag} {entity.country}</TableBasic.Td>
            <TableBasic.Td>{entity.currency}</TableBasic.Td>
          </TableBasic.Tr>
        ))}
      </TableBasic.TBody>
    </TableBasic>
  );
};

export default EntitiesView;
