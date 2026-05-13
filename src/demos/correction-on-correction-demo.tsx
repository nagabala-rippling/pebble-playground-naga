import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Atoms from '@rippling/pebble/Atoms';
import Tabs from '@rippling/pebble/Tabs';
import { StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import {
  GP_CHAIN,
  US_CHAIN,
  CorrectionChain,
  CorrectionModel,
  Variation,
  VARIATION_LABELS,
  VARIATION_DESCRIPTIONS,
} from './correction-on-correction/data';
import { VariationRenderer } from './correction-on-correction/variations';

const VARIATIONS: Variation[] = ['v1', 'v2', 'v3'];
const MODELS: CorrectionModel[] = ['GP', 'US'];

// ─── Page layout ──────────────────────────────────────────────────

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  max-width: 760px;
`;

const PRDQuote = styled.blockquote`
  margin: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-left: 3px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  align-items: flex-start;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  min-width: 200px;
`;

const ControlLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const VariationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const VariationButton = styled.button<{ active: boolean }>`
  padding: 8px 14px;
  border: 1px solid
    ${({ active, theme }) =>
      active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ active, theme }) =>
    active
      ? ((theme as StyledTheme).colorPrimaryContainer ??
        (theme as StyledTheme).colorSurfaceContainerLow)
      : (theme as StyledTheme).colorSurfaceContainerLowest};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: ${({ active }) => (active ? 535 : 430)};
`;

// ─── Focused pay run card ─────────────────────────────────────────

const RunCardSurface = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  max-width: 720px;
`;

const RunCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const RunCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RunName = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const RunSub = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const RunMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const MetaValue = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const StatusInline = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess ?? '#137333'};
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccess ?? '#137333'};
`;

const ChainSummary = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding-top: ${({ theme }) => (theme as StyledTheme).space200};
  border-top: 1px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const FocusedRunCard: React.FC<{
  chain: CorrectionChain;
  onCreateCorrection: () => void;
}> = ({ chain, onCreateCorrection }) => (
  <RunCardSurface>
    <RunCardTop>
      <RunCardTitle>
        <RunName>{chain.reference.displayName}</RunName>
        {chain.reference.subTitle && <RunSub>{chain.reference.subTitle}</RunSub>}
      </RunCardTitle>
      <Button
        appearance={Button.APPEARANCES.PRIMARY}
        size={Button.SIZES.M}
        onClick={onCreateCorrection}
      >
        Create Correction
      </Button>
    </RunCardTop>

    <RunMeta>
      <MetaItem>
        <MetaLabel>Country</MetaLabel>
        <MetaValue>
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <Atoms.Country
              countryCode={chain.reference.countryCode}
              size={Atoms.Country.SIZES.S}
              onlyFlag
            />
            {chain.reference.countryName}
          </span>
        </MetaValue>
      </MetaItem>
      <MetaItem>
        <MetaLabel>Entity</MetaLabel>
        <MetaValue>{chain.reference.entityDisplayName}</MetaValue>
      </MetaItem>
      <MetaItem>
        <MetaLabel>People</MetaLabel>
        <MetaValue>{chain.reference.numberOfEmployeesInvolved}</MetaValue>
      </MetaItem>
      <MetaItem>
        <MetaLabel>Pay date</MetaLabel>
        <MetaValue>{chain.reference.payDate}</MetaValue>
      </MetaItem>
    </RunMeta>

    <div>
      <MetaLabel>Status</MetaLabel>
      <StatusInline>
        <StatusDot />
        {chain.reference.status}
      </StatusInline>
    </div>

    <ChainSummary>
      This run has <strong>{chain.corrections.length}</strong> existing correction
      {chain.corrections.length > 1 ? 's' : ''} ({chain.model}{' '}
      {chain.model === 'GP' ? 'chained' : 'linear'} model). Click "Create Correction" to see the
      proposed flow.
    </ChainSummary>
  </RunCardSurface>
);

// ─── Page ──────────────────────────────────────────────────────────

const CorrectionOnCorrectionDemo: React.FC = () => {
  const [variation, setVariation] = useState<Variation>('v1');
  const [model, setModel] = useState<CorrectionModel>('GP');
  const [isOpen, setIsOpen] = useState(false);

  const chain = model === 'GP' ? GP_CHAIN : US_CHAIN;

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
      <PageRoot>
        <Section>
          <SectionTitle>Problem · Correction-on-correction creation</SectionTitle>
          <SectionDescription>
            Correction runs are moving inside <code>ReconciliationProcess</code>. Once they do,
            completed correction runs no longer appear on the Overview page's Completed tab — only
            in Corrections (and Archived). This breaks admins who need to create a correction on a
            correction for GP countries, because the chained model requires targeting the latest
            correction run, which they can't reach from the Overview.
          </SectionDescription>
          <PRDQuote>
            <strong>GP (chained):</strong> Auto-redirect into Create Correction with the latest
            correction pre-selected as the reference.
            <br />
            <strong>US (linear):</strong> Show a modal with options to view the latest correction or
            create a new correction on the original reference run.
          </PRDQuote>
        </Section>

        <Section>
          <SectionTitle>Variations</SectionTitle>
          <SectionDescription>
            Switch between variations to compare. Choose a country model to see how each variation
            behaves.
          </SectionDescription>

          <Controls>
            <ControlGroup>
              <ControlLabel>Variation</ControlLabel>
              <VariationButtons>
                {VARIATIONS.map(v => (
                  <VariationButton key={v} active={variation === v} onClick={() => setVariation(v)}>
                    {VARIATION_LABELS[v]}
                  </VariationButton>
                ))}
              </VariationButtons>
              <SectionDescription style={{ marginTop: 4 }}>
                {VARIATION_DESCRIPTIONS[variation]}
              </SectionDescription>
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>Country model</ControlLabel>
              <Tabs.SWITCH
                activeIndex={MODELS.indexOf(model)}
                onChange={i => setModel(MODELS[Number(i)])}
              >
                <Tabs.Tab title="GP (chained)" />
                <Tabs.Tab title="US (linear)" />
              </Tabs.SWITCH>
            </ControlGroup>
          </Controls>
        </Section>

        <Section>
          <SectionTitle>Try it</SectionTitle>
          <SectionDescription>
            This is a Completed pay run with an existing correction chain. Click "Create Correction"
            to trigger the selected variation.
          </SectionDescription>
          <FocusedRunCard chain={chain} onCreateCorrection={() => setIsOpen(true)} />
        </Section>
      </PageRoot>

      <VariationRenderer
        variation={variation}
        isOpen={isOpen}
        chain={chain}
        onClose={() => setIsOpen(false)}
      />
    </AppShellLayout>
  );
};

export default CorrectionOnCorrectionDemo;
