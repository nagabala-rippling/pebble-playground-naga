import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Snackbar from '@rippling/pebble/SnackBar';
import { ENTITIES, VIEW_MODES, getEntity } from '../data';
import { ScopeContextProvider, useScopeContext } from './ScopeContext';
import ScopeIndicator from './ScopeIndicator';
import OverviewView from './views/OverviewView';
import PeopleView from './views/PeopleView';
import SettingsView from './views/SettingsView';
import EntitiesView from './views/EntitiesView';
import BalancesView from './views/BalancesView';
import EarningsView from './views/EarningsView';
import DeductionsView from './views/DeductionsView';
import GarnishmentsView from './views/GarnishmentsView';
import FilingsView from './views/FilingsView';

interface ApproachCProps {
  activeTab: number;
}

const TAB_KEYS = [
  'overview', 'people', 'settings', 'entities', 'accounting',
  'balances', 'reports', 'earnings', 'deductions', 'garnishments', 'filings',
];

const ApproachC: React.FC<ApproachCProps> = ({ activeTab }) => {
  return (
    <ScopeContextProvider>
      <ApproachCContent activeTab={activeTab} />
    </ScopeContextProvider>
  );
};

const ApproachCContent: React.FC<ApproachCProps> = ({ activeTab }) => {
  const { theme } = useTheme();
  const {
    selectedEntityIds,
    setSelectedEntityIds,
    mode,
    setMode,
    setAllowMulti,
    previousScope,
    setPreviousScope,
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

      const isAll = selectedEntityIds.length === allIds.length;
      const autoEntity = isAll ? ENTITIES[0] : getEntity(selectedEntityIds[0]);
      const entityName = autoEntity?.name ?? 'entity';
      const entityId = autoEntity?.id ?? allIds[0];

      setSelectedEntityIds([entityId]);
      setMode(config.default);

      Snackbar.success(`Showing settings for ${entityName}. Switch entity in the scope indicator.`);
    } else if (!isConfiguration && wasConfiguration) {
      const restored = previousScope.length > 0 ? previousScope : allIds;
      setSelectedEntityIds(restored);
      setAllowMulti(config.allowMulti);
      setMode(config.default);
    } else {
      setMode(config.default);
      setAllowMulti(config.allowMulti);
    }

    prevTabRef.current = activeTab;
  }, [activeTab]);

  const isComingSoon = activeTab === 4 || activeTab === 6;

  const renderView = () => {
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
    <Wrapper>
      {mode !== 'hidden' && (
        <ScopeRow>
          <ScopeIndicator />
        </ScopeRow>
      )}
      <ContentArea theme={theme}>
        {isComingSoon ? (
          <ComingSoon theme={theme}>Coming soon</ComingSoon>
        ) : (
          renderView()
        )}
      </ContentArea>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ScopeRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  padding-bottom: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  overflow-y: auto;
`;

const ComingSoon = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export default ApproachC;
