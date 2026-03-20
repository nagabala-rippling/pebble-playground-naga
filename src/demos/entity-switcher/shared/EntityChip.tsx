import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';

interface EntityChipProps {
  flag: string;
  name: string;
  onRemove?: () => void;
}

const EntityChip: React.FC<EntityChipProps> = ({ flag, name, onRemove }) => {
  const { theme } = useTheme();

  return (
    <ChipWrapper theme={theme}>
      <span>{flag}</span>
      <ChipText theme={theme}>{name}</ChipText>
      {onRemove && (
        <RemoveButton theme={theme} onClick={onRemove} aria-label={`Remove ${name}`}>
          <Icon type={Icon.TYPES.CLOSE} size={12} />
        </RemoveButton>
      )}
    </ChipWrapper>
  );
};

const ChipWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  white-space: nowrap;
`;

const ChipText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 2px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export default EntityChip;
