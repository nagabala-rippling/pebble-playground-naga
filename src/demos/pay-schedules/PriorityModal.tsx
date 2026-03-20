import React, { useState, useEffect } from 'react';
import Modal from '@rippling/pebble/Modal';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';
import styled from '@emotion/styled';
import { ReactSortable } from 'react-sortablejs';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { HStack } from '@rippling/pebble/Layout/Stack';
import { PaySchedule, FREQUENCY_LABELS } from './types';

interface PriorityModalProps {
  isVisible: boolean;
  schedules: PaySchedule[];
  onCancel: () => void;
  onSave: (reorderedIds: string[]) => void;
}

const PriorityModal: React.FC<PriorityModalProps> = ({
  isVisible,
  schedules,
  onCancel,
  onSave,
}) => {
  const { theme } = usePebbleTheme();
  const [list, setList] = useState(
    [...schedules].sort((a, b) => a.priority - b.priority).map((s) => ({ ...s, id: s.id }))
  );

  useEffect(() => {
    setList(
      [...schedules].sort((a, b) => a.priority - b.priority).map((s) => ({ ...s, id: s.id }))
    );
  }, [schedules]);

  const handleSave = () => {
    onSave(list.map((item) => item.id));
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onCancel}
      title="Change pay schedule priority"
      aria-modal="true"
    >
      <ModalBody theme={theme}>
        <Description theme={theme}>
          Drag and drop to reorder pay schedules. The highest priority schedule (top of list)
          will be applied first when an employee matches multiple schedules.
        </Description>

        <ReactSortable
          list={list}
          setList={setList}
          handle=".drag-handle"
          animation={200}
        >
          {list.map((item, index) => (
            <DragItem key={item.id} theme={theme}>
              <HStack gap="0.75rem" align="center">
                <DragHandle className="drag-handle" theme={theme}>
                  <Icon type={Icon.TYPES.DRAG} size={16} />
                </DragHandle>
                <PriorityNumber theme={theme}>{index + 1}</PriorityNumber>
                <ItemDetails>
                  <ItemName theme={theme}>{item.name}</ItemName>
                  <HStack gap="0.5rem" align="center">
                    <Label appearance={Label.APPEARANCES.NEUTRAL}>
                      {FREQUENCY_LABELS[item.payFrequency]}
                    </Label>
                    <Label
                      appearance={
                        item.employmentType === 'contractor'
                          ? Label.APPEARANCES.PRIMARY
                          : Label.APPEARANCES.NEUTRAL
                      }
                    >
                      {item.employmentType === 'contractor' ? 'Contractor' : 'Employee'}
                    </Label>
                  </HStack>
                </ItemDetails>
              </HStack>
            </DragItem>
          ))}
        </ReactSortable>
      </ModalBody>
      <Modal.Footer>
        <Button
          appearance={Button.APPEARANCES.OUTLINE}
          onClick={onCancel}
          size={Button.SIZES.M}
        >
          Cancel
        </Button>
        <Button
          appearance={Button.APPEARANCES.PRIMARY}
          onClick={handleSave}
          size={Button.SIZES.M}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ModalBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Description = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const DragItem = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  user-select: none;
`;

const DragHandle = styled.div`
  cursor: grab;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;

  &:active {
    cursor: grabbing;
  }
`;

const PriorityNumber = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  min-width: 1.5rem;
  text-align: center;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export default PriorityModal;
