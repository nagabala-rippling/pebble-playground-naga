import React, { createContext, useContext, useState, useMemo } from 'react';
import { ENTITIES } from '../data';
import type { ViewMode } from '../types';

interface ScopeContextValue {
  selectedEntityIds: string[];
  setSelectedEntityIds: (ids: string[]) => void;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  allowMulti: boolean;
  setAllowMulti: (v: boolean) => void;
  previousScope: string[];
  setPreviousScope: (ids: string[]) => void;
  configEntityId: string | null;
  setConfigEntityId: (id: string | null) => void;
}

const allIds = ENTITIES.map(e => e.id);

const ScopeContext = createContext<ScopeContextValue>({
  selectedEntityIds: allIds,
  setSelectedEntityIds: () => {},
  mode: 'operational',
  setMode: () => {},
  allowMulti: true,
  setAllowMulti: () => {},
  previousScope: [],
  setPreviousScope: () => {},
  configEntityId: null,
  setConfigEntityId: () => {},
});

export const useScopeContext = () => useContext(ScopeContext);

export const ScopeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(allIds);
  const [mode, setMode] = useState<ViewMode>('operational');
  const [allowMulti, setAllowMulti] = useState(true);
  const [previousScope, setPreviousScope] = useState<string[]>([]);
  const [configEntityId, setConfigEntityId] = useState<string | null>(null);

  const value = useMemo<ScopeContextValue>(
    () => ({
      selectedEntityIds,
      setSelectedEntityIds,
      mode,
      setMode,
      allowMulti,
      setAllowMulti,
      previousScope,
      setPreviousScope,
      configEntityId,
      setConfigEntityId,
    }),
    [selectedEntityIds, mode, allowMulti, previousScope, configEntityId],
  );

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
};

export default ScopeContext;
