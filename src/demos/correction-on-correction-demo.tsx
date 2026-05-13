import React, { useState } from 'react';
import styled from '@emotion/styled';
import Tabs from '@rippling/pebble/Tabs';
import { StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import {
  GP_CHAIN,
  US_CHAIN,
  CorrectionModel,
  Variation,
  VARIATION_KIND,
  VARIATION_LABELS,
  VARIATION_DESCRIPTIONS,
  VARIATION_TAGLINES,
  VARIATION_ORDER,
} from './correction-on-correction/data';
import { VariationScene } from './correction-on-correction/variations';

const MODELS: CorrectionModel[] = ['GP', 'US'];

// ─── Page layout ──────────────────────────────────────────────────

const Page = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 24px 32px;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

// Sidebar ──────────────────────────────────────────────────────────

const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 24px;
  align-self: start;
`;

const SidebarHeading = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
`;

const SidebarItem = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  padding: 8px 12px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  border: 1px solid
    ${({ active, theme }) => (active ? (theme as StyledTheme).colorPrimary : 'transparent')};
  background-color: ${({ active, theme }) =>
    active
      ? ((theme as StyledTheme).colorPrimaryContainer ??
        (theme as StyledTheme).colorSurfaceContainerHigh)
      : 'transparent'};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
  &:hover {
    background-color: ${({ active, theme }) =>
      active
        ? ((theme as StyledTheme).colorPrimaryContainer ??
          (theme as StyledTheme).colorSurfaceContainerHigh)
        : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const SidebarItemTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 535;
`;

const SidebarItemTagline = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

// Main column ─────────────────────────────────────────────────────

const Main = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
`;

const IntroTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const IntroText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const KindChip = styled.span<{ kind: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 535;
  align-self: flex-start;
  margin-top: 4px;
  background-color: ${({ kind, theme }) => {
    const t = theme as StyledTheme;
    switch (kind) {
      case 'overlay':
        return t.colorPrimaryContainer ?? '#E7EFFD';
      case 'inline':
        return t.colorSuccessContainer ?? '#E3F4E5';
      case 'workspace':
        return t.colorWarningContainer ?? '#FEF7E0';
      case 'transient':
        return t.colorSurfaceContainerHigh ?? '#E8EAED';
      default:
        return t.colorSurfaceContainerHigh ?? '#E8EAED';
    }
  }};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SceneFrame = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: 24px;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SceneLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// ─── Page component ───────────────────────────────────────────────

const CorrectionOnCorrectionDemo: React.FC = () => {
  const [variation, setVariation] = useState<Variation>('v1');
  const [model, setModel] = useState<CorrectionModel>('GP');

  const chain = model === 'GP' ? GP_CHAIN : US_CHAIN;
  const kind = VARIATION_KIND[variation];

  return (
    <AppShellLayout
      pageTitle="Correction on Correction"
      defaultAdminMode
      companyName="Carter-Ruiz"
      userInitial="C"
      superAppName="Payroll"
      showNotificationBadge
      notificationCount={2}
    >
      <Page>
        <Sidebar>
          <SidebarHeading>Variations</SidebarHeading>
          {VARIATION_ORDER.map(v => (
            <SidebarItem key={v} active={variation === v} onClick={() => setVariation(v)}>
              <SidebarItemTitle>{VARIATION_LABELS[v]}</SidebarItemTitle>
              <SidebarItemTagline>{VARIATION_TAGLINES[v]}</SidebarItemTagline>
            </SidebarItem>
          ))}
        </Sidebar>

        <Main>
          <Intro>
            <IntroTitle>{VARIATION_LABELS[variation]}</IntroTitle>
            <IntroText>{VARIATION_DESCRIPTIONS[variation]}</IntroText>
            <KindChip kind={kind}>
              {kind === 'overlay' && 'Surface: Modal / Drawer overlay'}
              {kind === 'inline' && 'Surface: Inline in the table'}
              {kind === 'workspace' && 'Surface: Full-page workspace'}
              {kind === 'transient' && 'Surface: Toast / silent navigation'}
            </KindChip>
          </Intro>

          <ControlsRow>
            <ControlLabel>Country model</ControlLabel>
            <Tabs.SWITCH
              activeIndex={MODELS.indexOf(model)}
              onChange={i => setModel(MODELS[Number(i)])}
            >
              <Tabs.Tab title="GP (chained)" />
              <Tabs.Tab title="US (linear)" />
            </Tabs.SWITCH>
          </ControlsRow>

          <SceneFrame>
            <SceneLabel>Scene preview · {chain.reference.displayName}</SceneLabel>
            <VariationScene variation={variation} chain={chain} />
          </SceneFrame>
        </Main>
      </Page>
    </AppShellLayout>
  );
};

export default CorrectionOnCorrectionDemo;
