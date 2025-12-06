import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { Chat } from '@/atomic/obj.chat';
import { PanelHeader } from '@/atomic/atm.panel-header/panel-header.component';
import { FaIcon } from '@/atomic/atm.fa-icon/fa-icon.component';
import { Sidebar } from '@/atomic/obj.sidebar';
import { SettingsPanel } from '@/atomic/obj.settings-panel';
import { IntegrationItem } from '@/atomic/obj.integration-item';

export const Route = createFileRoute('/ok')({
  component: RouteComponent,
});

type MessageState = {
  message: string;
  variant: "user" | "agent";
  isTyping?: boolean;
}

const API_BASE_URL = 'https://research-app-549892930696.us-central1.run.app';

async function sendChatMessage(message: string, userId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

function RouteComponent() {
  const [user] = useUserStore();
  const navigate = useNavigate();
  const [shopifyEnabled, setShopifyEnabled] = React.useState(false);

  const [messages, setMessages] = useState<MessageState[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Protect this route - redirect to login if not authenticated
  // Only run once on mount to avoid interfering with other navigation
  const hasCheckedAuth = React.useRef(false);
  React.useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      if (!user?.id || !user?.token) {
        navigate({ to: '/' });
      }
    }
  }, [user, navigate]);

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { message: userMessage, variant: "user", isTyping: false }]);
    setIsLoading(true);

    // Add typing indicator for agent
    setMessages(prev => [...prev, { message: "", variant: "agent", isTyping: true }]);

    try {
      const userId = user?.id || 'default-user';
      
      const response = await sendChatMessage(userMessage, userId);

      // Replace typing indicator with actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          message: response,
          variant: "agent",
          isTyping: false,
        };
        return newMessages;
      });
    } catch (error) {
      // Remove typing indicator and show error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          message: "Sorry, I encountered an error. Please try again.",
          variant: "agent",
          isTyping: false,
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopifyToggle = (enabled: boolean) => {
    setShopifyEnabled(enabled);
    console.log('Shopify integration:', enabled ? 'enabled' : 'disabled');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-medium p-lg">
      <div className="flex flex-row w-full max-w-[1400px] h-[80vh] bg-background-soft border-2 border-neutral-soft rounded-lg shadow-lg overflow-hidden">
        <Sidebar title="Ag">
          <Sidebar.Item onClick={() => navigate({ to: '/ok' })}>
            <FaIcon.Chat className="text-neutral text-2xl" />
          </Sidebar.Item>
          <Sidebar.Item onClick={() => navigate({ to: '/pdf/$paperId', params: { paperId: '2304.08467' } })}>
            <FaIcon.Chat className="text-neutral text-2xl" />
          </Sidebar.Item>
        </Sidebar>

        <div className="flex-1 flex flex-col border-r-2 border-neutral-soft">
          <PanelHeader title="New Chat" />

          <div className="flex-1 mt-md px-xl overflow-hidden flex flex-col bg-background-soft">
            <Chat>
              <Chat.Body>
                {messages.map((message, index) => (
                  <Chat.Message 
                    key={index} 
                    message={message.message} 
                    variant={message.variant as "user" | "agent"}
                    isTyping={message.isTyping}
                  />
                ))}
              </Chat.Body>
              <Chat.Input 
                disabled={isLoading} 
                placeholder="Write a message"
                onSend={handleSendMessage}
              />
            </Chat>
          </div>
        </div>

        <SettingsPanel title="MCP Settings">
          <SettingsPanel.Section title="Integrations">
            <IntegrationItem 
              name="Arxiv" 
              icon={<FaIcon.Arxiv />}
              iconSize="md"
              enabled={shopifyEnabled}
              onToggle={handleShopifyToggle}
            />
          </SettingsPanel.Section>
        </SettingsPanel>
      </div>
    </div>
  )
}
