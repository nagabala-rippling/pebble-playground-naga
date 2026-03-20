import React from 'react';
import styled from '@emotion/styled';
import Label from '@rippling/pebble/Label';
import Icon from '@rippling/pebble/Icon';
import Card from '@rippling/pebble/Card';
import { HStack, VStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PayScheduleFormData } from '../types';

interface StepProps {
  formData: PayScheduleFormData;
  onChange: (updates: Partial<PayScheduleFormData>) => void;
}

const OPTIONS = [
  {
    value: false,
    title: 'No, I will manually approve each pay run',
    description: 'You will need to review and approve every pay run before it is submitted.',
  },
  {
    value: true,
    title: 'Yes, automatically approve pay runs',
    description: 'Pay runs will be submitted automatically on the payroll deadline.',
    recommended: true,
  },
];

const Step4AutoApproval: React.FC<StepProps> = ({ formData, onChange }) => {
  const { theme } = usePebbleTheme();

  return (
    <Container>
      <VStack gap={theme.space600}>
        <div>
          <Title>Auto-approval settings</Title>
          <Description>
            Choose whether pay runs should be automatically approved and submitted, or if you
            want to manually review each one before it goes out.
          </Description>
        </div>

        <VStack gap={theme.space400}>
          {OPTIONS.map((option) => (
            <SelectionCard
              key={String(option.value)}
              isSelected={formData.autoApproval === option.value}
              onClick={() => onChange({ autoApproval: option.value })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange({ autoApproval: option.value });
                }
              }}
            >
              <HStack gap={theme.space300} align="flex-start">
                <RadioDot isSelected={formData.autoApproval === option.value} />
                <VStack gap={theme.space100}>
                  <HStack gap={theme.space200} align="center">
                    <CardTitle>{option.title}</CardTitle>
                    {option.recommended && (
                      <Label appearance={Label.APPEARANCES.SUCCESS}>Recommended</Label>
                    )}
                  </HStack>
                  <CardDescription>{option.description}</CardDescription>
                </VStack>
              </HStack>
            </SelectionCard>
          ))}
        </VStack>

        {formData.autoApproval && (
          <InfoCard>
            <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
              <HStack gap={theme.space300} align="flex-start">
                <InfoIcon>
                  <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={20} />
                </InfoIcon>
                <InfoText>
                  Pay runs will be automatically approved and submitted on the payroll deadline
                  date. You can still review and make changes before the deadline.
                </InfoText>
              </HStack>
            </Card.Layout>
          </InfoCard>
        )}
      </VStack>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
`;

const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const Description = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const SelectionCard = styled.div<{ isSelected: boolean }>`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border: 2px solid ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorSurfaceContainerLow : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const RadioDot = styled.div<{ isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
    background-color: ${({ theme, isSelected }) =>
      isSelected ? (theme as StyledTheme).colorPrimary : 'transparent'};
  }
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CardDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const InfoCard = styled.div`
  border-left: 3px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  flex-shrink: 0;
  margin-top: 1px;
`;

const InfoText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export default Step4AutoApproval;
