import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';

interface DecagonChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onStartNewChat?: () => void;
  theme: StyledTheme;
  isConversationClosed?: boolean;
  initialMessage?: string | null;
  onInitialMessageSent?: () => void;
}

const DECAGON_HEADER_COLOR = '#F5A623';
const DECAGON_BG_COLOR = '#FFFFFF';
const WIDGET_WIDTH = 420;
const WIDGET_HEIGHT = 520;

const RipplingLogoIcon = styled.svg`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const WidgetContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: ${({ isOpen }) => (isOpen ? '20px' : '-500px')};
  right: 20px;
  width: ${WIDGET_WIDTH}px;
  height: ${WIDGET_HEIGHT}px;
  background-color: ${DECAGON_BG_COLOR};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  transition: bottom 300ms ease-out;
  animation: ${({ isOpen }) => (isOpen ? slideUp : 'none')} 300ms ease-out;
`;

const Header = styled.div`
  background-color: ${DECAGON_HEADER_COLOR};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex: 1;
  min-width: 0;
`;

const HeaderTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLargeEmphasized};
  color: #000000;
  font-weight: 600;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${DECAGON_BG_COLOR};
`;

const MessageContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const MessageAvatar = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F5A623 0%, #FFB84D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageTime = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const MessageText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.5;
  
  a {
    color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const Footer = styled.div`
  flex-shrink: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ConversationClosedMessage = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: center;
  margin: ${({ theme }) => (theme as StyledTheme).space400} 0;
  font-style: italic;
`;

const StartNewChatButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${DECAGON_HEADER_COLOR};
  color: white;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease;
  
  &:hover {
    background-color: #D68910;
  }
  
  &:active {
    background-color: #B9770E;
  }
`;

const Disclaimer = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  line-height: 1.4;
  
  a {
    color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  
  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

const UserMessageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const UserBubble = styled.div`
  background-color: ${DECAGON_HEADER_COLOR};
  color: #000000;
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space400}`};
  border-radius: 16px 16px 4px 16px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  max-width: 85%;
  line-height: 1.5;
`;

const ContextCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ContextCardLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
  font-weight: 500;
`;

const ContextCardText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.4;
`;

export const DecagonChatWidget: React.FC<DecagonChatWidgetProps> = ({
  isOpen,
  onClose,
  onMinimize,
  onStartNewChat,
  theme,
  isConversationClosed: isConversationClosedProp = true,
  initialMessage,
  onInitialMessageSent,
}) => {
  const [hasShownInitial, setHasShownInitial] = useState(false);
  const [showBotReply, setShowBotReply] = useState(false);

  // When widget opens with an initial message, show it and simulate bot reply
  useEffect(() => {
    if (isOpen && initialMessage && !hasShownInitial) {
      setHasShownInitial(true);
      onInitialMessageSent?.();
      const timer = setTimeout(() => setShowBotReply(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMessage, hasShownInitial, onInitialMessageSent]);

  // Reset state when widget closes
  useEffect(() => {
    if (!isOpen) {
      setHasShownInitial(false);
      setShowBotReply(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasHandoff = hasShownInitial && initialMessage;
  const isConversationClosed = hasHandoff ? false : isConversationClosedProp;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <WidgetContainer theme={theme} isOpen={isOpen}>
      <Header theme={theme}>
        <HeaderLeft theme={theme}>
          <Button.Icon
            icon={Icon.TYPES.MORE_HORIZONTAL}
            aria-label="Menu"
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            onClick={() => console.log('Menu clicked')}
          />
          <HeaderTitle theme={theme}>Chat with Rippling</HeaderTitle>
        </HeaderLeft>
        <HeaderRight theme={theme}>
          <Button.Icon
            icon={Icon.TYPES.QUESTION_CIRCLE_OUTLINE}
            aria-label="Help"
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            onClick={() => console.log('Help clicked')}
          />
          {onMinimize && (
            <Button.Icon
              icon={Icon.TYPES.COLLAPSE_PANEL_OUTLINE}
              aria-label="Minimize"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              onClick={onMinimize}
            />
          )}
          <Button.Icon
            icon={Icon.TYPES.CLOSE}
            aria-label="Close"
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            onClick={onClose}
          />
        </HeaderRight>
      </Header>

      <ChatBody theme={theme}>
        {/* Bot welcome message */}
        <MessageContainer theme={theme}>
          <MessageAvatar theme={theme}>
            <RipplingLogoIcon viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6C3 6 5 4 9 4C13 4 15 6 15 6M15 12C15 12 13 14 9 14C5 14 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 9C3 9 5 7 9 7C13 7 15 9 15 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </RipplingLogoIcon>
          </MessageAvatar>
          <MessageContent theme={theme}>
            <MessageTime theme={theme}>{currentTime}</MessageTime>
            <MessageText theme={theme}>
              Tell us what's going on—the more detail you share, the faster we can resolve it or get you to the right person. You can also browse our{' '}
              <a href="https://help.rippling.com" target="_blank" rel="noopener noreferrer">
                Help Center
              </a>
              .
            </MessageText>
          </MessageContent>
        </MessageContainer>

        {/* Handoff: show the AI context as a user message */}
        {hasHandoff && (
          <>
            <UserMessageContainer theme={theme}>
              <UserBubble theme={theme}>
                I need additional help with a benefits question.
              </UserBubble>
            </UserMessageContainer>

            {/* Context card showing the AI conversation summary */}
            <MessageContainer theme={theme}>
              <MessageAvatar theme={theme}>
                <RipplingLogoIcon viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6C3 6 5 4 9 4C13 4 15 6 15 6M15 12C15 12 13 14 9 14C5 14 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 9C3 9 5 7 9 7C13 7 15 9 15 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </RipplingLogoIcon>
              </MessageAvatar>
              <MessageContent theme={theme}>
                {showBotReply ? (
                  <>
                    <MessageTime theme={theme}>{currentTime}</MessageTime>
                    <ContextCard theme={theme}>
                      <ContextCardLabel theme={theme}>From AI Assistant</ContextCardLabel>
                      <ContextCardText theme={theme}>{initialMessage}</ContextCardText>
                    </ContextCard>
                    <MessageText theme={theme}>
                      Thanks for reaching out. I can see you were chatting with Rippling AI about your benefits. Let me connect you with a support specialist who can help further. Please share any additional details below.
                    </MessageText>
                  </>
                ) : (
                  <MessageText theme={theme} style={{ color: theme.colorOnSurfaceVariant, fontStyle: 'italic' }}>
                    Typing...
                  </MessageText>
                )}
              </MessageContent>
            </MessageContainer>
          </>
        )}

        {/* Original closed state (only when no handoff) */}
        {!hasHandoff && isConversationClosedProp && (
          <ConversationClosedMessage theme={theme}>
            This conversation has been closed.
          </ConversationClosedMessage>
        )}
      </ChatBody>

      <Footer theme={theme}>
        <Disclaimer theme={theme}>
          Messages you send are received by Rippling and Decagon for this conversation. Some responses are AI-generated. Your use of this tool is subject to Rippling's{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); }}>
            User Privacy Notice
          </a>{' '}
          and{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); }}>
            User Terms of Service
          </a>
          .
        </Disclaimer>
        {isConversationClosed ? (
          <InputContainer theme={theme}>
            <Input
              theme={theme}
              type="text"
              placeholder="Ask a detailed question..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log('Message sent');
                }
              }}
            />
          </InputContainer>
        ) : (
          <StartNewChatButton
            theme={theme}
            onClick={() => {
              onStartNewChat?.();
            }}
          >
            Start a new chat
          </StartNewChatButton>
        )}
      </Footer>
    </WidgetContainer>
  );
};
