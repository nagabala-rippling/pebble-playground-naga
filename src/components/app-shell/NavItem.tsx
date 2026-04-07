import React from 'react';
import styled from '@emotion/styled';
import { getStateColor } from '@rippling/pebble/theme';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { NavItemData } from './types';

interface NavItemProps {
  item: NavItemData;
  isCollapsed: boolean;
  theme: StyledTheme;
}

export const StyledNavItem = styled.button<{ isActive?: boolean; isCollapsed?: boolean }>`
  width: 100%;
  height: ${({ theme }) => (theme as StyledTheme).space1000};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding: ${({ theme, isCollapsed }) =>
    isCollapsed ? '0' : `0 ${(theme as StyledTheme).space200} 0 0`};
  background: ${({ theme, isActive }) =>
    isActive ? getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover') : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  font-weight: ${({ isActive }) => (isActive ? 600 : undefined)};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: pointer;
  transition: all 0.1s ease-in-out 0s;
  overflow: hidden;

  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }

  &:active {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'active')};
  }
`;

export const NavItemIcon = styled.div`
  width: ${({ theme }) => (theme as StyledTheme).space1000};
  height: ${({ theme }) => (theme as StyledTheme).space1000};
  box-sizing: border-box;
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const NavItemText = styled.div<{ isCollapsed: boolean }>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 200ms ease;
`;

/**
 * Build a map from each _OUTLINE glyph value to its _FILLED counterpart,
 * and similarly for _OUTLINED → _FILLED.
 * Icon.TYPES values are unicode glyph strings, not the constant names themselves.
 */
const outlineToFilledMap: Record<string, string> = {};

const types = Icon.TYPES as Record<string, string>;
const entries = Object.entries(types);

for (const [name, glyph] of entries) {
  if (name.endsWith('_OUTLINE')) {
    const filledName = name.replace('_OUTLINE', '_FILLED');
    if (types[filledName]) {
      outlineToFilledMap[glyph] = types[filledName];
    }
  } else if (name.endsWith('_OUTLINED')) {
    const filledName = name.replace('_OUTLINED', '_FILLED');
    if (types[filledName]) {
      outlineToFilledMap[glyph] = types[filledName];
    }
  }
}

function getActiveIcon(iconGlyph: string): string {
  return outlineToFilledMap[iconGlyph] ?? iconGlyph;
}

export const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, theme }) => {
  const resolvedIcon = item.isActive ? getActiveIcon(item.icon) : item.icon;

  return (
    <StyledNavItem
      theme={theme}
      isActive={item.isActive}
      isCollapsed={isCollapsed}
      onClick={item.onClick}
    >
      <NavItemIcon theme={theme}>
        <Icon type={resolvedIcon} size={20} color={theme.colorOnSurface} />
      </NavItemIcon>
      <NavItemText theme={theme} isCollapsed={isCollapsed}>
        {item.label}
      </NavItemText>
      {item.hasSubmenu && !isCollapsed && (
        <div style={{ marginLeft: 'auto' }}>
          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurface} />
        </div>
      )}
    </StyledNavItem>
  );
};
