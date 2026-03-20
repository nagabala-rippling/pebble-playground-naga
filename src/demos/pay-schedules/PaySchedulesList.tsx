import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import Tabs from '@rippling/pebble/Tabs';
import TableBasic from '@rippling/pebble/TableBasic';
import Chip from '@rippling/pebble/Chip';
import Dropdown from '@rippling/pebble/Dropdown';
import ObjectUI from '@rippling/pebble/ObjectUI';
import ActionCard from '@rippling/pebble/ActionCard';
import { PaySchedule, FREQUENCY_LABELS, EmploymentType } from './types';

interface PaySchedulesListProps {
  schedules: PaySchedule[];
  onAddSchedule: () => void;
  onEditSchedule: (schedule: PaySchedule) => void;
  onDeleteSchedule: (schedule: PaySchedule) => void;
  onChangePriority: () => void;
}

const EMPLOYMENT_TABS: EmploymentType[] = ['employee', 'contractor'];

const PaySchedulesList: React.FC<PaySchedulesListProps> = ({
  schedules,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onChangePriority,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchedules = useMemo(() => {
    const typeFilter = EMPLOYMENT_TABS[activeTabIndex];
    let filtered = schedules.filter(s => s.employmentType === typeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(query));
    }

    return filtered.sort((a, b) => a.priority - b.priority);
  }, [schedules, activeTabIndex, searchQuery]);

  const handleMenuAction = (schedule: PaySchedule, value: string) => {
    if (value === 'edit') {
      onEditSchedule(schedule);
    } else if (value === 'delete') {
      onDeleteSchedule(schedule);
    }
  };

  if (schedules.length === 0) {
    return (
      <ActionCard
        icon={Icon.TYPES.CALENDAR_OUTLINE}
        title="No pay schedules yet"
        caption="Create your first pay schedule to define how and when employees get paid."
        primaryAction={{ title: 'Add a pay schedule', onClick: onAddSchedule }}
      />
    );
  }

  return (
    <ObjectUI.Template>
      <ObjectUI.Header
        title="Pay schedules"
        caption="Create custom pay schedules to override default pay schedules"
        actions={{
          limit: 3,
          list: [
            {
              type: ObjectUI.Header.ACTION_TYPES.BUTTON,
              props: {
                children: 'Change priority',
                onClick: onChangePriority,
                appearance: Button.APPEARANCES.OUTLINE,
                icon: {
                  type: Icon.TYPES.HIGH_PRIORITY,
                  alignment: Button.ICON_ALIGNMENTS.LEFT,
                },
              },
            },
            {
              type: ObjectUI.Header.ACTION_TYPES.BUTTON,
              props: {
                children: 'Add a pay schedule',
                onClick: onAddSchedule,
                appearance: Button.APPEARANCES.PRIMARY,
                icon: {
                  type: Icon.TYPES.ADD_CIRCLE_OUTLINE,
                  alignment: Button.ICON_ALIGNMENTS.LEFT,
                },
              },
            },
          ],
        }}
      />
      <ObjectUI.Content>
        <ToolbarArea>
          <Tabs.SWITCH
            activeIndex={activeTabIndex}
            onChange={(index) => setActiveTabIndex(Number(index))}
            isCompact
          >
            <Tabs.Tab title="Employees" />
            <Tabs.Tab title="Contractors" />
          </Tabs.SWITCH>

          <SearchWrapper>
            <Input.Text
              placeholder="Search for a schedule"
              value={searchQuery}
              onChange={setSearchQuery}
              size={Input.Text.SIZES.S}
              prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
            />
          </SearchWrapper>
        </ToolbarArea>

        <FixedTable>
          <TableBasic.THead>
            <TableBasic.Tr>
              <TableBasic.Th style={{ width: 48 }}>#</TableBasic.Th>
              <TableBasic.Th style={{ width: '25%' }}>Name</TableBasic.Th>
              <TableBasic.Th style={{ width: '15%' }}>Pay frequency</TableBasic.Th>
              <TableBasic.Th style={{ width: '15%' }}>Auto approval</TableBasic.Th>
              <TableBasic.Th>Applies to</TableBasic.Th>
              <TableBasic.Th style={{ width: 120 }} />
            </TableBasic.Tr>
          </TableBasic.THead>
          <TableBasic.TBody>
            {filteredSchedules.map((schedule, index) => (
              <TableBasic.Tr key={schedule.id}>
                <TableBasic.Td>
                  <BoldText>{index + 1}</BoldText>
                </TableBasic.Td>
                <TableBasic.Td>
                  <BoldText>{schedule.name}</BoldText>
                </TableBasic.Td>
                <TableBasic.Td>
                  {FREQUENCY_LABELS[schedule.payFrequency]}
                </TableBasic.Td>
                <TableBasic.Td>
                  {schedule.autoApproval ? 'Yes' : 'No'}
                </TableBasic.Td>
                <TableBasic.Td>
                  <ChipGroup>
                    {schedule.superGroups.map((sg) => (
                      <Chip
                        key={sg.id}
                        size={Chip.SIZES.S}
                        appearance={Chip.APPEARANCES.NEUTRAL}
                        icon={{
                          type: Icon.TYPES.USER_OUTLINE,
                          alignment: Chip.ICON_ALIGNMENTS.LEFT,
                        }}
                      >
                        {sg.name}
                      </Chip>
                    ))}
                  </ChipGroup>
                </TableBasic.Td>
                <TableBasic.Td>
                  <RowActions>
                    <Button
                      appearance={Button.APPEARANCES.OUTLINE}
                      size={Button.SIZES.S}
                      onClick={() => onEditSchedule(schedule)}
                      icon={{
                        type: Icon.TYPES.EDIT_OUTLINE,
                        alignment: Button.ICON_ALIGNMENTS.LEFT,
                      }}
                    >
                      Edit
                    </Button>
                    <Dropdown
                      list={[
                        { label: 'View pay periods', leftIconType: Icon.TYPES.CALENDAR_OUTLINE, value: 'preview' },
                        { label: 'Edit auto approval', leftIconType: Icon.TYPES.APPROVAL_OUTLINE, value: 'edit-approval' },
                        { label: 'Delete', leftIconType: Icon.TYPES.TRASH_OUTLINE, value: 'delete' },
                      ]}
                      onChange={(value) => handleMenuAction(schedule, value as string)}
                      shouldAutoClose
                      placement="bottom-end"
                      isPositionFixed
                    >
                      <Button.Icon
                        icon={Icon.TYPES.MORE_VERTICAL}
                        size={Button.SIZES.S}
                        appearance={Button.APPEARANCES.GHOST}
                        aria-label="More options"
                      />
                    </Dropdown>
                  </RowActions>
                </TableBasic.Td>
              </TableBasic.Tr>
            ))}
          </TableBasic.TBody>
        </FixedTable>
      </ObjectUI.Content>
    </ObjectUI.Template>
  );
};

const ToolbarArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SearchWrapper = styled.div`
  max-width: 280px;
`;

const FixedTable = styled(TableBasic)`
  table-layout: fixed;
  width: 100%;
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  justify-content: flex-end;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const BoldText = styled.span`
  font-weight: 600;
`;

export default PaySchedulesList;
