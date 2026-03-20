import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Input from '@rippling/pebble/Inputs';
import Button from '@rippling/pebble/Button';
import { ENTITIES, getEntitiesByCountry } from '../data';

interface EntityPickerPopoverProps {
  selectedEntityIds: string[];
  onApply: (entityIds: string[]) => void;
  mode?: 'multi' | 'single';
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  align?: 'left' | 'right';
}

const EntityPickerPopover: React.FC<EntityPickerPopoverProps> = ({
  selectedEntityIds,
  onApply,
  mode = 'multi',
  isOpen,
  onClose,
  anchorRef,
  align = 'left',
}) => {
  const { theme } = useTheme();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<string[]>(selectedEntityIds);

  useEffect(() => {
    if (isOpen) {
      setDraft(selectedEntityIds);
      setSearch('');
    }
  }, [isOpen, selectedEntityIds]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const grouped = useMemo(() => getEntitiesByCountry(), []);

  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, typeof ENTITIES> = {};
    for (const [country, entities] of Object.entries(grouped)) {
      const filtered = entities.filter(
        e => e.name.toLowerCase().includes(q) || e.country.toLowerCase().includes(q),
      );
      if (filtered.length > 0) result[country] = filtered;
    }
    return result;
  }, [grouped, search]);

  const isAllSelected = draft.length === ENTITIES.length;

  const handleToggleAll = () => {
    if (mode === 'single') return;
    setDraft(isAllSelected ? [] : ENTITIES.map(e => e.id));
  };

  const handleToggle = (entityId: string) => {
    if (mode === 'single') {
      setDraft([entityId]);
      onApply([entityId]);
      onClose();
      return;
    }
    setDraft(prev =>
      prev.includes(entityId) ? prev.filter(id => id !== entityId) : [...prev, entityId],
    );
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft([]);
  };

  if (!isOpen) return null;

  return (
    <PopoverContainer ref={popoverRef} theme={theme} align={align}>
      <SearchWrapper theme={theme}>
        <Input.Text
          value={search}
          onChange={(val: string) => setSearch(val)}
          placeholder="Search entities..."
          size={Input.Text.SIZES.S}
        />
      </SearchWrapper>

      <OptionsList theme={theme}>
        {mode === 'multi' && (
          <OptionRow theme={theme} onClick={handleToggleAll}>
            <Input.Checkbox
              label=""
              name="all-entities"
              value={isAllSelected}
              isIndeterminate={draft.length > 0 && !isAllSelected}
              onChange={handleToggleAll}
            />
            <OptionLabel theme={theme}>All entities</OptionLabel>
          </OptionRow>
        )}

        {Object.entries(filteredGrouped).map(([country, entities]) => (
          <React.Fragment key={country}>
            <GroupHeader theme={theme}>{country}</GroupHeader>
            {entities.map(entity => (
              <OptionRow key={entity.id} theme={theme} onClick={() => handleToggle(entity.id)}>
                {mode === 'multi' ? (
                  <Input.Checkbox
                    label=""
                    name={entity.id}
                    value={draft.includes(entity.id)}
                    onChange={() => handleToggle(entity.id)}
                  />
                ) : (
                  <RadioDot theme={theme} selected={draft.includes(entity.id)} />
                )}
                <span>{entity.flag}</span>
                <OptionLabel theme={theme}>{entity.name}</OptionLabel>
                <OptionCountry theme={theme}>{entity.country}</OptionCountry>
              </OptionRow>
            ))}
          </React.Fragment>
        ))}
      </OptionsList>

      {mode === 'multi' && (
        <FooterRow theme={theme}>
          <Button
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            size={Button.SIZES.S}
            onClick={handleApply}
          >
            Apply
          </Button>
        </FooterRow>
      )}
    </PopoverContainer>
  );
};

const PopoverContainer = styled.div<{ align: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + 4px);
  ${({ align }) => align === 'right' ? 'right: 0;' : 'left: 0;'}
  z-index: 1001;
  width: 340px;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  max-height: 420px;
`;

const SearchWrapper = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const OptionsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const GroupHeader = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space300};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const OptionLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const OptionCountry = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-left: auto;
`;

const RadioDot = styled.span<{ selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ theme, selected }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
    background: ${({ theme, selected }) =>
      selected ? (theme as StyledTheme).colorPrimary : 'transparent'};
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export default EntityPickerPopover;
