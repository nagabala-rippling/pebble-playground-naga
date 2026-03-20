import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import { ENTITIES, getEntity } from '../data';
import EntityPickerPopover from '../shared/EntityPickerPopover';
import EntityChip from '../shared/EntityChip';
import { useScopeContext } from './ScopeContext';

const ScopeIndicator: React.FC = () => {
  const { theme } = useTheme();
  const {
    selectedEntityIds,
    setSelectedEntityIds,
    mode,
    allowMulti,
  } = useScopeContext();
  const [pickerOpen, setPickerOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  if (mode === 'hidden') return null;

  const isAllSelected = selectedEntityIds.length === ENTITIES.length;
  const firstEntity = selectedEntityIds.length === 1 ? getEntity(selectedEntityIds[0]) : null;

  const handleApply = (ids: string[]) => {
    setSelectedEntityIds(ids);
  };

  const handleRemoveChip = (id: string) => {
    const next = selectedEntityIds.filter(eid => eid !== id);
    if (next.length > 0) setSelectedEntityIds(next);
  };

  const renderScopeContent = () => {
    if (mode === 'configuration' && firstEntity) {
      return (
        <ScopeChips>
          <EntityChip flag={firstEntity.flag} name={firstEntity.name} />
        </ScopeChips>
      );
    }

    if (isAllSelected || selectedEntityIds.length === 0) {
      return (
        <ScopeChips>
          <Icon type={Icon.TYPES.GLOBE_OUTLINE} size={16} />
          <AllEntitiesText theme={theme}>All entities</AllEntitiesText>
        </ScopeChips>
      );
    }

    if (selectedEntityIds.length <= 3) {
      return (
        <ScopeChips>
          {selectedEntityIds.map(id => {
            const entity = getEntity(id);
            if (!entity) return null;
            return (
              <EntityChip
                key={id}
                flag={entity.flag}
                name={entity.name}
                onRemove={allowMulti ? () => handleRemoveChip(id) : undefined}
              />
            );
          })}
        </ScopeChips>
      );
    }

    return (
      <ScopeChips>
        {selectedEntityIds.slice(0, 2).map(id => {
          const entity = getEntity(id);
          if (!entity) return null;
          return (
            <EntityChip
              key={id}
              flag={entity.flag}
              name={entity.name}
              onRemove={() => handleRemoveChip(id)}
            />
          );
        })}
        <MoreCount theme={theme}>+{selectedEntityIds.length - 2}</MoreCount>
      </ScopeChips>
    );
  };

  return (
    <IndicatorWrapper>
      <IndicatorContainer ref={anchorRef} theme={theme} onClick={() => setPickerOpen(true)}>
        {renderScopeContent()}
        <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
      </IndicatorContainer>
      <PickerAnchor>
        <EntityPickerPopover
          selectedEntityIds={selectedEntityIds}
          onApply={handleApply}
          mode={allowMulti ? 'multi' : 'single'}
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          anchorRef={anchorRef}
          align="right"
        />
      </PickerAnchor>
    </IndicatorWrapper>
  );
};

const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
`;

const IndicatorContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  cursor: pointer;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
`;

const ScopeChips = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex-wrap: nowrap;
`;

const AllEntitiesText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const MoreCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
`;

const PickerAnchor = styled.div`
  position: relative;
`;

export default ScopeIndicator;
