import React from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Modal from '@rippling/pebble/Modal';
import Drawer from '@rippling/pebble/Drawer';
import Icon from '@rippling/pebble/Icon';
import Atoms from '@rippling/pebble/Atoms';
import { StyledTheme } from '@/utils/theme';
import {
  CorrectionChain,
  latestCorrection,
  buildGPRedirectUrl,
  buildUSViewCorrectionUrl,
  Variation,
} from './data';

// ─── Shared styled-components ──────────────────────────────────────

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const ParaText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SubText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

const InlineLink = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  text-decoration: none;
  cursor: pointer;
  font-weight: 535;
  &:hover {
    text-decoration: underline;
  }
`;

const ChainList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ChainItem = styled.li<{ active?: boolean; tip?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid
    ${({ active, theme }) =>
      active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ active, theme }) =>
    active
      ? ((theme as StyledTheme).colorPrimaryContainer ??
        (theme as StyledTheme).colorSurfaceContainerLow)
      : (theme as StyledTheme).colorSurface};
  position: relative;
`;

const ChainIndicator = styled.div<{ tip?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ tip, theme }) =>
    tip ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ tip, theme }) =>
    tip ? (theme as StyledTheme).colorOnPrimary : (theme as StyledTheme).colorOnSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 535;
`;

const ChainBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChainTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const ChainMeta = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ChainAction = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const RedirectFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  border: 1px dashed ${({ theme }) => (theme as StyledTheme).colorOutline};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
`;

const URLText = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  padding: 6px 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  word-break: break-all;
`;

const Pill = styled.span<{ tone: 'GP' | 'US' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 535;
  background-color: ${({ tone, theme }) =>
    tone === 'GP'
      ? ((theme as StyledTheme).colorPrimaryContainer ?? '#E7EFFD')
      : ((theme as StyledTheme).colorWarningContainer ?? '#FEF3E0')};
  color: ${({ tone, theme }) =>
    tone === 'GP'
      ? (theme as StyledTheme).colorPrimary
      : ((theme as StyledTheme).colorWarning ?? '#7A4F01')};
`;

// ─── Helpers ──────────────────────────────────────────────────────

const ChainItemView: React.FC<{
  ordinal: string;
  title: string;
  meta: string;
  isTip: boolean;
  isActive: boolean;
  onSelect?: () => void;
  selectLabel?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
}> = ({
  ordinal,
  title,
  meta,
  isTip,
  isActive,
  onSelect,
  selectLabel,
  secondaryLabel,
  onSecondary,
}) => (
  <ChainItem active={isActive}>
    <ChainIndicator tip={isTip}>
      {isTip ? <Icon type={Icon.TYPES.CHECK} size={14} /> : '·'}
    </ChainIndicator>
    <ChainBody>
      <ChainTitle>
        {ordinal} — {title}
      </ChainTitle>
      <ChainMeta>{meta}</ChainMeta>
    </ChainBody>
    <ChainAction>
      {secondaryLabel && (
        <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.S} onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      )}
      {selectLabel && (
        <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.S} onClick={onSelect}>
          {selectLabel}
        </Button>
      )}
    </ChainAction>
  </ChainItem>
);

const ReferenceChainItem: React.FC<{
  chain: CorrectionChain;
  selectable: boolean;
  onSelect?: () => void;
  selectLabel?: string;
}> = ({ chain, selectable, onSelect, selectLabel }) => (
  <ChainItem active={false}>
    <ChainIndicator>0</ChainIndicator>
    <ChainBody>
      <ChainTitle>Reference Run — {chain.reference.displayName}</ChainTitle>
      <ChainMeta>
        {chain.reference.entityDisplayName} · {chain.reference.numberOfEmployeesInvolved} people ·
        Paid {chain.reference.payDate}
      </ChainMeta>
    </ChainBody>
    <ChainAction>
      {selectable && (
        <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.S} onClick={onSelect}>
          {selectLabel ?? 'Create correction on this'}
        </Button>
      )}
    </ChainAction>
  </ChainItem>
);

// ─── V1 BASELINE ──────────────────────────────────────────────────
//
// GP: auto-redirect (we mock with a "you were redirected" overlay)
// US: modal with [View latest correction] | [Create new] | [Cancel]

export const V1Baseline: React.FC<{
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ isOpen, chain, onClose }) => {
  if (chain.model === 'GP') {
    // GP redirect view (mocked, since no real route exists for the create-correction flow)
    return (
      <Modal isVisible={isOpen} onCancel={onClose} title="Redirected to Create Correction">
        <ModalBody>
          <Pill tone="GP">GP · chained correction model</Pill>
          <ParaText>
            This run has {chain.corrections.length} existing corrections. Continuing the chain from
            the latest correction.
          </ParaText>
          <RedirectFrame>
            <SubText>You would be redirected to:</SubText>
            <URLText>{buildGPRedirectUrl(chain)}</URLText>
            <SubText>
              The flow starts with{' '}
              <strong style={{ color: 'inherit' }}>{latestCorrection(chain).ordinal}</strong>{' '}
              pre-selected as the reference. Admin can then add roles and proceed.
            </SubText>
          </RedirectFrame>
          <ModalActions>
            <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M} onClick={onClose}>
              Got it
            </Button>
          </ModalActions>
        </ModalBody>
      </Modal>
    );
  }

  // US modal
  const tip = latestCorrection(chain);
  return (
    <Modal isVisible={isOpen} onCancel={onClose} title="This run has an existing correction">
      <ModalBody>
        <Pill tone="US">US · linear correction model</Pill>
        <ParaText>
          {chain.reference.displayName} already has {chain.corrections.length} correction
          {chain.corrections.length > 1 ? 's' : ''}. You can:
        </ParaText>
        <InfoRow>
          <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={16} />
          <div>
            <ParaText style={{ marginBottom: 4 }}>Latest correction</ParaText>
            <InlineLink href={buildUSViewCorrectionUrl(tip.reconProcessId)}>
              {tip.title} →
            </InlineLink>
          </div>
        </InfoRow>
        <ModalActions>
          <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.M} onClick={onClose}>
            Cancel
          </Button>
          <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M} onClick={onClose}>
            View latest correction
          </Button>
          <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M} onClick={onClose}>
            Create new correction
          </Button>
        </ModalActions>
      </ModalBody>
    </Modal>
  );
};

// ─── V2 UNIFIED MODAL ─────────────────────────────────────────────
//
// Both GP and US get a modal. Primary action differs by model.

export const V2UnifiedModal: React.FC<{
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ isOpen, chain, onClose }) => {
  const tip = latestCorrection(chain);
  const isGP = chain.model === 'GP';

  return (
    <Modal
      isVisible={isOpen}
      onCancel={onClose}
      title={isGP ? 'Continue correction chain' : 'This run has an existing correction'}
    >
      <ModalBody>
        <Pill tone={isGP ? 'GP' : 'US'}>
          {isGP ? 'GP · chained correction model' : 'US · linear correction model'}
        </Pill>
        {isGP ? (
          <ParaText>
            {chain.reference.displayName} is part of a correction chain. To correct this run, you'll
            continue from the latest correction, <strong>{tip.ordinal}</strong>.
          </ParaText>
        ) : (
          <ParaText>
            {chain.reference.displayName} already has {chain.corrections.length} correction
            {chain.corrections.length > 1 ? 's' : ''}. Choose how to proceed.
          </ParaText>
        )}
        <InfoRow>
          <Icon
            type={isGP ? Icon.TYPES.LINK_HORIZONTAL : Icon.TYPES.INFO_CIRCLE_OUTLINE}
            size={16}
          />
          <div>
            <ParaText style={{ marginBottom: 4 }}>Latest correction</ParaText>
            <SubText>
              {tip.ordinal} — {tip.title} · Approved {tip.approvedAt} by {tip.approvedBy}
            </SubText>
          </div>
        </InfoRow>
        <ModalActions>
          <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.M} onClick={onClose}>
            Cancel
          </Button>
          {isGP ? (
            <>
              <Button
                appearance={Button.APPEARANCES.OUTLINE}
                size={Button.SIZES.M}
                onClick={onClose}
              >
                View chain ({chain.corrections.length})
              </Button>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.M}
                onClick={onClose}
              >
                Continue from {tip.ordinal}
              </Button>
            </>
          ) : (
            <>
              <Button
                appearance={Button.APPEARANCES.OUTLINE}
                size={Button.SIZES.M}
                onClick={onClose}
              >
                View latest correction
              </Button>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.M}
                onClick={onClose}
              >
                Create new correction
              </Button>
            </>
          )}
        </ModalActions>
      </ModalBody>
    </Modal>
  );
};

// ─── V3 CHAIN DRAWER ──────────────────────────────────────────────
//
// Side drawer renders the chain. GP only lets you continue from tip.
// US lets you create new on reference OR view any link.

export const V3ChainDrawer: React.FC<{
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ isOpen, chain, onClose }) => {
  const tip = latestCorrection(chain);
  const isGP = chain.model === 'GP';

  return (
    <Drawer isVisible={isOpen} onCancel={onClose} title="Create correction">
      <ModalBody>
        <Pill tone={isGP ? 'GP' : 'US'}>
          {isGP ? 'GP · chained correction model' : 'US · linear correction model'}
        </Pill>
        <ParaText>
          {chain.reference.displayName} has {chain.corrections.length} existing correction
          {chain.corrections.length > 1 ? 's' : ''}.{' '}
          {isGP
            ? 'In the GP model, new corrections continue from the tip.'
            : 'In the US model, you can correct the reference run or view existing corrections.'}
        </ParaText>

        <ChainList>
          <ReferenceChainItem
            chain={chain}
            selectable={!isGP}
            onSelect={onClose}
            selectLabel="Create new correction on this run"
          />
          {chain.corrections.map(c => {
            const isTip = c.reconProcessId === tip.reconProcessId;
            return (
              <ChainItemView
                key={c.reconProcessId}
                ordinal={c.ordinal}
                title={c.title}
                meta={`Approved ${c.approvedAt} by ${c.approvedBy}`}
                isTip={isTip}
                isActive={isGP && isTip}
                onSelect={isGP && isTip ? onClose : undefined}
                selectLabel={isGP && isTip ? 'Continue from here' : undefined}
                secondaryLabel="View"
                onSecondary={onClose}
              />
            );
          })}
        </ChainList>

        {isGP && (
          <InfoRow>
            <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={16} />
            <SubText>
              In GP, only the tip ({tip.ordinal}) can be corrected. Earlier links are locked because
              each correction targets the one before it.
            </SubText>
          </InfoRow>
        )}
      </ModalBody>
    </Drawer>
  );
};

// ─── Variation renderer ──────────────────────────────────────────

export const VariationRenderer: React.FC<{
  variation: Variation;
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ variation, ...rest }) => {
  if (variation === 'v1') return <V1Baseline {...rest} />;
  if (variation === 'v2') return <V2UnifiedModal {...rest} />;
  return <V3ChainDrawer {...rest} />;
};

// Re-export Atoms so consumers can use it (lint suppression: we may not use it here)
export { Atoms };
