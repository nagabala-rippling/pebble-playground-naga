import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Stepper from '@rippling/pebble/Stepper';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { HStack } from '@rippling/pebble/Layout/Stack';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { PaySchedule, PayScheduleFormData, EMPTY_FORM_DATA } from './types';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2PayDetails from './steps/Step2PayDetails';
import Step3Membership from './steps/Step3Membership';
import Step4AutoApproval from './steps/Step4AutoApproval';
import StepReview from './steps/StepReview';

interface CreateEditFlowProps {
  isOpen: boolean;
  editingSchedule?: PaySchedule | null;
  onClose: () => void;
  onSave: (formData: PayScheduleFormData) => void;
}

const STEPS = [
  { title: 'Basic Info' },
  { title: 'Pay Details' },
  { title: 'Membership' },
  { title: 'Auto Approval' },
  { title: 'Review' },
];

function mapScheduleToFormData(schedule: PaySchedule): PayScheduleFormData {
  return {
    name: schedule.name,
    employmentType: schedule.employmentType,
    entity: schedule.entity,
    payFrequency: schedule.payFrequency,
    holidayHandling: schedule.holidayHandling,
    arrearDaysUnit: schedule.arrearDaysUnit,
    arrearDays: schedule.arrearDays,
    firstPaymentDate: schedule.firstPaymentDate,
    paymentDateDetails: schedule.paymentDateDetails,
    superGroups: schedule.superGroups,
    autoApproval: schedule.autoApproval,
  };
}

const CreateEditFlow: React.FC<CreateEditFlowProps> = ({
  isOpen,
  editingSchedule,
  onClose,
  onSave,
}) => {
  const { theme } = usePebbleTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PayScheduleFormData>(EMPTY_FORM_DATA);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setFormData(editingSchedule ? mapScheduleToFormData(editingSchedule) : EMPTY_FORM_DATA);
    }
  }, [isOpen, editingSchedule]);

  if (!isOpen) return null;

  const handleChange = (updates: Partial<PayScheduleFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      onSave(formData);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const isLastStep = activeStep === STEPS.length - 1;
  const title = editingSchedule ? `Edit ${editingSchedule.name}` : 'Add a pay schedule';

  return (
    <Overlay>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <Button.Icon
          icon={Icon.TYPES.CLOSE}
          appearance={Button.APPEARANCES.GHOST}
          size={Button.SIZES.M}
          onClick={onClose}
          aria-label="Close"
        />
      </Header>

      <StepperWrapper>
        <Stepper
          steps={STEPS}
          activeStepIndex={activeStep}
          onClick={({ index }) => setActiveStep(index)}
        />
      </StepperWrapper>

      <StepContent>
        {activeStep === 0 && <Step1BasicInfo formData={formData} onChange={handleChange} />}
        {activeStep === 1 && <Step2PayDetails formData={formData} onChange={handleChange} />}
        {activeStep === 2 && <Step3Membership formData={formData} onChange={handleChange} />}
        {activeStep === 3 && <Step4AutoApproval formData={formData} onChange={handleChange} />}
        {activeStep === 4 && <StepReview formData={formData} />}
      </StepContent>

      <Footer>
        <FooterLeft>
          {activeStep > 0 && (
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              onClick={handleBack}
            >
              Back
            </Button>
          )}
        </FooterLeft>
        <HStack gap={theme.space300}>
          <Button
            appearance={Button.APPEARANCES.OUTLINE}
            size={Button.SIZES.M}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            size={Button.SIZES.M}
            onClick={handleNext}
            isDisabled={activeStep === 0 && !formData.name.trim()}
          >
            {isLastStep ? (editingSchedule ? 'Save' : 'Add schedule') : 'Continue'}
          </Button>
        </HStack>
      </Footer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space800};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const HeaderTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const StepperWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space800};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const StepContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space800};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
`;

export default CreateEditFlow;
