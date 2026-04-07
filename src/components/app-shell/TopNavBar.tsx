import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { getStateColor } from '@rippling/pebble/theme';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Atoms from '@rippling/pebble/Atoms';
import Popper from '@rippling/pebble/Popper';
import Tip from '@rippling/pebble/Tip';
import useOutsideClick from '@rippling/pebble/hooks/useOutsideClick';
import RipplingLogoBlack from '@/assets/rippling-logo-black.svg';
import RipplingLogoWhite from '@/assets/rippling-logo-white.svg';
import RipplingMarkBlack from '@/assets/rippling-mark-black.svg';
import RipplingMarkWhite from '@/assets/rippling-mark-white.svg';
import { SearchBar } from './SearchBar';
import { ProfileDropdown } from './ProfileDropdown';

const BERRY_BG = '#4a0039';
const BERRY_HOVER = 'rgba(255, 255, 255, 0.1)';
const BERRY_ACTIVE = 'rgba(255, 255, 255, 0.15)';

interface TopNavBarProps {
  companyName: string;
  userInitial: string;
  adminMode: boolean;
  currentMode: 'light' | 'dark';
  searchPlaceholder?: string;
  superAppName?: string;
  onAdminModeToggle: () => void;
  onLogoClick?: () => void;
  showNotificationBadge?: boolean;
  notificationCount?: number;
  onOpenAIPanel?: () => void;
  onOpenHelpPanel?: () => void;
  onOpenSupportChat?: () => void;
  theme: StyledTheme;
}

const TopNav = styled.nav<{ adminMode: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: ${({ theme, adminMode }) =>
    adminMode ? BERRY_BG : (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  padding: 0;
  z-index: 100;
  transition: background-color 200ms ease;
`;

const LeftSection = styled.div<{ adminMode?: boolean }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  width: 266px;
  height: 24px;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  border-right: 1px solid
    ${({ theme, adminMode }) => {
      const color = adminMode ? 'white' : (theme as StyledTheme).colorOnSurface;
      const opacity = adminMode ? 0.3 : 0.2;
      return color === 'white'
        ? `rgba(255, 255, 255, ${opacity})`
        : `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
    }};
`;

const LogoContainer = styled.div<{ hasSuperApp?: boolean; adminMode?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  border-right: ${({ hasSuperApp, adminMode, theme }) => {
    if (!hasSuperApp) return 'none';
    const color = adminMode ? 'white' : (theme as StyledTheme).colorOnSurface;
    const opacity = adminMode ? 0.3 : 0.2;
    return color === 'white'
      ? `1px solid rgba(255, 255, 255, ${opacity})`
      : `1px solid color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
  }};
  padding-right: ${({ hasSuperApp, theme }) =>
    hasSuperApp ? (theme as StyledTheme).space400 : '0'};
`;

const Logo = styled.img<{ adminMode?: boolean }>`
  width: 127px;
  height: auto;
  display: block;
  cursor: pointer;
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  margin: -${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme, adminMode }) =>
      adminMode ? BERRY_HOVER : getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }

  &:active {
    background-color: ${({ theme, adminMode }) =>
      adminMode
        ? BERRY_ACTIVE
        : getStateColor((theme as StyledTheme).colorSurfaceBright, 'active')};
  }
`;

const LogoMark = styled.img<{ adminMode?: boolean }>`
  width: 24px;
  height: 24px;
  display: block;
  cursor: pointer;
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  margin: -${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme, adminMode }) =>
      adminMode ? BERRY_HOVER : getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }

  &:active {
    background-color: ${({ theme, adminMode }) =>
      adminMode
        ? BERRY_ACTIVE
        : getStateColor((theme as StyledTheme).colorSurfaceBright, 'active')};
  }
`;

const SuperAppSelector = styled.button<{ adminMode?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space200} ${(theme as StyledTheme).space300}`};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme, adminMode }) =>
      adminMode ? BERRY_HOVER : getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const SuperAppName = styled.span<{ adminMode?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  font-weight: 600;
  color: ${({ theme, adminMode }) => (adminMode ? 'white' : (theme as StyledTheme).colorOnSurface)};
  white-space: nowrap;
  width: 100%;
  text-align: left;
`;

const VerticalDivider = styled.div<{ adminMode?: boolean }>`
  width: 1px;
  height: 24px;
  background-color: ${({ theme, adminMode }) =>
    adminMode ? 'white' : (theme as StyledTheme).colorOnSurface};
  opacity: ${({ adminMode }) => (adminMode ? 0.3 : 0.2)};
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: ${({ theme }) => (theme as StyledTheme).space1000};
  height: 100%;
`;

const SearchBarWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
`;

const TopNavActions = styled.div<{ adminMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};

  button {
    position: relative;
  }

  ${({ adminMode }) =>
    adminMode &&
    `
    button svg,
    button i,
    button [class*="Icon"] {
      color: white !important;
      fill: white !important;
    }
  `}
`;

const NotificationBadgeWrapper = styled.div`
  position: absolute;
  top: -2px;
  right: 0px;
  pointer-events: none;
`;

const ProfileDivider = styled.div`
  padding: ${({ theme }) =>
    `0 ${(theme as StyledTheme).space300} 0 ${(theme as StyledTheme).space400}`};
`;

// ─── Notifications Dropdown ──────────────────────────────────────────────────

const NotificationsContainer = styled.div`
  width: 420px;
  max-height: 620px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  box-shadow: ${({ theme }) => (theme as any).shadowMd};
  overflow: hidden;
`;

const NotificationsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const NotificationsTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const NotificationsHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ShowAllLink = styled.button`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as any).colorInfo};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: linear-gradient(135deg, #7b2d5b 0%, #5b1d4b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg,
  i {
    color: white !important;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 4px 0;
`;

const NotificationTime = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  flex-shrink: 0;
  margin-top: 8px;
`;

const sampleNotifications = [
  {
    id: '1',
    icon: Icon.TYPES.TASKS_OUTLINE,
    text: 'Action required: You have pending tasks in Rippling',
    time: '1 hour ago',
    isUnread: true,
  },
  {
    id: '2',
    icon: Icon.TYPES.TASKS_OUTLINE,
    text: 'Action required: You have pending tasks in Rippling',
    time: '1 day ago',
    isUnread: false,
  },
  {
    id: '3',
    icon: Icon.TYPES.BOOKS_OUTLINE,
    text: 'Paul, 2026 Proxy Tool Safe Use Policy Training is due tomorrow!',
    time: '2 days ago',
    isUnread: true,
  },
  {
    id: '4',
    icon: Icon.TYPES.TASKS_OUTLINE,
    text: 'Action required: You have pending tasks in Rippling',
    time: '2 days ago',
    isUnread: true,
  },
  {
    id: '5',
    icon: Icon.TYPES.BOOKS_OUTLINE,
    text: 'Rippling has enrolled you in Regulated Complaints: Module 2',
    time: '3 days ago',
    isUnread: true,
  },
  {
    id: '6',
    icon: Icon.TYPES.TASKS_OUTLINE,
    text: 'Action required: You have pending tasks in Rippling',
    time: '3 days ago',
    isUnread: true,
  },
  {
    id: '7',
    icon: Icon.TYPES.TASKS_OUTLINE,
    text: 'Action required: You have pending tasks in Rippling',
    time: '4 days ago',
    isUnread: true,
  },
  {
    id: '8',
    icon: Icon.TYPES.USERS_OUTLINE,
    text: "Paul, you've been nominated as a peer reviewer",
    time: '4 days ago',
    isUnread: false,
  },
];

const NotificationsDropdown: React.FC<{ theme: StyledTheme; notificationCount: number }> = ({
  theme,
  notificationCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useOutsideClick([popperRef, buttonRef], () => setIsOpen(false));

  return (
    <Popper
      isVisible={isOpen}
      placement={Popper.PLACEMENTS.BOTTOM_END}
      shouldUsePortal
      popContent={
        <NotificationsContainer ref={popperRef} theme={theme}>
          <NotificationsHeader theme={theme}>
            <NotificationsTitle theme={theme}>Notifications</NotificationsTitle>
            <NotificationsHeaderActions theme={theme}>
              <ShowAllLink theme={theme}>Show all</ShowAllLink>
              <Button.Icon
                icon={Icon.TYPES.MORE_HORIZONTAL}
                aria-label="More options"
                appearance={Button.APPEARANCES.GHOST}
                size={Button.SIZES.S}
              />
            </NotificationsHeaderActions>
          </NotificationsHeader>
          <NotificationsList theme={theme}>
            {sampleNotifications.map(notification => (
              <NotificationItem key={notification.id} theme={theme}>
                <NotificationIcon theme={theme}>
                  <Icon type={notification.icon} size={20} color="white" />
                </NotificationIcon>
                <NotificationContent theme={theme}>
                  <NotificationText theme={theme}>{notification.text}</NotificationText>
                  <NotificationTime theme={theme}>{notification.time}</NotificationTime>
                </NotificationContent>
                {notification.isUnread && <UnreadIndicator theme={theme} />}
              </NotificationItem>
            ))}
          </NotificationsList>
        </NotificationsContainer>
      }
    >
      <div ref={buttonRef} style={{ position: 'relative' }}>
        <Tip
          content="View notifications"
          placement={Tip.PLACEMENTS.BOTTOM}
          isVisible={isOpen ? false : undefined}
          isPositionFixed
        >
          <span>
            <Button.Icon
              icon={Icon.TYPES.NOTIFICATION_OUTLINE}
              aria-label="Notifications"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
              onClick={() => setIsOpen(!isOpen)}
            />
          </span>
        </Tip>
        {notificationCount > 0 && (
          <NotificationBadgeWrapper>
            <Atoms.Badge
              text={String(notificationCount)}
              size={Atoms.Badge.SIZES.XS}
              appearance={Atoms.Badge.APPEARANCES.PRIMARY_LIGHT}
            />
          </NotificationBadgeWrapper>
        )}
      </div>
    </Popper>
  );
};

// ─── Support Dropdown ────────────────────────────────────────────────────────

interface CompanyContact {
  name: string;
  avatarUrl: string;
  role: string;
  email?: string;
}

const SupportContainer = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  box-shadow: ${({ theme }) => (theme as any).shadowMd};
  overflow: hidden;
`;

const SupportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const SupportTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SupportContent = styled.div`
  padding: 8px 4px;
`;

const SupportSection = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  &:last-child {
    margin-bottom: 0;
  }
`;

const SupportSectionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space200};
`;

const SupportItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  transition: background-color 150ms ease;
  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const SupportItemIcon = styled.div<{ variant?: 'default' | 'primary' }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: ${({ theme, variant }) =>
    variant === 'primary'
      ? (theme as StyledTheme).colorPrimaryContainer
      : (theme as StyledTheme).colorSurfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SupportItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SupportItemTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const SupportItemDescription = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AdminContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  transition: background-color 150ms ease;
  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const AdminAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const AdminContactActions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex-shrink: 0;
`;

const SupportFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: 12px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const DEFAULT_CONTACTS: CompanyContact[] = [
  {
    name: 'Sarah Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    role: 'Benefits Administrator',
    email: 'sarah.chen@company.com',
  },
  {
    name: 'Marcus Johnson',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'HR Manager',
    email: 'marcus.johnson@company.com',
  },
];

const SupportDropdown: React.FC<{
  theme: StyledTheme;
  onOpenSupportChat?: () => void;
  onOpenAIPanel?: () => void;
}> = ({ theme, onOpenSupportChat, onOpenAIPanel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useOutsideClick([popperRef, buttonRef], () => setIsOpen(false));

  return (
    <Popper
      isVisible={isOpen}
      placement={Popper.PLACEMENTS.BOTTOM_END}
      shouldUsePortal
      popContent={
        <SupportContainer ref={popperRef} theme={theme}>
          <SupportHeader theme={theme}>
            <SupportTitle theme={theme}>Support</SupportTitle>
            <Button.Icon
              icon={Icon.TYPES.MORE_HORIZONTAL}
              aria-label="More options"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              onClick={() => setIsOpen(false)}
            />
          </SupportHeader>

          <SupportContent theme={theme}>
            <SupportSection theme={theme}>
              <SupportItem
                theme={theme}
                onClick={() => window.open('https://help.rippling.com', '_blank')}
              >
                <SupportItemIcon theme={theme} variant="primary">
                  <Icon
                    type={Icon.TYPES.HEART_FILLED}
                    size={20}
                    color={(theme as any).colorOnPrimaryContainer}
                  />
                </SupportItemIcon>
                <SupportItemContent theme={theme}>
                  <SupportItemTitle theme={theme}>Help Center</SupportItemTitle>
                  <SupportItemDescription theme={theme}>
                    Benefits help topics
                  </SupportItemDescription>
                </SupportItemContent>
                <Button.Icon
                  icon={Icon.TYPES.ARROW_UP_RIGHT_BOX}
                  aria-label="Open Help Center"
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.XS}
                />
              </SupportItem>
            </SupportSection>

            <SupportSection theme={theme}>
              <SupportSectionLabel theme={theme}>Company contacts</SupportSectionLabel>
              {DEFAULT_CONTACTS.map((contact, index) => (
                <AdminContactItem key={index} theme={theme}>
                  <AdminAvatar src={contact.avatarUrl} alt={contact.name} />
                  <SupportItemContent theme={theme}>
                    <SupportItemTitle theme={theme}>{contact.name}</SupportItemTitle>
                    <SupportItemDescription theme={theme}>{contact.role}</SupportItemDescription>
                  </SupportItemContent>
                  <AdminContactActions theme={theme}>
                    <Tip
                      content="Send a direct message"
                      placement={Tip.PLACEMENTS.TOP}
                      isPositionFixed
                    >
                      <span>
                        <Button.Icon
                          icon={Icon.TYPES.COMMENTS_OUTLINE}
                          aria-label={`Message ${contact.name}`}
                          appearance={Button.APPEARANCES.GHOST}
                          size={Button.SIZES.XS}
                        />
                      </span>
                    </Tip>
                    <Tip content="Send an email" placement={Tip.PLACEMENTS.TOP} isPositionFixed>
                      <span>
                        <Button.Icon
                          icon={Icon.TYPES.EMAIL_OUTLINE}
                          aria-label={`Email ${contact.name}`}
                          appearance={Button.APPEARANCES.GHOST}
                          size={Button.SIZES.XS}
                        />
                      </span>
                    </Tip>
                  </AdminContactActions>
                </AdminContactItem>
              ))}
            </SupportSection>
          </SupportContent>

          <SupportFooter theme={theme}>
            <Tip
              content="Connect with a support agent"
              placement={Tip.PLACEMENTS.TOP}
              isPositionFixed
            >
              <div style={{ flex: 1 }}>
                <Button
                  appearance={Button.APPEARANCES.OUTLINE}
                  size={Button.SIZES.S}
                  icon={{
                    type: Icon.TYPES.MESSAGE_OUTLINE,
                    alignment: Button.ICON_ALIGNMENTS.LEFT,
                  }}
                  isFluid
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSupportChat?.();
                  }}
                >
                  Chat with an agent
                </Button>
              </div>
            </Tip>
            <Tip
              content="Get instant answers from Rippling AI"
              placement={Tip.PLACEMENTS.TOP}
              isPositionFixed
            >
              <div style={{ flex: 1 }}>
                <Button
                  appearance={Button.APPEARANCES.PRIMARY}
                  size={Button.SIZES.S}
                  icon={{ type: Icon.TYPES.FX_OUTLINE, alignment: Button.ICON_ALIGNMENTS.LEFT }}
                  isFluid
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAIPanel?.();
                  }}
                >
                  Ask Rippling AI
                </Button>
              </div>
            </Tip>
          </SupportFooter>
        </SupportContainer>
      }
    >
      <div ref={buttonRef}>
        <Tip
          content="Get help and support"
          placement={Tip.PLACEMENTS.BOTTOM}
          isVisible={isOpen ? false : undefined}
          isPositionFixed
        >
          <span>
            <Button.Icon
              icon={Icon.TYPES.QUESTION_CIRCLE_OUTLINE}
              aria-label="Help"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
              onClick={() => setIsOpen(!isOpen)}
            />
          </span>
        </Tip>
      </div>
    </Popper>
  );
};

// ─── TopNavBar ───────────────────────────────────────────────────────────────

export const TopNavBar: React.FC<TopNavBarProps> = ({
  companyName,
  userInitial,
  adminMode,
  currentMode,
  searchPlaceholder,
  superAppName,
  onAdminModeToggle,
  onLogoClick,
  showNotificationBadge = false,
  notificationCount = 0,
  onOpenAIPanel,
  onOpenSupportChat,
  theme,
}) => {
  const hasSuperApp = !!superAppName && superAppName !== 'Home';

  return (
    <TopNav theme={theme} adminMode={adminMode}>
      <LeftSection theme={theme} adminMode={adminMode}>
        <LogoContainer theme={theme} hasSuperApp={hasSuperApp} adminMode={adminMode}>
          {hasSuperApp ? (
            <LogoMark
              src={adminMode || currentMode === 'dark' ? RipplingMarkWhite : RipplingMarkBlack}
              alt="Rippling home"
              role="button"
              tabIndex={0}
              onClick={onLogoClick}
              adminMode={adminMode}
            />
          ) : (
            <Logo
              src={adminMode || currentMode === 'dark' ? RipplingLogoWhite : RipplingLogoBlack}
              alt="Rippling home"
              role="button"
              tabIndex={0}
              onClick={onLogoClick}
              adminMode={adminMode}
            />
          )}
        </LogoContainer>
        {hasSuperApp && (
          <SuperAppSelector
            theme={theme}
            adminMode={adminMode}
            aria-label={`Switch from ${superAppName}`}
          >
            <SuperAppName theme={theme} adminMode={adminMode}>
              {superAppName}
            </SuperAppName>
            <Icon
              type={Icon.TYPES.CHEVRON_DOWN}
              size={16}
              color={adminMode ? 'white' : theme.colorOnSurface}
            />
          </SuperAppSelector>
        )}
      </LeftSection>

      <RightSection theme={theme}>
        <SearchBarWrapper theme={theme}>
          <SearchBar placeholder={searchPlaceholder} adminMode={adminMode} theme={theme} />
        </SearchBarWrapper>

        <ActionsContainer theme={theme}>
          <TopNavActions theme={theme} adminMode={adminMode}>
            <SupportDropdown
              theme={theme}
              onOpenSupportChat={onOpenSupportChat}
              onOpenAIPanel={onOpenAIPanel}
            />
            <Tip content="Chat with your team" placement={Tip.PLACEMENTS.BOTTOM} isPositionFixed>
              <span>
                <Button.Icon
                  icon={Icon.TYPES.COMMENTS_OUTLINE}
                  aria-label="Team chat"
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.M}
                />
              </span>
            </Tip>
            {showNotificationBadge && (
              <NotificationsDropdown theme={theme} notificationCount={notificationCount} />
            )}
            <Tip content="AI Assistant" placement={Tip.PLACEMENTS.BOTTOM} isPositionFixed>
              <span>
                <Button.Icon
                  icon={Icon.TYPES.FX_OUTLINE}
                  aria-label="AI"
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.M}
                  onClick={onOpenAIPanel}
                />
              </span>
            </Tip>
          </TopNavActions>

          <ProfileDivider theme={theme}>
            <VerticalDivider theme={theme} adminMode={adminMode} />
          </ProfileDivider>

          <ProfileDropdown
            companyName={companyName}
            userInitial={userInitial}
            adminMode={adminMode}
            currentMode={currentMode}
            onAdminModeToggle={onAdminModeToggle}
            theme={theme}
          />
        </ActionsContainer>
      </RightSection>
    </TopNav>
  );
};
