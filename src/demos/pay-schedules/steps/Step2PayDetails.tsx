import React from 'react';
import styled from '@emotion/styled';
import Input from '@rippling/pebble/Inputs';
import Label from '@rippling/pebble/Label';
import Card from '@rippling/pebble/Card';
import { HStack, VStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PayScheduleFormData, PayFrequency, FREQUENCY_LABELS } from '../types';

interface StepProps {
  formData: PayScheduleFormData;
  onChange: (updates: Partial<PayScheduleFormData>) => void;
}

const FREQUENCY_OPTIONS: { value: PayFrequency; recommended?: boolean }[] = [
  { value: 'semi-monthly', recommended: true },
  { value: 'weekly' },
  { value: 'bi-weekly' },
  { value: 'monthly' },
];

const HOLIDAY_OPTIONS = [
  { label: 'Previous business day', value: 'Previous business day' },
  { label: 'Next business day', value: 'Next business day' },
  { label: 'Closest business day', value: 'Closest business day' },
];

const ARREAR_UNIT_OPTIONS = [
  { label: 'Calendar days', value: 'calendar' },
  { label: 'Business days', value: 'business' },
];

const DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => ({
  label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}`,
  value: String(i + 1),
}));

const APRIL_2026 = {
  year: 2026, month: 3, // 0-indexed
  days: 30,
  startDay: 3, // Wednesday
};

const PAY_DATES = [15, 30];
const DEADLINE_DATES = [13, 28];
const PERIOD_START_DATES = [1, 16];

const Step2PayDetails: React.FC<StepProps> = ({ formData, onChange }) => {
  const { theme } = usePebbleTheme();

  const renderCalendar = () => {
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < APRIL_2026.startDay; i++) {
      cells.push(<CalendarCell key={`empty-${i}`} />);
    }

    for (let day = 1; day <= APRIL_2026.days; day++) {
      const isPay = PAY_DATES.includes(day);
      const isDeadline = DEADLINE_DATES.includes(day);
      const isPeriodStart = PERIOD_START_DATES.includes(day);

      cells.push(
        <CalendarCell key={day} isPay={isPay} isDeadline={isDeadline} isPeriodStart={isPeriodStart}>
          {day}
        </CalendarCell>
      );
    }

    return (
      <CalendarCard>
        <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
          <VStack gap={theme.space300}>
            <CalendarTitle>April 2026</CalendarTitle>
            <CalendarGrid>
              {dayHeaders.map(d => <DayHeader key={d}>{d}</DayHeader>)}
              {cells}
            </CalendarGrid>
            <Legend>
              <LegendItem><LegendDot color={theme.colorPrimaryContainer} />Pay period start</LegendItem>
              <LegendItem><LegendDot color={theme.colorWarningContainer} />Payroll deadline</LegendItem>
              <LegendItem><LegendDot color={theme.colorSuccessContainer} />Check date</LegendItem>
            </Legend>
          </VStack>
        </Card.Layout>
      </CalendarCard>
    );
  };

  return (
    <TwoColumnLayout>
      <LeftColumn>
        <VStack gap={theme.space600}>
          <div>
            <SectionLabel>Pay Frequency</SectionLabel>
            <FrequencyGrid>
              {FREQUENCY_OPTIONS.map(opt => (
                <SelectionCard
                  key={opt.value}
                  isSelected={formData.payFrequency === opt.value}
                  onClick={() => onChange({ payFrequency: opt.value })}
                  role="button"
                  tabIndex={0}
                >
                  <HStack gap={theme.space300} align="center">
                    <RadioDot isSelected={formData.payFrequency === opt.value} />
                    <HStack gap={theme.space200} align="center">
                      <CardLabel>{FREQUENCY_LABELS[opt.value]}</CardLabel>
                      {opt.recommended && (
                        <Label appearance={Label.APPEARANCES.SUCCESS} size={Label.SIZES.S}>Recommended</Label>
                      )}
                    </HStack>
                  </HStack>
                </SelectionCard>
              ))}
            </FrequencyGrid>
          </div>

          <div>
            <FieldLabel>Holiday / weekend handling</FieldLabel>
            <Input.Select
              list={HOLIDAY_OPTIONS}
              value={formData.holidayHandling}
              onChange={(val: any) => onChange({ holidayHandling: val?.value ?? val })}
            />
          </div>

          <HStack gap={theme.space400}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Arrear days unit</FieldLabel>
              <Input.Select
                list={ARREAR_UNIT_OPTIONS}
                value={formData.arrearDaysUnit}
                onChange={(val: any) => onChange({ arrearDaysUnit: val?.value ?? val })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Arrear days</FieldLabel>
              <Input.Text
                value={String(formData.arrearDays)}
                onChange={(e: any) => {
                  const v = parseInt(e?.target?.value ?? e, 10);
                  if (!isNaN(v)) onChange({ arrearDays: v });
                }}
                size={Input.Text.SIZES.M}
              />
            </div>
          </HStack>

          {formData.payFrequency === 'semi-monthly' && (
            <HStack gap={theme.space400}>
              <div style={{ flex: 1 }}>
                <FieldLabel>First check day</FieldLabel>
                <Input.Select
                  list={DAY_OPTIONS}
                  value={formData.paymentDateDetails.firstCheck || '15'}
                  onChange={(val: any) => onChange({
                    paymentDateDetails: { ...formData.paymentDateDetails, firstCheck: val?.value ?? val },
                  })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Second check day</FieldLabel>
                <Input.Select
                  list={DAY_OPTIONS}
                  value={formData.paymentDateDetails.secondCheck || '30'}
                  onChange={(val: any) => onChange({
                    paymentDateDetails: { ...formData.paymentDateDetails, secondCheck: val?.value ?? val },
                  })}
                />
              </div>
            </HStack>
          )}
        </VStack>
      </LeftColumn>

      <RightColumn>
        {renderCalendar()}
        <UpcomingCard>
          <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
            <VStack gap={theme.space200}>
              <UpcomingTitle>Upcoming pay dates</UpcomingTitle>
              <UpcomingRow><UpcomingLabel>Apr 15, 2026</UpcomingLabel><UpcomingValue>Check date</UpcomingValue></UpcomingRow>
              <UpcomingRow><UpcomingLabel>Apr 30, 2026</UpcomingLabel><UpcomingValue>Check date</UpcomingValue></UpcomingRow>
              <UpcomingRow><UpcomingLabel>May 15, 2026</UpcomingLabel><UpcomingValue>Check date</UpcomingValue></UpcomingRow>
            </VStack>
          </Card.Layout>
        </UpcomingCard>
      </RightColumn>
    </TwoColumnLayout>
  );
};

const TwoColumnLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

const LeftColumn = styled.div`flex: 3; min-width: 0;`;
const RightColumn = styled.div`flex: 2; min-width: 280px;`;

const FieldLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SectionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const FrequencyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SelectionCard = styled.div<{ isSelected: boolean }>`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 2px solid ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorSurfaceContainerLow : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  &:hover { border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary}; }
`;

const RadioDot = styled.div<{ isSelected: boolean }>`
  width: 16px; height: 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  &::after {
    content: ''; width: 8px; height: 8px;
    border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
    background-color: ${({ theme, isSelected }) =>
      isSelected ? (theme as StyledTheme).colorPrimary : 'transparent'};
  }
`;

const CardLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CalendarCard = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CalendarTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
`;

const DayHeader = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const CalendarCell = styled.div<{ isPay?: boolean; isDeadline?: boolean; isPeriodStart?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space100};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme, isPay, isDeadline, isPeriodStart }) =>
    isPay ? (theme as StyledTheme).colorSuccessContainer
    : isDeadline ? (theme as StyledTheme).colorWarningContainer
    : isPeriodStart ? (theme as StyledTheme).colorPrimaryContainer
    : 'transparent'};
  min-height: 28px;
  display: flex; align-items: center; justify-content: center;
`;

const Legend = styled.div`
  display: flex; flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LegendItem = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex; align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LegendDot = styled.div<{ color: string }>`
  width: 10px; height: 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ color }) => color};
`;

const UpcomingCard = styled.div``;

const UpcomingTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const UpcomingRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const UpcomingLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const UpcomingValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export default Step2PayDetails;
