import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Card from '@rippling/pebble/Card';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import { VStack } from '@rippling/pebble/Layout/Stack';
import { SETTINGS_DATA, getEntity } from '../../data';
import { useScopeContext } from '../ScopeContext';

const SettingsView: React.FC = () => {
  const { theme } = useTheme();
  const { selectedEntityIds } = useScopeContext();

  const entityId = selectedEntityIds[0];
  const entity = entityId ? getEntity(entityId) : null;
  const settings = useMemo(
    () => SETTINGS_DATA.find(s => s.entityId === entityId),
    [entityId],
  );

  if (!entity || !settings) {
    return (
      <PromptWrapper theme={theme}>
        <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={32} />
        <PromptText theme={theme}>Select an entity in the sidebar</PromptText>
      </PromptWrapper>
    );
  }

  const getEntitiesSharingSchedule = (schedule: string) => {
    return SETTINGS_DATA
      .filter(s => s.paySchedules.includes(schedule) && s.entityId !== entityId)
      .map(s => getEntity(s.entityId))
      .filter(Boolean);
  };

  return (
    <VStack gap="1rem">
      <EntityHeading theme={theme}>{entity.flag} {entity.name}</EntityHeading>
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle theme={theme}>Payroll funding account</SectionTitle>
        <DetailGrid>
          <DetailLabel theme={theme}>Funding type</DetailLabel>
          <DetailValue theme={theme}>{settings.fundingType}</DetailValue>
          <DetailLabel theme={theme}>Payment method</DetailLabel>
          <DetailValue theme={theme}>{settings.paymentMethod}</DetailValue>
        </DetailGrid>
      </Card.Layout>

      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle theme={theme}>Pay schedules</SectionTitle>
        <VStack gap="0.75rem">
          {settings.paySchedules.map(schedule => {
            const sharedWith = getEntitiesSharingSchedule(schedule);
            return (
              <ScheduleItem key={schedule} theme={theme}>
                <ScheduleName theme={theme}>{schedule}</ScheduleName>
                {sharedWith.length > 0 && (
                  <UsedBySection>
                    <UsedByLabel theme={theme}>Used by:</UsedByLabel>
                    <UsedByEntities>
                      {sharedWith.map(e => (
                        <UsedByEntity key={e!.id} theme={theme}>
                          {e!.flag} {e!.name}
                        </UsedByEntity>
                      ))}
                    </UsedByEntities>
                    <Button
                      appearance={Button.APPEARANCES.GHOST}
                      size={Button.SIZES.S}
                      onClick={() => {}}
                    >
                      Apply to other entities
                    </Button>
                  </UsedBySection>
                )}
              </ScheduleItem>
            );
          })}
        </VStack>
      </Card.Layout>

      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle theme={theme}>Approval policy</SectionTitle>
        <DetailValue theme={theme}>{settings.approvalPolicy}</DetailValue>
      </Card.Layout>
    </VStack>
  );
};

const EntityHeading = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  height: 200px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PromptText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const DetailLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DetailValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ScheduleItem = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const ScheduleName = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const UsedBySection = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const UsedByLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UsedByEntities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const UsedByEntity = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export default SettingsView;
