import React from 'react';
import Modal from '@rippling/pebble/Modal';
import Button from '@rippling/pebble/Button';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';

interface DeleteScheduleModalProps {
  isVisible: boolean;
  scheduleName: string;
  assignedEmployeeCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteScheduleModal: React.FC<DeleteScheduleModalProps> = ({
  isVisible,
  scheduleName,
  assignedEmployeeCount,
  onCancel,
  onConfirm,
}) => {
  const { theme } = usePebbleTheme();

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onCancel}
      title="Delete pay schedule?"
      aria-modal="true"
    >
      <ModalBody theme={theme}>
        Are you sure you want to delete <strong>&ldquo;{scheduleName}&rdquo;</strong>?{' '}
        {assignedEmployeeCount} employee{assignedEmployeeCount !== 1 ? 's' : ''} will be
        unassigned from this pay schedule.
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
          appearance={Button.APPEARANCES.DESTRUCTIVE}
          onClick={onConfirm}
          size={Button.SIZES.M}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ModalBody = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  line-height: 1.5;

  strong {
    font-weight: 600;
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export default DeleteScheduleModal;
