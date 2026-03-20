import React, { useState } from 'react';
import styled from '@emotion/styled';
import Input from '@rippling/pebble/Inputs';
import Card from '@rippling/pebble/Card';
import Label from '@rippling/pebble/Label';
import Tabs from '@rippling/pebble/Tabs';
import TableBasic from '@rippling/pebble/TableBasic';
import Avatar from '@rippling/pebble/Avatar';
import { HStack, VStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PayScheduleFormData, DUMMY_SUPER_GROUPS, DUMMY_EMPLOYEES } from '../types';

interface StepProps {
  formData: PayScheduleFormData;
  onChange: (updates: Partial<PayScheduleFormData>) => void;
}

const Step3Membership: React.FC<StepProps> = ({ formData, onChange }) => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);

  const included = DUMMY_EMPLOYEES.filter(e => e.status === 'included');
  const notIncluded = DUMMY_EMPLOYEES.filter(e => e.status === 'not-included');
  const displayedEmployees = activeTab === 0 ? included : notIncluded;

  const superGroupOptions = DUMMY_SUPER_GROUPS.map(sg => ({
    label: sg.name,
    value: sg.id,
  }));

  return (
    <TwoColumnLayout>
      <LeftColumn>
        <VStack gap={theme.space600}>
          <div>
            <SectionTitle>Choose whom this schedule applies to</SectionTitle>
            <ChipRow>
              <Label appearance={Label.APPEARANCES.NEUTRAL} size={Label.SIZES.S}>
                {`Entity: ${formData.entity}`}
              </Label>
              <Label appearance={Label.APPEARANCES.NEUTRAL} size={Label.SIZES.S}>
                {`Type: ${formData.employmentType === 'employee' ? 'Employee' : 'Contractor'}`}
              </Label>
            </ChipRow>
          </div>

          <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
            <VStack gap={theme.space400}>
              <MembershipTitle>Membership rules</MembershipTitle>
              <FieldLabel>Applies to</FieldLabel>
              <Input.Select
                list={superGroupOptions}
                value={formData.superGroups[0]?.id || ''}
                onChange={(val: any) => {
                  const id = val?.value ?? val;
                  const group = DUMMY_SUPER_GROUPS.find(sg => sg.id === id);
                  if (group) onChange({ superGroups: [group] });
                }}
              />
            </VStack>
          </Card.Layout>
        </VStack>
      </LeftColumn>

      <RightColumn>
        <Card.Layout padding={Card.Layout.PADDINGS.PX_16}>
          <VStack gap={theme.space400}>
            <PreviewTitle>Preview the people this schedule applies to</PreviewTitle>
            <Tabs.SWITCH
              activeIndex={activeTab}
              onChange={(index) => setActiveTab(Number(index))}
            >
              <Tabs.Tab title={`Included (${included.length})`} />
              <Tabs.Tab title={`Not included (${notIncluded.length})`} />
            </Tabs.SWITCH>

            <TableBasic>
              <TableBasic.THead>
                <TableBasic.Tr>
                  <TableBasic.Th>Employee</TableBasic.Th>
                  <TableBasic.Th>Department</TableBasic.Th>
                </TableBasic.Tr>
              </TableBasic.THead>
              <TableBasic.TBody>
                {displayedEmployees.map(emp => (
                  <TableBasic.Tr key={emp.id}>
                    <TableBasic.Td>
                      <HStack gap="0.5rem" align="center">
                        <Avatar title={emp.name} size={Avatar.SIZES.S} />
                        <VStack gap="0">
                          <EmployeeName>{emp.name}</EmployeeName>
                          <EmployeeRole>{emp.role}</EmployeeRole>
                        </VStack>
                      </HStack>
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <DeptText>{emp.department}</DeptText>
                    </TableBasic.Td>
                  </TableBasic.Tr>
                ))}
              </TableBasic.TBody>
            </TableBasic>
          </VStack>
        </Card.Layout>
      </RightColumn>
    </TwoColumnLayout>
  );
};

const TwoColumnLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

const LeftColumn = styled.div`flex: 1.2; min-width: 0;`;
const RightColumn = styled.div`flex: 1; min-width: 300px;`;

const ChipRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-top: ${({ theme }) => (theme as StyledTheme).space300};
`;

const FieldLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const MembershipTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PreviewTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const EmployeeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const EmployeeRole = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DeptText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export default Step3Membership;
