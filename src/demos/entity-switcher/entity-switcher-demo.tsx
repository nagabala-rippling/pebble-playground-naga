import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import Page from '@rippling/pebble/Page';
import Tabs from '@rippling/pebble/Tabs';
import Snackbar from '@rippling/pebble/SnackBar';
import { TopNavBar } from '@/components/app-shell/TopNavBar';
import { NavSectionData } from '@/components/app-shell/types';
import { ENTITIES, VIEW_MODES, getEntity } from './data';
import { ScopeContextProvider, useScopeContext } from './approach-c/ScopeContext';
import SidebarEntityPicker from './shared/SidebarEntityPicker';
import OverviewView from './approach-c/views/OverviewView';
import PeopleView from './approach-c/views/PeopleView';
import SettingsView from './approach-c/views/SettingsView';
import EntitiesView from './approach-c/views/EntitiesView';
import BalancesView from './approach-c/views/BalancesView';
import EarningsView from './approach-c/views/EarningsView';
import DeductionsView from './approach-c/views/DeductionsView';
import GarnishmentsView from './approach-c/views/GarnishmentsView';
import FilingsView from './approach-c/views/FilingsView';

interface NavPage {
  id: string;
  label: string;
  icon: string;
  tabIndex: number;
}

const NAV_GROUPS: NavPage[][] = [
  [
    { id: 'overview', label: 'Overview', icon: Icon.TYPES.DASHBOARD, tabIndex: 0 },
    { id: 'my-pay', label: 'My pay', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, tabIndex: -1 },
  ],
  [
    { id: 'people', label: 'People', icon: Icon.TYPES.USER_OUTLINE, tabIndex: 1 },
    { id: 'entities', label: 'Entities', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE, tabIndex: 3 },
  ],
  [
    { id: 'balances', label: 'Balances', icon: Icon.TYPES.TIME_OUTLINE, tabIndex: 5 },
    { id: 'earnings', label: 'Earnings', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, tabIndex: 7 },
    { id: 'deductions', label: 'Deductions', icon: Icon.TYPES.CREDIT_CARD_OUTLINE, tabIndex: 8 },
    { id: 'garnishments', label: 'Garnishments', icon: Icon.TYPES.DOCUMENT_OUTLINE, tabIndex: 9 },
  ],
  [
    { id: 'filings', label: 'Taxes and filings', icon: Icon.TYPES.DOCUMENT_OUTLINE, tabIndex: 10 },
    { id: 'reports', label: 'Reports', icon: Icon.TYPES.BAR_CHART_OUTLINE, tabIndex: 6 },
    { id: 'accounting', label: 'Accounting integrations', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE, tabIndex: 4 },
    { id: 'settings', label: 'Payroll settings', icon: Icon.TYPES.SETTINGS_OUTLINE, tabIndex: 2 },
  ],
];

const ALL_NAV_ITEMS = NAV_GROUPS.flat();

const SUB_TABS: Record<number, string[]> = {
  0: ['Upcoming / drafts', 'Failed runs', 'Submitted', 'Completed', 'Archived'],
};

const TAB_KEYS = [
  'overview', 'people', 'settings', 'entities', 'accounting',
  'balances', 'reports', 'earnings', 'deductions', 'garnishments', 'filings',
];

const PAGE_TITLES: Record<number, string> = {
  0: 'Overview',
  1: 'People',
  2: 'Payroll settings',
  3: 'Entities',
  4: 'Accounting integrations',
  5: 'Balances',
  6: 'Reports',
  7: 'Earnings',
  8: 'Deductions',
  9: 'Garnishments',
  10: 'Taxes and filings',
};

const EntitySwitcherDemo: React.FC = () => {
  return (
    <ScopeContextProvider>
      <EntitySwitcherContent />
    </ScopeContextProvider>
  );
};

const EntitySwitcherContent: React.FC = () => {
  const { theme, mode: currentMode } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);

  const {
    selectedEntityIds,
    setSelectedEntityIds,
    setMode,
    setAllowMulti,
    previousScope,
    setPreviousScope,
    configEntityId,
    setConfigEntityId,
  } = useScopeContext();

  const prevTabRef = useRef(activeTab);
  const allIds = ENTITIES.map(e => e.id);

  useEffect(() => {
    const tabKey = TAB_KEYS[activeTab];
    const config = VIEW_MODES[tabKey];
    if (!config) return;

    const prevTabKey = TAB_KEYS[prevTabRef.current];
    const prevConfig = VIEW_MODES[prevTabKey];
    const wasConfiguration = prevConfig?.default === 'configuration';
    const isConfiguration = config.default === 'configuration';

    if (isConfiguration && !wasConfiguration) {
      setPreviousScope(selectedEntityIds);
      setAllowMulti(false);

      const remembered = configEntityId ? getEntity(configEntityId) : null;
      const isAll = selectedEntityIds.length === allIds.length;
      const autoEntity = remembered ?? (isAll ? ENTITIES[0] : getEntity(selectedEntityIds[0]));
      const entityName = autoEntity?.name ?? 'entity';
      const entityId = autoEntity?.id ?? allIds[0];

      setSelectedEntityIds([entityId]);
      setConfigEntityId(entityId);
      setMode(config.default);
      Snackbar.info(`Showing settings for ${entityName}. Switch entity in the sidebar.`);
    } else if (!isConfiguration && wasConfiguration) {
      setConfigEntityId(selectedEntityIds[0] ?? null);
      const restored = previousScope.length > 0 ? previousScope : allIds;
      setSelectedEntityIds(restored);
      setAllowMulti(config.allowMulti);
      setMode(config.default);
    } else {
      setMode(config.default);
      setAllowMulti(config.allowMulti);
    }

    prevTabRef.current = activeTab;
    setActiveSubTab(0);
  }, [activeTab]);

  const handleNavClick = (tabIndex: number) => {
    if (tabIndex >= 0) setActiveTab(tabIndex);
  };

  const activeNavId = ALL_NAV_ITEMS.find(item => item.tabIndex === activeTab)?.id ?? '';
  const subTabs = SUB_TABS[activeTab];
  const pageTitle = PAGE_TITLES[activeTab] ?? 'Payroll';
  const isComingSoon = activeTab === 4 || activeTab === 6;

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'global-settings', label: 'Global settings', icon: Icon.TYPES.SETTINGS_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  const renderView = () => {
    if (isComingSoon) {
      return <ComingSoon theme={theme}>Coming soon</ComingSoon>;
    }
    switch (activeTab) {
      case 0: return <OverviewView />;
      case 1: return <PeopleView />;
      case 2: return <SettingsView />;
      case 3: return <EntitiesView />;
      case 5: return <BalancesView />;
      case 7: return <EarningsView />;
      case 8: return <DeductionsView />;
      case 9: return <GarnishmentsView />;
      case 10: return <FilingsView />;
      default: return null;
    }
  };

  return (
    <AppContainer theme={theme}>
      <TopNavBar
        companyName="Acme, Inc."
        userInitial="A"
        adminMode={adminMode}
        currentMode={currentMode as 'light' | 'dark'}
        searchPlaceholder="Search or jump to..."
        onAdminModeToggle={() => setAdminMode(!adminMode)}
        showNotificationBadge
        notificationCount={2}
        theme={theme}
      />

      <StyledSidebar theme={theme} isCollapsed={sidebarCollapsed}>
        <NavContent>
          <SidebarEntityPicker isCollapsed={sidebarCollapsed} />
          {NAV_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupIndex > 0 && (
                <Divider theme={theme} />
              )}
              <NavGroup>
                {group.map(item => (
                  <SidebarNavItem
                    key={item.id}
                    theme={theme}
                    isActive={activeNavId === item.id}
                    isCollapsed={sidebarCollapsed}
                    onClick={() => handleNavClick(item.tabIndex)}
                    disabled={item.tabIndex < 0}
                  >
                    <NavItemIcon theme={theme}>
                      <Icon type={item.icon} size={20} color={
                        activeNavId === item.id ? theme.colorPrimary : theme.colorOnSurface
                      } />
                    </NavItemIcon>
                    <NavItemText theme={theme} isCollapsed={sidebarCollapsed}>
                      {item.label}
                    </NavItemText>
                    {item.tabIndex < 0 && !sidebarCollapsed && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurface} />
                      </div>
                    )}
                  </SidebarNavItem>
                ))}
              </NavGroup>
            </React.Fragment>
          ))}

          <Divider theme={theme} />

          <NavGroup>
            <SectionLabel theme={theme} isCollapsed={sidebarCollapsed}>Platform</SectionLabel>
            {platformSection.items.map(item => (
              <SidebarNavItem
                key={item.id}
                theme={theme}
                isActive={false}
                isCollapsed={sidebarCollapsed}
              >
                <NavItemIcon theme={theme}>
                  <Icon type={item.icon} size={20} color={theme.colorOnSurface} />
                </NavItemIcon>
                <NavItemText theme={theme} isCollapsed={sidebarCollapsed}>
                  {item.label}
                </NavItemText>
                {item.hasSubmenu && !sidebarCollapsed && (
                  <div style={{ marginLeft: 'auto' }}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurface} />
                  </div>
                )}
              </SidebarNavItem>
            ))}
          </NavGroup>
        </NavContent>

        <SidebarFooter theme={theme}>
          <CollapseButton theme={theme} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <NavItemIcon theme={theme}>
              <Icon type={Icon.TYPES.THUMBTACK_OUTLINE} size={20} color={theme.colorOnSurface} />
            </NavItemIcon>
            <NavItemText theme={theme} isCollapsed={sidebarCollapsed}>
              {sidebarCollapsed ? '' : 'Pin panel open'}
            </NavItemText>
          </CollapseButton>
        </SidebarFooter>
      </StyledSidebar>

      <MainContent theme={theme} sidebarCollapsed={sidebarCollapsed}>
        <PageContentContainer>
          <PageHeaderContainer theme={theme}>
            <PageHeaderWrapper theme={theme}>
              <Page.Header
                title={pageTitle}
                shouldBeUnderlined={false}
                size={Page.Header.SIZES.FLUID}
              />
            </PageHeaderWrapper>
            {subTabs && subTabs.length > 0 && (
              <TabsWrapper theme={theme}>
                <Tabs.LINK
                  activeIndex={activeSubTab}
                  onChange={index => setActiveSubTab(Number(index))}
                >
                  {subTabs.map((tab, i) => (
                    <Tabs.Tab key={`sub-${i}`} title={tab} />
                  ))}
                </Tabs.LINK>
              </TabsWrapper>
            )}
          </PageHeaderContainer>

          <PageContent theme={theme}>
            {renderView()}
          </PageContent>
        </PageContentContainer>
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  overflow: hidden;
`;

const StyledSidebar = styled.aside<{ isCollapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 0;
  width: ${({ isCollapsed }) => (isCollapsed ? '60px' : '266px')};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 50;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 200ms ease;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    border-radius: 3px;
  }
`;

const NavContent = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  flex-direction: column;
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space100};
`;

const SectionLabel = styled.div<{ isCollapsed: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space300};
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 200ms ease;
`;

const SidebarNavItem = styled.button<{ isActive: boolean; isCollapsed: boolean; disabled?: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: ${({ theme, isActive }) =>
    isActive ? getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover') : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.1s ease-in-out 0s;
  overflow: hidden;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const NavItemIcon = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NavItemText = styled.div<{ isCollapsed: boolean }>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 200ms ease;
`;

const SidebarFooter = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space200};
`;

const CollapseButton = styled.button`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};

  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const MainContent = styled.main<{ sidebarCollapsed: boolean }>`
  position: fixed;
  left: ${({ sidebarCollapsed }) => (sidebarCollapsed ? '60px' : '266px')};
  top: 56px;
  right: 0;
  bottom: 0;
  transition: left 200ms ease;
  overflow-y: auto;
  overflow-x: hidden;
`;

const PageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;

const PageHeaderContainer = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const PageHeaderWrapper = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space1400};
  padding-right: ${({ theme }) => (theme as StyledTheme).space1400};

  & > div {
    margin-bottom: 0 !important;
  }
  & div[class*='Content'] {
    margin-top: ${({ theme }) => (theme as StyledTheme).space1000} !important;
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200} !important;
  }
`;

const TabsWrapper = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1400};

  & > div,
  & div[class*='StyledScroll'],
  & div[class*='StyledTabContainer'] {
    box-shadow: none !important;
  }
`;

const PageContent = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1400}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  flex: 1;
`;

const ComingSoon = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export default EntitySwitcherDemo;
