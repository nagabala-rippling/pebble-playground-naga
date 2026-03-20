import React from 'react';
import styled from '@emotion/styled';
import Card from '@rippling/pebble/Card';
import { VStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PayScheduleFormData, FREQUENCY_LABELS } from '../types';

interface StepReviewProps {
  formData: PayScheduleFormData;
}

const StepReview: React.FC<StepReviewProps> = ({ formData }) => {
  const { theme } = usePebbleTheme();

  const sections = [
    {
      title: 'Basic Info',
      rows: [
        { label: 'Pay schedule name', value: formData.name || '(not set)' },
        { label: 'Employment type', value: formData.employmentType === 'employee' ? 'Employee' : 'Contractor' },
        { label: 'Entity', value: formData.entity },
      ],
    },
    {
      title: 'Pay Details',
      rows: [
        { label: 'Pay frequency', value: FREQUENCY_LABELS[formData.payFrequency] },
        { label: 'Holiday handling', value: formData.holidayHandling },
        { label: 'Arrear days', value: `${formData.arrearDays} ${formData.arrearDaysUnit} days` },
        { label: 'First payment date', value: formData.firstPaymentDate },
        ...(formData.payFrequency === 'semi-monthly'
          ? [
              { label: 'First check day', value: formData.paymentDateDetails.firstCheck || '(not set)' },
              { label: 'Second check day', value: formData.paymentDateDetails.secondCheck || '(not set)' },
            ]
          : []),
      ],
    },
    {
      title: 'Membership',
      rows: [
        {
          label: 'Super groups',
          value: formData.superGroups.length > 0
            ? formData.superGroups.map((sg) => sg.name).join(', ')
            : '(none selected)',
        },
      ],
    },
    {
      title: 'Auto Approval',
      rows: [
        { label: 'Auto-approve pay runs', value: formData.autoApproval ? 'Yes' : 'No' },
      ],
    },
  ];

  return (
    <Container>
      <Title>Review your pay schedule</Title>
      <Description>Please review the details below before saving.</Description>
      <VStack gap={theme.space400}>
        {sections.map((section) => (
          <Card.Layout key={section.title} padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap={theme.space300}>
              <SectionTitle>{section.title}</SectionTitle>
              {section.rows.map((row) => (
                <Row key={row.label}>
                  <RowLabel>{row.label}</RowLabel>
                  <RowValue>{row.value}</RowValue>
                </Row>
              ))}
            </VStack>
          </Card.Layout>
        ))}
      </VStack>
    </Container>
  );
};

const Container = styled.div`
  max-width: 640px;
`;

const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const Description = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const RowLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const RowValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

export default StepReview;
