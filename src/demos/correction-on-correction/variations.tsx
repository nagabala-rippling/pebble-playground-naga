import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
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

// ═══ Shared styled-components ═════════════════════════════════════

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

// ═══ Chain visualization (used by V3 and V7) ═════════════════════

const ChainList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ChainItemRoot = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
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
  min-width: 0;
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

interface ChainRowProps {
  ordinal: string;
  title: string;
  meta: string;
  isTip: boolean;
  isActive: boolean;
  selectLabel?: string;
  secondaryLabel?: string;
  onSelect?: () => void;
  onSecondary?: () => void;
}

const ChainRow: React.FC<ChainRowProps> = ({
  ordinal,
  title,
  meta,
  isTip,
  isActive,
  selectLabel,
  secondaryLabel,
  onSelect,
  onSecondary,
}) => (
  <ChainItemRoot active={isActive}>
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
  </ChainItemRoot>
);

const ChainView: React.FC<{
  chain: CorrectionChain;
  onReferenceSelect?: () => void;
  onTipSelect?: () => void;
  onView?: () => void;
}> = ({ chain, onReferenceSelect, onTipSelect, onView }) => {
  const tip = latestCorrection(chain);
  const isGP = chain.model === 'GP';
  return (
    <ChainList>
      <ChainRow
        ordinal="Reference"
        title={chain.reference.displayName}
        meta={`${chain.reference.entityDisplayName} · ${chain.reference.numberOfEmployeesInvolved} people · Paid ${chain.reference.payDate}`}
        isTip={false}
        isActive={false}
        selectLabel={!isGP ? 'Create new correction on this run' : undefined}
        onSelect={!isGP ? onReferenceSelect : undefined}
      />
      {chain.corrections.map(c => {
        const isTip = c.reconProcessId === tip.reconProcessId;
        return (
          <ChainRow
            key={c.reconProcessId}
            ordinal={c.ordinal}
            title={c.title}
            meta={`Approved ${c.approvedAt} by ${c.approvedBy}`}
            isTip={isTip}
            isActive={isGP && isTip}
            secondaryLabel="View"
            onSecondary={onView}
            selectLabel={isGP && isTip ? 'Continue from here' : undefined}
            onSelect={isGP && isTip ? onTipSelect : undefined}
          />
        );
      })}
    </ChainList>
  );
};

// ═════════════════════════════════════════════════════════════════
// V1 BASELINE — GP redirect / US modal
// ═════════════════════════════════════════════════════════════════

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

export const V1Baseline: React.FC<{
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ isOpen, chain, onClose }) => {
  if (chain.model === 'GP') {
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
              The flow starts with <strong>{latestCorrection(chain).ordinal}</strong> pre-selected
              as the reference. Admin can then add roles and proceed.
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

// ═════════════════════════════════════════════════════════════════
// V2 UNIFIED MODAL
// ═════════════════════════════════════════════════════════════════

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

// ═════════════════════════════════════════════════════════════════
// V3 CHAIN DRAWER
// ═════════════════════════════════════════════════════════════════

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

        <ChainView
          chain={chain}
          onReferenceSelect={onClose}
          onTipSelect={onClose}
          onView={onClose}
        />

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

// ═════════════════════════════════════════════════════════════════
// V4 STATUS-AWARE ACTION PILL
// ═════════════════════════════════════════════════════════════════

const SplitButton = styled.div`
  display: inline-flex;
  align-items: stretch;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const SplitPrimary = styled.button`
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  border: none;
  padding: 6px 14px;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 535;
  &:hover {
    filter: brightness(0.95);
  }
`;

const SplitSecondary = styled.button`
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 10px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;

const Toast = styled.div`
  position: relative;
  padding: 10px 14px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToastCode = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  padding: 2px 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

type PillSimulatedState = 'fresh' | 'has-draft' | 'has-corrections' | 'locked';

const PILL_STATES_FOR_DEMO: PillSimulatedState[] = [
  'fresh',
  'has-corrections',
  'has-draft',
  'locked',
];

const PillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
`;

const PillLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  min-width: 180px;
`;

const DangerButton = styled.button`
  background-color: ${({ theme }) => (theme as StyledTheme).colorError};
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 535;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const V4SmartPill: React.FC<{
  chain: CorrectionChain;
  state?: PillSimulatedState;
  onPrimary?: () => void;
  onSecondary?: () => void;
}> = ({ chain, state, onPrimary, onSecondary }) => {
  // Decide effective state from chain when not provided
  const effectiveState: PillSimulatedState =
    state ?? (chain.corrections.length > 0 ? 'has-corrections' : 'fresh');
  const isGP = chain.model === 'GP';

  if (effectiveState === 'fresh') {
    return (
      <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S} onClick={onPrimary}>
        {isGP ? 'Create Correction' : 'Make Changes'}
      </Button>
    );
  }

  if (effectiveState === 'has-draft') {
    return (
      <DangerButton onClick={onPrimary}>
        <Icon type={Icon.TYPES.WARNING_TRIANGLE_FILLED} size={12} />
        Finish pending correction →
      </DangerButton>
    );
  }

  if (effectiveState === 'locked') {
    return (
      <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S} isDisabled>
        Locked
      </Button>
    );
  }

  // has-corrections
  if (isGP) {
    return (
      <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.S} onClick={onPrimary}>
        Continue chain · {chain.corrections.length} →
      </Button>
    );
  }

  // US: split button
  return (
    <SplitButton>
      <SplitPrimary onClick={onPrimary}>Create new</SplitPrimary>
      <SplitSecondary
        onClick={onSecondary}
        aria-label={`View ${chain.corrections.length} existing corrections`}
      >
        <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
      </SplitSecondary>
    </SplitButton>
  );
};

export const V4Scene: React.FC<{ chain: CorrectionChain }> = ({ chain }) => {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SubText>
        The same button takes different shapes depending on the run's state. Hover over each example
        to see the inline action:
      </SubText>
      {PILL_STATES_FOR_DEMO.map(s => (
        <PillRow key={s}>
          <PillLabel>{labelForState(s)}</PillLabel>
          <V4SmartPill
            chain={chain}
            state={s}
            onPrimary={() => setToast(actionForState(s, chain))}
            onSecondary={() =>
              setToast(`Opened correction list for ${chain.reference.displayName}`)
            }
          />
        </PillRow>
      ))}
      {toast && <Toast>✓ {toast}</Toast>}
    </div>
  );
};

function labelForState(s: PillSimulatedState): string {
  switch (s) {
    case 'fresh':
      return 'Never corrected';
    case 'has-corrections':
      return 'Has completed corrections';
    case 'has-draft':
      return 'Has a DRAFT correction in flight';
    case 'locked':
      return 'POP / archived / not eligible';
  }
}

function actionForState(s: PillSimulatedState, chain: CorrectionChain): string {
  const isGP = chain.model === 'GP';
  switch (s) {
    case 'fresh':
      return `Started ${isGP ? 'Create Correction' : 'Make Changes'} flow on reference`;
    case 'has-corrections':
      return isGP
        ? `Continued chain from ${latestCorrection(chain).ordinal}`
        : 'Started new correction on reference run';
    case 'has-draft':
      return `Opened the in-flight draft to finish`;
    case 'locked':
      return 'No-op (button disabled)';
  }
}

// ═════════════════════════════════════════════════════════════════
// V5 INLINE CHAIN STRIP (per-row expandable)
// ═════════════════════════════════════════════════════════════════

const StripContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  overflow: hidden;
`;

const StripSummary = styled.button<{ open: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: none;
  border: none;
  border-bottom: ${({ open, theme }) =>
    open ? `1px solid ${(theme as StyledTheme).colorOutlineVariant}` : '1px solid transparent'};
  cursor: pointer;
  text-align: left;
  width: 100%;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const StripCaret = styled(Icon)<{ open?: boolean }>`
  transition: transform 150ms ease;
  transform: ${({ open }) => (open ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const StripPanel = styled.div`
  padding: 14px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

export const V5InlineChainStrip: React.FC<{ chain: CorrectionChain; defaultOpen?: boolean }> = ({
  chain,
  defaultOpen,
}) => {
  const [open, setOpen] = useState(!!defaultOpen);
  const tip = latestCorrection(chain);
  return (
    <StripContainer>
      <StripSummary open={open} onClick={() => setOpen(!open)}>
        <StripCaret type={Icon.TYPES.CHEVRON_RIGHT} size={14} open={open} />
        <strong>This run has {chain.corrections.length} corrections.</strong>
        <span style={{ opacity: 0.7 }}>
          Latest approved by {tip.approvedBy} on {tip.approvedAt}
        </span>
      </StripSummary>
      {open && (
        <StripPanel>
          <ChainView
            chain={chain}
            onReferenceSelect={() => undefined}
            onTipSelect={() => undefined}
            onView={() => undefined}
          />
        </StripPanel>
      )}
    </StripContainer>
  );
};

// ═════════════════════════════════════════════════════════════════
// V6 PROMOTED NOTICE BANNER
// ═════════════════════════════════════════════════════════════════

const Notice = styled.div<{ tone: 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ tone, theme }) =>
    tone === 'warning'
      ? ((theme as StyledTheme).colorWarningContainer ?? '#FEF7E0')
      : ((theme as StyledTheme).colorPrimaryContainer ?? '#E7EFFD')};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  border-left: 4px solid
    ${({ tone, theme }) =>
      tone === 'warning'
        ? ((theme as StyledTheme).colorWarning ?? '#7A4F01')
        : (theme as StyledTheme).colorPrimary};
`;

const NoticeIcon = styled.div<{ tone: 'info' | 'warning' }>`
  color: ${({ tone, theme }) =>
    tone === 'warning'
      ? ((theme as StyledTheme).colorWarning ?? '#7A4F01')
      : (theme as StyledTheme).colorPrimary};
`;

const NoticeBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NoticeTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const NoticeText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const NoticeActions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-top: 4px;
`;

export const V6PromotedNotice: React.FC<{
  chain: CorrectionChain;
  onPrimary?: () => void;
  onSecondary?: () => void;
}> = ({ chain, onPrimary, onSecondary }) => {
  const isGP = chain.model === 'GP';
  const tip = latestCorrection(chain);
  return (
    <Notice tone={isGP ? 'info' : 'warning'}>
      <NoticeIcon tone={isGP ? 'info' : 'warning'}>
        <Icon type={Icon.TYPES.INFO_CIRCLE_FILL} size={20} />
      </NoticeIcon>
      <NoticeBody>
        <NoticeTitle>
          {isGP
            ? `This run is part of a correction chain (${chain.corrections.length} corrections)`
            : `This run has ${chain.corrections.length} existing correction${chain.corrections.length > 1 ? 's' : ''}`}
        </NoticeTitle>
        <NoticeText>
          {isGP ? (
            <>
              In the GP model, new corrections continue from the latest correction (
              <strong>{tip.ordinal}</strong>). Created by {tip.approvedBy} on {tip.approvedAt}.
            </>
          ) : (
            <>
              In the US model, you can view the latest correction or create a new correction on the
              reference run. Latest: <strong>{tip.ordinal}</strong>, approved by {tip.approvedBy} on{' '}
              {tip.approvedAt}.
            </>
          )}
        </NoticeText>
        <NoticeActions>
          {isGP ? (
            <>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.S}
                onClick={onPrimary}
              >
                Continue from {tip.ordinal}
              </Button>
              <Button
                appearance={Button.APPEARANCES.GHOST}
                size={Button.SIZES.S}
                onClick={onSecondary}
              >
                View chain
              </Button>
            </>
          ) : (
            <>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.S}
                onClick={onPrimary}
              >
                Create new correction
              </Button>
              <Button
                appearance={Button.APPEARANCES.GHOST}
                size={Button.SIZES.S}
                onClick={onSecondary}
              >
                View latest correction
              </Button>
            </>
          )}
        </NoticeActions>
      </NoticeBody>
    </Notice>
  );
};

// ═════════════════════════════════════════════════════════════════
// V7 CORRECTION WORKSPACE (full page)
// ═════════════════════════════════════════════════════════════════

const WorkspaceRoot = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  height: 100%;
  min-height: 540px;
`;

const Rail = styled.aside`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  overflow-y: auto;
`;

const RailTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 535;
`;

const Pane = styled.section`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const FakeInput = styled.div`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RolePicker = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RoleItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
`;

export const V7Workspace: React.FC<{ chain: CorrectionChain }> = ({ chain }) => {
  const tip = latestCorrection(chain);
  const isGP = chain.model === 'GP';
  const referenceLabel = isGP ? `${tip.ordinal} (chain tip)` : chain.reference.displayName;

  return (
    <WorkspaceRoot>
      <Rail>
        <RailTitle>Correction chain</RailTitle>
        <Pill tone={isGP ? 'GP' : 'US'}>{isGP ? 'GP · chain' : 'US · linear'}</Pill>
        <ChainView
          chain={chain}
          onReferenceSelect={() => undefined}
          onTipSelect={() => undefined}
          onView={() => undefined}
        />
        <SubText>
          {isGP
            ? 'New correction continues from the tip. Reference is locked.'
            : 'New correction can target the reference run. Existing corrections are visible.'}
        </SubText>
      </Rail>
      <Pane>
        <RailTitle>Create correction</RailTitle>
        <FieldRow>
          <FieldLabel>Reference (auto-selected)</FieldLabel>
          <FakeInput>
            <span>{referenceLabel}</span>
            <Icon type={Icon.TYPES.LOCK_OUTLINE ?? Icon.TYPES.LOCK_FILLED} size={14} />
          </FakeInput>
        </FieldRow>
        <FieldRow>
          <FieldLabel>Entity</FieldLabel>
          <FakeInput>
            <span>{chain.reference.entityDisplayName}</span>
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
          </FakeInput>
        </FieldRow>
        <FieldRow>
          <FieldLabel>Roles to correct</FieldLabel>
          <RolePicker>
            <RoleItem>
              <input type="checkbox" defaultChecked />
              <Atoms.Country
                countryCode={chain.reference.countryCode}
                size={Atoms.Country.SIZES.S}
                onlyFlag
              />
              <span>John Doe — Software Engineer</span>
            </RoleItem>
            <RoleItem>
              <input type="checkbox" />
              <Atoms.Country
                countryCode={chain.reference.countryCode}
                size={Atoms.Country.SIZES.S}
                onlyFlag
              />
              <span>Jane Smith — Marketing Lead</span>
            </RoleItem>
            <RoleItem>
              <input type="checkbox" />
              <Atoms.Country
                countryCode={chain.reference.countryCode}
                size={Atoms.Country.SIZES.S}
                onlyFlag
              />
              <span>Aliyah Khan — Designer</span>
            </RoleItem>
          </RolePicker>
        </FieldRow>
        <FieldRow>
          <FieldLabel>Check date</FieldLabel>
          <FakeInput>
            <span>{chain.reference.payDate}</span>
            <Icon type={Icon.TYPES.CALENDAR_OUTLINE ?? Icon.TYPES.CHEVRON_DOWN} size={14} />
          </FakeInput>
        </FieldRow>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 'auto',
            paddingTop: 16,
          }}
        >
          <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.M}>
            Cancel
          </Button>
          <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M}>
            Continue
          </Button>
        </div>
      </Pane>
    </WorkspaceRoot>
  );
};

// ═════════════════════════════════════════════════════════════════
// V8 SMART ROUTING (no UI — just a toast showing where it would go)
// ═════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const V8Toast = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  animation: ${fadeIn} 200ms ease-out;
`;

const V8ToastBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const V8SmartRouting: React.FC<{ chain: CorrectionChain }> = ({ chain }) => {
  const [clicked, setClicked] = useState<'reference' | 'correction' | 'locked' | null>(null);
  const isGP = chain.model === 'GP';
  const tip = latestCorrection(chain);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SubText>
        Clicking "Create Correction" routes silently based on context. There's no modal. The button
        just does the right thing:
      </SubText>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          appearance={Button.APPEARANCES.PRIMARY}
          size={Button.SIZES.M}
          onClick={() => setClicked('reference')}
        >
          Create Correction (on reference)
        </Button>
        <Button
          appearance={Button.APPEARANCES.OUTLINE}
          size={Button.SIZES.M}
          onClick={() => setClicked('correction')}
        >
          Create Correction (on a correction)
        </Button>
        <Button
          appearance={Button.APPEARANCES.OUTLINE}
          size={Button.SIZES.M}
          onClick={() => setClicked('locked')}
        >
          Try on locked POP run
        </Button>
      </div>

      {clicked === 'reference' && (
        <V8Toast>
          <Icon type={Icon.TYPES.CHECK} size={20} />
          <V8ToastBody>
            <strong>{isGP ? 'Routed to tip' : 'Routed to new correction'}</strong>
            <SubText>
              {isGP
                ? `${tip.ordinal} pre-selected as reference. Admin lands on the role-picker.`
                : 'New correction created with reference run pre-filled. Admin lands on the role-picker.'}
            </SubText>
            <ToastCode>
              {isGP
                ? buildGPRedirectUrl(chain)
                : `/payroll/run/create-correction?referenceRunId=${chain.reference.runId}`}
            </ToastCode>
          </V8ToastBody>
        </V8Toast>
      )}
      {clicked === 'correction' && (
        <V8Toast>
          <Icon type={Icon.TYPES.LINK_HORIZONTAL} size={20} />
          <V8ToastBody>
            <strong>
              {isGP ? 'Routed to chain tip (forced)' : 'Routed to new correction on reference'}
            </strong>
            <SubText>
              {isGP
                ? `You clicked on ${tip.ordinal}, but the only valid action is "continue from tip" — same place.`
                : `Correction-of-correction is not allowed in US. Routed to a new correction on the reference run instead.`}
            </SubText>
          </V8ToastBody>
        </V8Toast>
      )}
      {clicked === 'locked' && (
        <V8Toast>
          <Icon type={Icon.TYPES.LOCK_FILLED} size={20} />
          <V8ToastBody>
            <strong>Blocked — can't correct this run</strong>
            <SubText>
              Plan-of-payment runs (and a few other types) can't be corrected. Toast explains why
              and links to support.
            </SubText>
          </V8ToastBody>
        </V8Toast>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// COMPOSITE — V4 + V5 + V6 together
// ═════════════════════════════════════════════════════════════════

export const CompositeScene: React.FC<{ chain: CorrectionChain }> = ({ chain }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <V6PromotedNotice chain={chain} />
      <PillRow>
        <PillLabel>This row's action</PillLabel>
        <V4SmartPill chain={chain} />
      </PillRow>
      <V5InlineChainStrip chain={chain} defaultOpen />
      <Toast style={{ alignSelf: 'flex-start' }}>
        Composite = notice anchors, pill is the click, strip is the peek-in-place.
      </Toast>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// Dispatcher
// ═════════════════════════════════════════════════════════════════

// For overlay variations — same signature as before.
export const VariationRenderer: React.FC<{
  variation: Variation;
  isOpen: boolean;
  chain: CorrectionChain;
  onClose: () => void;
}> = ({ variation, isOpen, chain, onClose }) => {
  if (variation === 'v1') return <V1Baseline isOpen={isOpen} chain={chain} onClose={onClose} />;
  if (variation === 'v2') return <V2UnifiedModal isOpen={isOpen} chain={chain} onClose={onClose} />;
  if (variation === 'v3') return <V3ChainDrawer isOpen={isOpen} chain={chain} onClose={onClose} />;
  return null;
};

// For full scenes (used by the standalone page).
export const VariationScene: React.FC<{ variation: Variation; chain: CorrectionChain }> = ({
  variation,
  chain,
}) => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  if (variation === 'v1' || variation === 'v2' || variation === 'v3') {
    return (
      <>
        <FocusedRunCardStub chain={chain} onCreateCorrection={() => setOverlayOpen(true)} />
        <VariationRenderer
          variation={variation}
          isOpen={overlayOpen}
          chain={chain}
          onClose={() => setOverlayOpen(false)}
        />
      </>
    );
  }
  if (variation === 'v4') return <V4Scene chain={chain} />;
  if (variation === 'v5') return <V5InlineChainStrip chain={chain} defaultOpen />;
  if (variation === 'v6') return <V6PromotedNotice chain={chain} />;
  if (variation === 'v7') return <V7Workspace chain={chain} />;
  if (variation === 'v8') return <V8SmartRouting chain={chain} />;
  return <CompositeScene chain={chain} />;
};

// ═════════════════════════════════════════════════════════════════
// Run card stub used by overlay variations
// ═════════════════════════════════════════════════════════════════

const Card = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLowest};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  justify-content: space-between;
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const CardSub = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FocusedRunCardStub: React.FC<{
  chain: CorrectionChain;
  onCreateCorrection: () => void;
}> = ({ chain, onCreateCorrection }) => (
  <Card>
    <CardLeft>
      <CardTitle>{chain.reference.displayName}</CardTitle>
      <CardSub>
        {chain.reference.entityDisplayName} · {chain.reference.countryName} ·{' '}
        {chain.reference.numberOfEmployeesInvolved} people · Paid {chain.reference.payDate}
      </CardSub>
      <CardSub>
        This run has <strong>{chain.corrections.length}</strong> existing correction
        {chain.corrections.length > 1 ? 's' : ''}
      </CardSub>
    </CardLeft>
    <Button
      appearance={Button.APPEARANCES.PRIMARY}
      size={Button.SIZES.M}
      onClick={onCreateCorrection}
    >
      {chain.model === 'US' ? 'Make Changes' : 'Create Correction'}
    </Button>
  </Card>
);

// Re-export atoms for consumers (avoid TS unused warnings)
export { Atoms };
