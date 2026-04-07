import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Input from '@rippling/pebble/Inputs';
import { NavSection } from './NavSection';
import { StyledNavItem, NavItemIcon, NavItemText } from './NavItem';
import { NavSectionData, SuperAppNavConfig } from './types';

interface SidebarProps {
  mainSections: NavSectionData[];
  platformSection?: NavSectionData;
  isPinned: boolean;
  onTogglePin: () => void;
  isHome?: boolean;
  activeNavItemId?: string | null;
  onSuperAppChange?: (appName: string) => void;
  onNavItemClick?: (itemId: string) => void;
  countrySelector?: SuperAppNavConfig['countrySelector'];
  theme: StyledTheme;
}

const StyledSidebar = styled.aside<{ isCollapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 0;
  box-sizing: border-box;
  width: ${({ isCollapsed }) => (isCollapsed ? '56px' : '266px')};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 50;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  transition: width 200ms ease;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavDivider = styled.div`
  height: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space50};
  width: 100%;
  flex-shrink: 0;
`;

const NavDividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const PlatformFooter = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space250} ${(theme as StyledTheme).space200} ${(theme as StyledTheme).space200}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space50};
`;

const NavSectionsWrapper = styled.div`
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space250} ${(theme as StyledTheme).space200} 0`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space50};
`;

const BottomSection = styled.div`
  margin-top: auto;
`;

const CountrySelectorWrapper = styled.div<{ isCollapsed?: boolean }>`
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space250} ${(theme as StyledTheme).space200} 0`};
  ${({ isCollapsed }) => isCollapsed && 'pointer-events: none;'}

  [data-testid='select-controller'] {
    padding: 0 ${({ theme }) => (theme as StyledTheme).space175};
    overflow: hidden;

    & > div:first-child {
      min-width: ${({ theme }) => (theme as StyledTheme).space600};
    }
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  mainSections,
  platformSection,
  isPinned,
  onTogglePin,
  isHome = true,
  activeNavItemId,
  onSuperAppChange,
  onNavItemClick,
  countrySelector,
  theme,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countrySelector?.defaultValue ?? '');

  const isCollapsed = !isPinned && !isHovered;

  useEffect(() => {
    if (countrySelector?.defaultValue) {
      setSelectedCountry(countrySelector.defaultValue);
    }
  }, [countrySelector?.defaultValue]);

  const enrichSections = useCallback(
    (sections: NavSectionData[]): NavSectionData[] =>
      sections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          isActive: activeNavItemId != null ? item.id === activeNavItemId : item.isActive,
          onClick: () => {
            if (item.hasSubmenu && item.navigable && onSuperAppChange) {
              onSuperAppChange(item.label);
            } else if (!isHome && onNavItemClick) {
              onNavItemClick(item.id);
            }
            item.onClick?.();
          },
        })),
      })),
    [activeNavItemId, isHome, onSuperAppChange, onNavItemClick],
  );

  const enrichedMainSections = useMemo(
    () => enrichSections(mainSections),
    [enrichSections, mainSections],
  );
  const enrichedPlatformSection = useMemo(
    () => (platformSection ? enrichSections([platformSection])[0] : undefined),
    [enrichSections, platformSection],
  );

  const countrySelectList = useMemo(
    () =>
      countrySelector?.options.map(o => ({
        label: o.label,
        value: o.flagCode ?? o.value.toUpperCase(),
        flag: o.flagCode ?? o.value.toUpperCase(),
      })) ?? [],
    [countrySelector],
  );

  return (
    <StyledSidebar
      theme={theme}
      isCollapsed={isCollapsed}
      onMouseEnter={() => {
        if (!isPinned) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isPinned) setIsHovered(false);
      }}
    >
      <div>
        {countrySelector && (
          <CountrySelectorWrapper theme={theme} isCollapsed={isCollapsed}>
            <Input.Select
              key={isCollapsed ? 'collapsed' : 'expanded'}
              name="country-selector"
              isPositionFixed
              onChange={(value: unknown) => setSelectedCountry(String(value).toLowerCase())}
              value={selectedCountry.toUpperCase()}
              list={countrySelectList}
            />
          </CountrySelectorWrapper>
        )}

        {enrichedMainSections.map((section, index) => (
          <React.Fragment key={`main-section-${index}`}>
            <NavSection section={section} isCollapsed={isCollapsed} theme={theme} />
            {index === 0 && !section.label && enrichedMainSections.length > 1 && (
              <NavSectionsWrapper theme={theme}>
                <NavDivider theme={theme}>
                  <NavDividerLine theme={theme} />
                </NavDivider>
              </NavSectionsWrapper>
            )}
          </React.Fragment>
        ))}
      </div>

      <BottomSection>
        {enrichedPlatformSection && (
          <NavSection section={enrichedPlatformSection} isCollapsed={isCollapsed} theme={theme} />
        )}

        <PlatformFooter theme={theme}>
          <NavDivider theme={theme}>
            <NavDividerLine theme={theme} />
          </NavDivider>
          <StyledNavItem
            theme={theme}
            isCollapsed={isCollapsed}
            onClick={onTogglePin}
          >
            <NavItemIcon theme={theme}>
              <Icon
                type={isPinned ? Icon.TYPES.THUMBTACK_FILLED : Icon.TYPES.THUMBTACK_OUTLINE}
                size={20}
                color={theme.colorOnSurface}
              />
            </NavItemIcon>
            <NavItemText theme={theme} isCollapsed={isCollapsed}>
              {isPinned ? 'Collapse panel' : 'Pin panel open'}
            </NavItemText>
          </StyledNavItem>
        </PlatformFooter>
      </BottomSection>
    </StyledSidebar>
  );
};
