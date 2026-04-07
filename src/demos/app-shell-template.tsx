import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Button from '@rippling/pebble/Button';
import { AppShellLayout } from '@/components/app-shell';

/**
 * App Shell Demo
 *
 * Recreates Rippling's main application shell with:
 * - Top navigation bar
 * - Left sidebar navigation (self-managed — auto-switches per super app)
 * - Main content area
 *
 * Based on the actual Rippling product UI structure.
 *
 * ─── Quick customisation guide ─────────────────────────────────────────────
 *
 * THEMING (top nav color)
 *   defaultAdminMode       → true = berry/admin theme, false = standard theme
 *                            Users can toggle at runtime via the profile dropdown.
 *
 * NAVIGATION
 *   Navigation is now self-managed by AppShellLayout:
 *   - Home view shows all super apps with correct icons
 *   - Clicking a super app switches the sidebar to that app's nav
 *   - Clicking the Rippling logo returns to Home
 *   - Active items display FILLED icon variants
 *
 *   To override the self-managed nav, pass mainNavSections / platformNavSection.
 *
 * PAGE HEADER
 *   pageTitle              → Main heading shown at the top of the content area
 *   pageTabs               → Array of tab labels (e.g. ['Overview', 'Settings'])
 *   pageActions            → ReactNode rendered in the header's action slot
 *
 * COMPANY / USER
 *   companyName            → Displayed next to the profile avatar
 *   userInitial            → Single character shown inside the avatar circle
 */

const ContentSlot = styled.div`
  background-color: rgba(205, 74, 53, 0.24);
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerM};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 188px;
`;

const SlotText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #cd4a35;
  text-align: center;

  & > p:first-of-type {
    ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
    font-weight: 535;
    margin: 0;
  }

  & > p:last-of-type {
    ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
    font-weight: 430;
    margin: 0;
  }
`;

const AppShellDemo: React.FC = () => {
  // ─── Page header actions (top-right of the content area) ───────────────────
  const pageActions = (
    <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M}>
      Button
    </Button>
  );

  return (
    <AppShellLayout
      // ─── Page ────────────────────────────────────────────────────────────
      pageTitle="App Shell"
      pageTabs={['Overview', 'Current Benefits', 'Plans & Providers', 'Dependents', 'Life Events']}
      defaultActiveTab={0}
      pageActions={pageActions}
      // ─── Top nav theming ─────────────────────────────────────────────────
      defaultAdminMode
      // ─── Company / user ──────────────────────────────────────────────────
      companyName="Acme, Inc."
      userInitial="A"
      showNotificationBadge
      notificationCount={5}
    >
      {/* ─── YOUR CONTENT GOES HERE ──────────────────────────────────────
          Replace these placeholder slots with your prototype content.
          Everything inside <AppShellLayout> renders in the main content area
          (right of the sidebar, below the page header / tabs).
      ──────────────────────────────────────────────────────────────────── */}
      <ContentSlot>
        <SlotText>
          <p>Section</p>
          <p>Swap instance</p>
        </SlotText>
      </ContentSlot>

      <ContentSlot>
        <SlotText>
          <p>Section</p>
          <p>Swap instance</p>
        </SlotText>
      </ContentSlot>

      <ContentSlot>
        <SlotText>
          <p>Section</p>
          <p>Swap instance</p>
        </SlotText>
      </ContentSlot>
    </AppShellLayout>
  );
};

export default AppShellDemo;
