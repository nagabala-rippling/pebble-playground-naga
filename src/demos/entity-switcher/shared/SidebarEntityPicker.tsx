import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Input from '@rippling/pebble/Inputs';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { ENTITIES, getEntitiesByCountry, getEntity } from '../data';
import { useScopeContext } from '../approach-c/ScopeContext';

interface SidebarEntityPickerProps {
  isCollapsed: boolean;
}

const SidebarEntityPicker: React.FC<SidebarEntityPickerProps> = ({ isCollapsed }) => {
  const { theme } = usePebbleTheme();
  const {
    selectedEntityIds,
    setSelectedEntityIds,
    mode,
    allowMulti,
    setConfigEntityId,
  } = useScopeContext();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<string[]>(selectedEntityIds);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 280 });

  const isConfiguration = mode === 'configuration';
  const isHidden = mode === 'hidden';
  const selectMode = allowMulti ? 'multi' : 'single';
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (isConfiguration) {
      setPulseKey(prev => prev + 1);
    }
  }, [isConfiguration]);

  const updateDropdownPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: isCollapsed ? 300 : rect.width,
    });
  }, [isCollapsed]);

  useEffect(() => {
    if (isOpen) {
      setDraft(selectedEntityIds);
      setSearch('');
      updateDropdownPos();
    }
  }, [isOpen, selectedEntityIds, updateDropdownPos]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
    if (selectMode === 'single') return;
    setDraft(prev => prev.length === ENTITIES.length ? [] : ENTITIES.map(e => e.id));
  };

  const handleToggle = (entityId: string) => {
    if (selectMode === 'single') {
      setDraft([entityId]);
      setSelectedEntityIds([entityId]);
      setConfigEntityId(entityId);
      setIsOpen(false);
      return;
    }
    setDraft(prev =>
      prev.includes(entityId) ? prev.filter(id => id !== entityId) : [...prev, entityId],
    );
  };

  const handleApply = () => {
    setSelectedEntityIds(draft);
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraft([]);
  };

  const isAllEntities = selectedEntityIds.length === ENTITIES.length || selectedEntityIds.length === 0;
  const firstEntity = selectedEntityIds.length === 1 ? getEntity(selectedEntityIds[0]) : null;

  const renderTriggerContent = () => {
    if (isAllEntities) {
      return (
        <>
          <TriggerIcon>
            <Icon type={Icon.TYPES.GLOBE_OUTLINE} size={18} color={(theme as StyledTheme).colorOnSurface} />
          </TriggerIcon>
          {!isCollapsed && <TriggerLabel theme={theme}>All entities</TriggerLabel>}
        </>
      );
    }

    if (firstEntity) {
      return (
        <>
          <FlagIcon>{firstEntity.flag}</FlagIcon>
          {!isCollapsed && <TriggerLabel theme={theme}>{firstEntity.name}</TriggerLabel>}
        </>
      );
    }

    const first = getEntity(selectedEntityIds[0]);
    return (
      <>
        {first && <FlagIcon>{first.flag}</FlagIcon>}
        {!isCollapsed && (
          <TriggerLabel theme={theme}>
            {selectedEntityIds.length} entities
          </TriggerLabel>
        )}
      </>
    );
  };

  if (isHidden) return null;

  return (
    <PickerContainer>
      <TriggerButton
        key={`trigger-${pulseKey}`}
        ref={triggerRef}
        theme={theme}
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        isConfiguration={isConfiguration}
        aria-label="Select entity"
        aria-expanded={isOpen}
      >
        {renderTriggerContent()}
        {!isCollapsed && (
          <ChevronWrapper isOpen={isOpen}>
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
          </ChevronWrapper>
        )}
      </TriggerButton>

      {isOpen && ReactDOM.createPortal(
        <DropdownContainer ref={dropdownRef} theme={theme} style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}>
          <SearchSection theme={theme}>
            <Input.Text
              value={search}
              onChange={(val: string) => setSearch(val)}
              placeholder="Search entities..."
              size={Input.Text.SIZES.S}
            />
          </SearchSection>

          <OptionsList theme={theme}>
            {selectMode === 'multi' && !search && (
              <OptionRow theme={theme} onClick={handleToggleAll}>
                <CheckboxWrap onClick={e => e.stopPropagation()}>
                  <Input.Checkbox
                    label=""
                    name="all-entities-sidebar"
                    value={isAllSelected}
                    isIndeterminate={draft.length > 0 && !isAllSelected}
                    onChange={handleToggleAll}
                  />
                </CheckboxWrap>
                <Icon type={Icon.TYPES.GLOBE_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurface} />
                <OptionLabel theme={theme}>All entities</OptionLabel>
              </OptionRow>
            )}

            {Object.entries(filteredGrouped).map(([country, entities]) => (
              <React.Fragment key={country}>
                <GroupHeader theme={theme}>{country}</GroupHeader>
                {entities.map(entity => {
                  const isSelected = draft.includes(entity.id);
                  return (
                    <OptionRow key={entity.id} theme={theme} onClick={() => handleToggle(entity.id)}>
                      {selectMode === 'multi' ? (
                        <CheckboxWrap onClick={e => e.stopPropagation()}>
                          <Input.Checkbox
                            label=""
                            name={`sidebar-${entity.id}`}
                            value={isSelected}
                            onChange={() => handleToggle(entity.id)}
                          />
                        </CheckboxWrap>
                      ) : (
                        <RadioDot theme={theme} selected={isSelected} />
                      )}
                      <FlagEmoji>{entity.flag}</FlagEmoji>
                      <OptionLabel theme={theme}>{entity.name}</OptionLabel>
                      {isSelected && selectMode === 'single' && (
                        <CheckIcon>
                          <Icon type={Icon.TYPES.CHECK} size={16} color={(theme as StyledTheme).colorPrimary} />
                        </CheckIcon>
                      )}
                    </OptionRow>
                  );
                })}
              </React.Fragment>
            ))}
          </OptionsList>

          {selectMode === 'multi' && (
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
        </DropdownContainer>,
        document.body,
      )}
    </PickerContainer>
  );
};

const borderPulse = keyframes`
  0% {
    border-color: rgba(122, 0, 93, 0.9);
    box-shadow: 0 0 0 3px rgba(122, 0, 93, 0.25);
  }
  100% {
    border-color: rgba(122, 0, 93, 0);
    box-shadow: 0 0 0 0 rgba(122, 0, 93, 0);
  }
`;

const PickerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const TriggerButton = styled.button<{
  isOpen: boolean;
  isCollapsed: boolean;
  isConfiguration: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme, isCollapsed }) =>
    isCollapsed
      ? (theme as StyledTheme).space200
      : `${(theme as StyledTheme).space200} ${(theme as StyledTheme).space300}`};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme, isOpen }) =>
    isOpen ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  transition: border-color 150ms ease, box-shadow 150ms ease;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};
  min-height: 40px;

  ${({ isConfiguration }) =>
    isConfiguration && `animation: ${borderPulse} 1.2s ease-out 1;`}

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
    outline-offset: 2px;
  }
`;

const TriggerIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FlagIcon = styled.span`
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
`;

const TriggerLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChevronWrapper = styled.span<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform 200ms ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const DropdownContainer = styled.div`
  position: fixed;
  z-index: 10000;
  min-width: 280px;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  max-height: 400px;
`;

const SearchSection = styled.div`
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
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space100} ${(theme as StyledTheme).space300}`};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
`;

const FlagEmoji = styled.span`
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
`;

const OptionLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  flex: 1;
`;

const CheckIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

export default SidebarEntityPicker;
