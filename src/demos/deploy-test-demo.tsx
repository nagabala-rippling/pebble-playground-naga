import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';

const DeployTestDemo: React.FC = () => {
  const mainSection: NavSectionData = {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Icon.TYPES.HOME_OUTLINE },
      { id: 'team', label: 'Team', icon: Icon.TYPES.PEOPLE_OUTLINE, hasSubmenu: true },
      { id: 'reports', label: 'Reports', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
    ],
  };

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'settings', label: 'Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  return (
    <AppShellLayout
      pageTitle="Deploy Test"
      pageTabs={['Overview', 'Activity']}
      defaultActiveTab={0}
      pageActions={
        <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M}>
          Action
        </Button>
      }
      mainNavSections={[mainSection]}
      platformNavSection={platformSection}
      companyName="Acme, Inc."
      userInitial="P"
    >
      <SuccessCard>
        <Icon type={Icon.TYPES.CHECK_CIRCLE} size={48} color="#16a34a" />
        <Title>Deploy test successful!</Title>
        <Subtitle>This prototype was created to validate the end-to-end deploy workflow.</Subtitle>
      </SuccessCard>
    </AppShellLayout>
  );
};

const SuccessCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  padding: ${({ theme }) => (theme as StyledTheme).space1200};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  text-align: center;
`;

const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const Subtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  max-width: 400px;
`;

export default DeployTestDemo;
