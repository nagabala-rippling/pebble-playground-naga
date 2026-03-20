import React from 'react';
import styled from '@emotion/styled';
import Input from '@rippling/pebble/Inputs';
import Icon from '@rippling/pebble/Icon';
import Card from '@rippling/pebble/Card';
import { HStack, VStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PayScheduleFormData, EmploymentType } from '../types';

interface StepProps {
  formData: PayScheduleFormData;
  onChange: (updates: Partial<PayScheduleFormData>) => void;
}

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; icon: string; description: string }[] = [
  { value: 'employee', label: 'Employee', icon: 'person', description: 'W-2 employees on payroll' },
  { value: 'contractor', label: 'Contractor', icon: 'briefcase', description: '1099 independent contractors' },
];

const Step1BasicInfo: React.FC<StepProps> = ({ formData, onChange }) => {
  const { theme } = usePebbleTheme();

  return (
    <Container>
      <VStack gap={theme.space600}>
        <div>
          <SectionLabel>Pay Schedule Name</SectionLabel>
          <Input.Text
            value={formData.name}
            onChange={(e: any) => onChange({ name: e?.target?.value ?? e })}
            size={Input.Text.SIZES.M}
            placeholder="e.g., Salaried Semi-Monthly"
          />
        </div>

        <div>
          <SectionLabel>Employment Type</SectionLabel>
          <HStack gap={theme.space400}>
            {EMPLOYMENT_OPTIONS.map((option) => (
              <SelectionCard
                key={option.value}
                isSelected={formData.employmentType === option.value}
                onClick={() => onChange({ employmentType: option.value })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange({ employmentType: option.value });
                  }
                }}
              >
                <HStack gap={theme.space300} align="center">
                  <RadioDot isSelected={formData.employmentType === option.value} />
                  <VStack gap={theme.space100}>
                    <CardTitle>{option.label}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </VStack>
                </HStack>
              </SelectionCard>
            ))}
          </HStack>
        </div>

        <div>
          <SectionLabel>Account Details</SectionLabel>
          <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
            <VStack gap={theme.space300}>
              <InfoRow>
                <InfoLabel>Funding type</InfoLabel>
                <InfoValue>Two-day</InfoValue>
              </InfoRow>
              <Divider />
              <InfoRow>
                <InfoLabel>Payment method</InfoLabel>
                <HStack gap={theme.space200} align="center">
                  <Icon type={Icon.TYPES.BANK_OUTLINE} size={16} />
                  <InfoValue>Chase Business ****4829</InfoValue>
                </HStack>
              </InfoRow>
            </VStack>
          </Card.Layout>
        </div>
      </VStack>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
`;

const SectionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SelectionCard = styled.div<{ isSelected: boolean }>`
  flex: 1;
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

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const InfoValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export default Step1BasicInfo;
