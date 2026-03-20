import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import TableBasic from '@rippling/pebble/TableBasic';
import Input from '@rippling/pebble/Inputs';
import Button from '@rippling/pebble/Button';
import Card from '@rippling/pebble/Card';
import Tabs from '@rippling/pebble/Tabs';
import Tip from '@rippling/pebble/Tip';
import { HStack } from '@rippling/pebble/Layout/Stack';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CardHeaderLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SearchFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 320px;
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmployeeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const EmployeeRole = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const HeaderLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const PlaceholderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TableWrapper = styled.div`
  overflow-x: auto;

  table {
    border-collapse: separate;
    border-spacing: 0;
    min-width: 100%;
  }

  thead th {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow} !important;
    ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant} !important;
  }

  tbody td {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    vertical-align: middle;
    padding-top: ${({ theme }) => (theme as StyledTheme).space300};
    padding-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  }

  thead th:first-of-type,
  tbody td:first-of-type {
    min-width: 240px;
    width: 240px;
  }

  thead th:nth-of-type(n+2),
  tbody td:nth-of-type(n+2) {
    min-width: 200px;
  }

  tbody td [class*='SelectWrapper'],
  tbody td [class*='InputWrapper'],
  tbody td [class*='selectContainer'] {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }
`;

interface EmployeeRow {
  id: string;
  name: string;
  initials: string;
  jobTitle: string;
  department: string;
  payRunInclusion: string;
  paymentType: string;
  paystubNote: string;
  taxWithholdings: string;
}

const EMPLOYEES: EmployeeRow[] = [
  {
    id: '1',
    name: 'Isaac Ziemann',
    initials: 'IZ',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    payRunInclusion: 'include',
    paymentType: 'direct-deposit',
    paystubNote: '',
    taxWithholdings: 'original',
  },
];

const PAY_RUN_INCLUSION_OPTIONS = [
  { label: 'Include in this pay run', value: 'include' },
  { label: 'Roll over to next pay run', value: 'roll-over' },
  { label: 'Remove from this pay run', value: 'remove' },
];

const PAYMENT_TYPE_OPTIONS = [
  { label: 'Direct Deposit', value: 'direct-deposit' },
  { label: 'Pay Manually', value: 'pay-manually' },
];

const PAYSTUB_NOTE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Commission', value: 'commission' },
  { label: 'Reimbursement', value: 'reimbursement' },
];

const TAX_WITHHOLDINGS_OPTIONS = [
  { label: 'Use original withholdings and exemptions', value: 'original' },
  { label: 'Override withholdings', value: 'override' },
];

const EmployeePayRunTablesDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<EmployeeRow[]>(EMPLOYEES);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q),
    );
  }, [employees, searchQuery]);

  const updateEmployee = (id: string, field: keyof EmployeeRow, value: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp)),
    );
  };

  return (
    <PageContainer theme={theme}>
      <ContentWrapper theme={theme}>
        <Tabs
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(Number(index))}
        >
          <Tabs.Tab title="Earnings" />
          <Tabs.Tab title="Deductions" />
          <Tabs.Tab title="Settings" />
        </Tabs>

        {activeTab === 0 && (
          <PlaceholderContent theme={theme}>Earnings tab content</PlaceholderContent>
        )}
        {activeTab === 1 && (
          <PlaceholderContent theme={theme}>Deductions tab content</PlaceholderContent>
        )}
        {activeTab === 2 && (
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <CardHeaderRow theme={theme}>
              <CardHeaderLabel theme={theme}>Roles · {filteredEmployees.length}</CardHeaderLabel>
              <HStack gap="0.25rem">
                <Button.Icon
                  icon={Icon.TYPES.SETTINGS_OUTLINE}
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.S}
                  aria-label="Settings"
                />
                <Button.Icon
                  icon={Icon.TYPES.EXPAND}
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.S}
                  aria-label="Expand"
                />
              </HStack>
            </CardHeaderRow>

            <SearchFilterRow theme={theme}>
              <SearchWrapper>
                <Input.Text
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e?.target?.value ?? e)}
                  placeholder="Search by employee"
                  size={Input.Text.SIZES.S}
                  prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
                />
              </SearchWrapper>
              <Button
                icon={Icon.TYPES.FILTER}
                appearance={Button.APPEARANCES.OUTLINE}
                size={Button.SIZES.S}
              >
                Filter
              </Button>
            </SearchFilterRow>

            <TableWrapper theme={theme}>
              <TableBasic>
                <TableBasic.THead>
                  <TableBasic.Tr>
                    <TableBasic.Th>Employee</TableBasic.Th>
                    <TableBasic.Th>Pay run inclusion</TableBasic.Th>
                    <TableBasic.Th>Payment type</TableBasic.Th>
                    <TableBasic.Th>
                      <HeaderLabel theme={theme}>
                        Paystub note
                        <Tip content="Optional note that appears on the employee's paystub" placement={Tip.PLACEMENTS.TOP}>
                          <span style={{ display: 'inline-flex' }}>
                            <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                          </span>
                        </Tip>
                      </HeaderLabel>
                    </TableBasic.Th>
                    <TableBasic.Th>
                      <HeaderLabel theme={theme}>
                        Tax withholdings
                        <Tip content="Controls whether to use the employee's default tax withholdings or override them for this pay run" placement={Tip.PLACEMENTS.TOP}>
                          <span style={{ display: 'inline-flex' }}>
                            <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                          </span>
                        </Tip>
                      </HeaderLabel>
                    </TableBasic.Th>
                  </TableBasic.Tr>
                </TableBasic.THead>
                <TableBasic.TBody>
                  {filteredEmployees.map((employee) => (
                    <TableBasic.Tr key={employee.id}>
                      <TableBasic.Td>
                        <EmployeeCell theme={theme}>
                          <AvatarCircle theme={theme}>{employee.initials}</AvatarCircle>
                          <EmployeeInfo>
                            <EmployeeName theme={theme}>{employee.name}</EmployeeName>
                            <EmployeeRole theme={theme}>
                              {employee.jobTitle}, {employee.department}
                            </EmployeeRole>
                          </EmployeeInfo>
                        </EmployeeCell>
                      </TableBasic.Td>
                      <TableBasic.Td>
                        <Input.Select
                          list={PAY_RUN_INCLUSION_OPTIONS}
                          value={employee.payRunInclusion}
                          onChange={(val: unknown) =>
                            updateEmployee(employee.id, 'payRunInclusion', val as string)
                          }
                          size={Input.Select.SIZES.S}
                        />
                      </TableBasic.Td>
                      <TableBasic.Td>
                        <Input.Select
                          list={PAYMENT_TYPE_OPTIONS}
                          value={employee.paymentType}
                          onChange={(val: unknown) =>
                            updateEmployee(employee.id, 'paymentType', val as string)
                          }
                          size={Input.Select.SIZES.S}
                        />
                      </TableBasic.Td>
                      <TableBasic.Td>
                        <Input.Select
                          list={PAYSTUB_NOTE_OPTIONS}
                          value={employee.paystubNote}
                          onChange={(val: unknown) =>
                            updateEmployee(employee.id, 'paystubNote', val as string)
                          }
                          size={Input.Select.SIZES.S}
                          placeholder="Select"
                        />
                      </TableBasic.Td>
                      <TableBasic.Td>
                        <Input.Select
                          list={TAX_WITHHOLDINGS_OPTIONS}
                          value={employee.taxWithholdings}
                          onChange={(val: unknown) =>
                            updateEmployee(employee.id, 'taxWithholdings', val as string)
                          }
                          size={Input.Select.SIZES.S}
                        />
                      </TableBasic.Td>
                    </TableBasic.Tr>
                  ))}
                </TableBasic.TBody>
              </TableBasic>
            </TableWrapper>
          </Card.Layout>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default EmployeePayRunTablesDemo;
