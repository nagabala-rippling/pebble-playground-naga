import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { useNavigate } from 'react-router-dom';
import Icon from '@rippling/pebble/Icon';
import Card from '@rippling/pebble/Card';
import Status from '@rippling/pebble/Status';
import Button from '@rippling/pebble/Button';
import Drawer from '@rippling/pebble/Drawer';
import TableBasic from '@rippling/pebble/TableBasic';
import Label from '@rippling/pebble/Label';
import Tabs from '@rippling/pebble/Tabs';
import Tip from '@rippling/pebble/Tip';
import { HStack } from '@rippling/pebble/Layout/Stack';

/**
 * Index Page
 * 
 * Landing page for the Pebble Playground showing all available demos.
 */

type DemoCategory = 'template' | 'prototype';

interface DemoCard {
  title: string;
  description: string;
  path: string;
  icon: string;
  category: DemoCategory;
}

// All demos in the playground
const ALL_DEMOS: DemoCard[] = [
  // Templates - starting points you copy
  {
    title: 'App Shell Template',
    description: 'The main template to copy when creating a new demo. Includes navigation, sidebar, and content areas.',
    path: '/app-shell-template',
    icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE,
    category: 'template',
  },
];

// Filter helpers
const getFilteredDemos = (filter: 'all' | DemoCategory): DemoCard[] => {
  if (filter === 'all') return ALL_DEMOS;
  return ALL_DEMOS.filter(demo => demo.category === filter);
};

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space1600} ${({ theme }) => (theme as StyledTheme).space800};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space1000};
`;

const GreetingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const GreetingText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  opacity: 0.7;
`;

const Title = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const Description = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  max-width: 800px;
  line-height: 1.6;
  
  a {
    color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => (theme as StyledTheme).space800};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  transition: background-color 150ms ease;
  background-color: ${({ theme, isActive }) => 
    isActive ? (theme as StyledTheme).colorSurfaceContainerHigh : 'transparent'};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const GuidesSection = styled.section`
  margin-top: ${({ theme }) => (theme as StyledTheme).space1200};
  padding-top: ${({ theme }) => (theme as StyledTheme).space1000};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const GuidesTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space800} 0;
`;

const CodePath = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const BulletItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const BulletTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const BulletText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.6;
  max-width: 680px;
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const DemoTableWrapper = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
  
  /* Hover effect for table rows */
  tr {
    transition: background-color 150ms ease;
    
    &:hover {
      background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    }
  }
`;

const DemoTableName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const DemoTableDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DemoCardWrapper = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 150ms ease;
  
  &:hover {
    transform: translateY(-4px);
  }

  & .copy-link-btn {
    opacity: 0;
    transition: opacity 150ms ease;
  }

  &:hover .copy-link-btn {
    opacity: 1;
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;


const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CardTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const CardDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
`;

const AddCardWrapper = styled.div`
  cursor: pointer;
`;

const AddCardContent = styled.div`
  background-color: transparent;
  border: 2px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner3xl};
  padding: 44px 24px;
  display: flex;
  flex-direction: column;
  transition: border-color 150ms ease, background-color 150ms ease;
  
  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const AddCardIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => (theme as StyledTheme).space400};
`;

const AddCardTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
  text-align: center;
`;

const AddCardDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
  text-align: center;
`;

const DrawerContent = styled.div``;

const InstructionSection = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space800};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InstructionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const InstructionText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
  line-height: 1.6;
`;

const CodeSnippet = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  display: inline-block;
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const CodeSnippetInline = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space100};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const StepNumber = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
  margin-right: ${({ theme }) => (theme as StyledTheme).space200};
`;

const CardTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const IndexPage: React.FC = () => {
  const { theme } = usePebbleTheme();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const deployedOrigin = import.meta.env.VITE_DEPLOY_URL || window.location.origin;
  const isDeployed = !!import.meta.env.VITE_DEPLOY_URL || !window.location.hostname.includes('localhost');

  const copyDemoUrl = useCallback((path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${deployedOrigin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  }, [deployedOrigin]);

  // Tab configuration
  const tabFilters: Array<'all' | DemoCategory> = ['all', 'prototype', 'template'];
  const activeFilter = tabFilters[activeTabIndex];
  const filteredDemos = getFilteredDemos(activeFilter);

  // Get user preferences from environment (with safe fallbacks)
  const userName = import.meta.env.VITE_USER_NAME;
  
  // Create personalized greeting with fallback to "Rippler"
  const firstName = userName ? userName.split(' ')[0] : 'Rippler';

  return (
    <PageContainer theme={theme}>
      <ContentWrapper>
        <Header theme={theme}>
          <GreetingRow theme={theme}>
            <GreetingText theme={theme}>Hi {firstName}</GreetingText>
          </GreetingRow>
          <Title theme={theme}>Welcome to your Pebble Playground</Title>
          <Description theme={theme}>
            A prototyping environment for exploring and building with Rippling's Pebble Design System. 
            Experiment with components, tokens, and patterns in an interactive sandbox.
            {' '}
            <a href="/getting-started" onClick={(e) => { e.preventDefault(); navigate('/getting-started'); }}>
              Learn how to get started
            </a>
            {' '}creating your own demos.
          </Description>
        </Header>

        {/* Tabs and View Toggle */}
        <SectionHeader theme={theme}>
          <Tabs.SWITCH 
            activeIndex={activeTabIndex} 
            onChange={(index) => setActiveTabIndex(Number(index))}
          >
            <Tabs.Tab title="All" />
            <Tabs.Tab title="Prototypes" />
            <Tabs.Tab title="Templates" />
          </Tabs.SWITCH>
          
          <HStack gap="0.25rem">
            <Tip content="Grid view" placement={Tip.PLACEMENTS.BOTTOM}>
              <ViewToggleButton 
                theme={theme} 
                isActive={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Icon type={Icon.TYPES.BENTO_BOX} size={16} />
              </ViewToggleButton>
            </Tip>
            <Tip content="Table view" placement={Tip.PLACEMENTS.BOTTOM}>
              <ViewToggleButton 
                theme={theme} 
                isActive={viewMode === 'table'}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <Icon type={Icon.TYPES.LIST_OUTLINE} size={16} />
              </ViewToggleButton>
            </Tip>
          </HStack>
        </SectionHeader>

        {viewMode === 'grid' ? (
          <DemoGrid theme={theme}>
            {filteredDemos.map((demo) => (
              <DemoCardWrapper
                key={demo.path}
                onClick={() => navigate(demo.path)}
              >
                <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
                  <CardContent>
                    <CardTopBar theme={theme}>
                      <HStack gap="0.25rem">
                        <Status
                          appearance={isDeployed ? Status.APPEARANCES.SUCCESS : Status.APPEARANCES.WARNING}
                          text={isDeployed ? 'Deployed' : 'Not deployed'}
                          size={Status.SIZES.S}
                        />
                        <Tip
                          content={
                            !isDeployed
                              ? 'Push your branch to GitHub to deploy'
                              : copiedPath === demo.path
                                ? 'Copied!'
                                : 'Copy link'
                          }
                          placement={Tip.PLACEMENTS.TOP}
                        >
                          <span className="copy-link-btn">
                            <Button.Icon
                              icon={Icon.TYPES.COPY_OUTLINE}
                              aria-label="Copy link"
                              appearance={Button.APPEARANCES.GHOST}
                              size={Button.SIZES.XS}
                              isDisabled={!isDeployed}
                              onClick={(e: React.MouseEvent) => isDeployed && copyDemoUrl(demo.path, e)}
                            />
                          </span>
                        </Tip>
                      </HStack>
                      {demo.category === 'template' && (
                        <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.NEUTRAL}>
                          Template
                        </Label>
                      )}
                    </CardTopBar>
                    <CardIcon theme={theme}>
                      <Icon 
                        type={demo.icon} 
                        size={24} 
                        color={theme.colorPrimary}
                      />
                    </CardIcon>
                    <CardTitle theme={theme}>{demo.title}</CardTitle>
                    <CardDescription theme={theme}>
                      {demo.description}
                    </CardDescription>
                  </CardContent>
                </Card.Layout>
              </DemoCardWrapper>
            ))}
            
            {/* Create New Demo Card - only show on All or Templates tab */}
            {(activeFilter === 'all' || activeFilter === 'template') && (
              <AddCardWrapper onClick={() => setIsDrawerOpen(true)}>
                <AddCardContent theme={theme}>
                  <AddCardIcon theme={theme}>
                    <Icon 
                      type={Icon.TYPES.ADD_CIRCLE_OUTLINE} 
                      size={24} 
                      color={theme.colorOnSurface} 
                    />
                  </AddCardIcon>
                  <AddCardTitle theme={theme}>Create a New Demo</AddCardTitle>
                  <AddCardDescription theme={theme}>
                    Copy the template to start building
                  </AddCardDescription>
                </AddCardContent>
              </AddCardWrapper>
            )}
          </DemoGrid>
        ) : (
          <DemoTableWrapper>
            <TableBasic>
              <TableBasic.THead>
                <TableBasic.Tr>
                  <TableBasic.Th>Name</TableBasic.Th>
                  <TableBasic.Th>Description</TableBasic.Th>
                  <TableBasic.Th>Type</TableBasic.Th>
                  <TableBasic.Th></TableBasic.Th>
                </TableBasic.Tr>
              </TableBasic.THead>
              <TableBasic.TBody>
                {filteredDemos.map((demo) => (
                  <TableBasic.Tr 
                    key={demo.path} 
                    onClick={() => navigate(demo.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableBasic.Td>
                      <HStack gap="0.5rem">
                        <Icon 
                          type={demo.icon} 
                          size={16} 
                          color={theme.colorPrimary}
                        />
                        <DemoTableName theme={theme}>{demo.title}</DemoTableName>
                      </HStack>
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <DemoTableDescription theme={theme}>{demo.description}</DemoTableDescription>
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <Label 
                        size={Label.SIZES.S} 
                        appearance={demo.category === 'template' ? Label.APPEARANCES.NEUTRAL : Label.APPEARANCES.PRIMARY}
                      >
                        {demo.category === 'template' ? 'Template' : 'Prototype'}
                      </Label>
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <Tip
                        content={copiedPath === demo.path ? 'Copied!' : 'Copy link'}
                        placement={Tip.PLACEMENTS.LEFT}
                      >
                        <button
                          aria-label="Copy link"
                          onClick={(e: React.MouseEvent) => copyDemoUrl(demo.path, e)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Icon
                            type={copiedPath === demo.path ? Icon.TYPES.CHECK : Icon.TYPES.LINK_HORIZONTAL}
                            size={16}
                            color={theme.colorOnSurfaceVariant}
                          />
                        </button>
                      </Tip>
                    </TableBasic.Td>
                  </TableBasic.Tr>
                ))}
              </TableBasic.TBody>
            </TableBasic>
          </DemoTableWrapper>
        )}

        {/* How AI Understands Pebble */}
        <GuidesSection theme={theme}>
          <GuidesTitle theme={theme}>How AI Understands Pebble</GuidesTitle>
          
          <BulletList theme={theme}>
            <BulletItem theme={theme}>
              <BulletTitle theme={theme}>Pebble MCP</BulletTitle>
              <BulletText theme={theme}>
                Your AI coding tool has live access to all Pebble component docs, props, and Storybook examples. This is set up automatically when you run <CodePath theme={theme}>npm install</CodePath>.
              </BulletText>
            </BulletItem>
            <BulletItem theme={theme}>
              <BulletTitle theme={theme}>Built-in rules</BulletTitle>
              <BulletText theme={theme}>
                The project includes AI instruction files with component gotchas, design token references, and forbidden patterns — so AI avoids common mistakes out of the box.
              </BulletText>
            </BulletItem>
            <BulletItem theme={theme}>
              <BulletTitle theme={theme}>Documentation</BulletTitle>
              <BulletText theme={theme}>
                The <CodePath theme={theme}>docs/</CodePath> folder has a Component Catalog, Token Catalog, and guides synced from Confluence. AI references these automatically when building your prototypes.
              </BulletText>
            </BulletItem>
            <BulletItem theme={theme}>
              <BulletTitle theme={theme}>Your code</BulletTitle>
              <BulletText theme={theme}>
                AI learns patterns from existing demo files in <CodePath theme={theme}>src/demos/</CodePath>, so the more you build, the better it gets at following your conventions.
              </BulletText>
            </BulletItem>
          </BulletList>
        </GuidesSection>
      </ContentWrapper>

      {/* Instructions Drawer */}
      <Drawer
        isVisible={isDrawerOpen}
        onCancel={() => setIsDrawerOpen(false)}
        title="Create a New Demo"
        width={600}
      >
        <DrawerContent theme={theme}>
          <InstructionSection theme={theme}>
            <InstructionTitle theme={theme}>
              <StepNumber theme={theme}>Step 1:</StepNumber>
              Start a Conversation
            </InstructionTitle>
            <InstructionText theme={theme}>
              Open this project in your AI coding tool. In <strong>Claude Code</strong>, run <CodeSnippetInline theme={theme}>claude</CodeSnippetInline> from the <CodeSnippetInline theme={theme}>pebble-playground</CodeSnippetInline> folder. In <strong>Cursor</strong>, open the folder with File → Open Folder.
            </InstructionText>
          </InstructionSection>

          <InstructionSection theme={theme}>
            <InstructionTitle theme={theme}>
              <StepNumber theme={theme}>Step 2:</StepNumber>
              Create Your Demo
            </InstructionTitle>
            <InstructionText theme={theme}>
              Paste this prompt (replace "My Feature" with your demo name):
            </InstructionText>
            <CodeSnippet theme={theme}>
              Create a new demo called "My Feature" by copying app-shell-template.tsx
            </CodeSnippet>
            <InstructionText theme={theme}>
              AI will create the file, wire it up in main.tsx, and add a card to the index page.
            </InstructionText>
          </InstructionSection>

          <InstructionSection theme={theme}>
            <InstructionTitle theme={theme}>
              <StepNumber theme={theme}>Step 3:</StepNumber>
              Describe What You Want
            </InstructionTitle>
            <InstructionText theme={theme}>
              Tell AI what to build. Use simple, direct commands:
            </InstructionText>
            <CodeSnippet theme={theme}>
              Replace the main content with a data table showing employee records with search and filters
            </CodeSnippet>
            <CodeSnippet theme={theme}>
              Update the content area to show a dashboard with 4 metric cards and a chart
            </CodeSnippet>
            <CodeSnippet theme={theme}>
              Add a multi-step form wizard in the main content section
            </CodeSnippet>
          </InstructionSection>

          <InstructionSection theme={theme}>
            <InstructionTitle theme={theme}>
              <StepNumber theme={theme}>Step 4:</StepNumber>
              Refine and Iterate
            </InstructionTitle>
            <InstructionText theme={theme}>
              Keep going with natural language to polish your demo:
            </InstructionText>
            <CodeSnippet theme={theme}>
              Update the sidebar navigation items
            </CodeSnippet>
            <CodeSnippet theme={theme}>
              Adjust spacing to match the design system
            </CodeSnippet>
            <CodeSnippet theme={theme}>
              Add a loading state to the table
            </CodeSnippet>
          </InstructionSection>

          <InstructionSection theme={theme}>
            <InstructionTitle theme={theme}>
              <StepNumber theme={theme}>💡 Tips:</StepNumber>
            </InstructionTitle>
            <InstructionText theme={theme}>
              • AI has access to all Pebble component docs automatically via MCP<br/>
              • The app shell gives you navigation, sidebar, and content areas<br/>
              • Focus on customizing the main content — keep the shell structure<br/>
              • Be specific: "Add a Pebble TableBasic with sortable columns" works better than "add a table"
            </InstructionText>
          </InstructionSection>
        </DrawerContent>
      </Drawer>
    </PageContainer>
  );
};

export default IndexPage;

