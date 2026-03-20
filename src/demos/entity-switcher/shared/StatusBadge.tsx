import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const VARIANT_MAP: Record<string, BadgeVariant> = {
  Approved: 'success',
  Active: 'success',
  Configured: 'success',
  Completed: 'neutral',
  Late: 'error',
  Critical: 'error',
  Overdue: 'error',
  High: 'warning',
  Pending: 'warning',
  'Not started': 'warning',
  Processing: 'info',
  Medium: 'info',
  Low: 'neutral',
};

export const getVariantForStatus = (status: string): BadgeVariant =>
  VARIANT_MAP[status] ?? 'neutral';

const StatusBadge: React.FC<StatusBadgeProps> = ({ children, variant = 'neutral' }) => {
  const { theme } = useTheme();

  return (
    <Badge theme={theme} variant={variant}>
      <Dot theme={theme} variant={variant} />
      {children}
    </Badge>
  );
};

const colorMap = (theme: StyledTheme, variant: BadgeVariant, property: 'bg' | 'dot' | 'text') => {
  const map: Record<BadgeVariant, Record<string, string>> = {
    success: { bg: theme.colorSuccessContainer, dot: theme.colorSuccess, text: theme.colorSuccess },
    error: { bg: theme.colorErrorContainer, dot: theme.colorError, text: theme.colorError },
    warning: { bg: theme.colorWarningContainer || theme.colorSurfaceContainerHigh, dot: theme.colorWarning || theme.colorOnSurfaceVariant, text: theme.colorWarning || theme.colorOnSurfaceVariant },
    info: { bg: theme.colorPrimaryContainer, dot: theme.colorPrimary, text: theme.colorPrimary },
    neutral: { bg: theme.colorSurfaceContainerLow, dot: theme.colorOnSurfaceVariant, text: theme.colorOnSurfaceVariant },
  };
  return map[variant][property];
};

const Badge = styled.span<{ variant: BadgeVariant }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme, variant }) => colorMap(theme as StyledTheme, variant, 'bg')};
  color: ${({ theme, variant }) => colorMap(theme as StyledTheme, variant, 'text')};
  white-space: nowrap;
`;

const Dot = styled.span<{ variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme, variant }) => colorMap(theme as StyledTheme, variant, 'dot')};
  flex-shrink: 0;
`;

export default StatusBadge;
