import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { 
  Loader2,
} from 'lucide-react'
import { Chat } from '@/atomic/obj.chat'
import { useUserStore } from '@/stores/user-store'
import { PaperHeader } from '@/atomic/obj.paper-header'
import { Highlights } from '@/components/highlights'

export const Route = createFileRoute('/pdf/$paperId')({
  component: RouteComponent,
})

interface Message {
  id: string
  text: string
  variant: 'user' | 'agent'
  isTyping?: boolean
}

const API_BASE_URL = 'https://research-app-549892930696.us-central1.run.app'

async function parseAndAddPaper(paperId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/paper/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paper_id: paperId }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Paper parsed and added to database:', data)
    return data
  } catch (error) {
    console.error('Error parsing and adding paper:', error)
    throw error
  }
}

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
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

function RouteComponent() {
  const { paperId } = Route.useParams()
  const [user] = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('chat')
  const hasInitialized = useRef(false)
  const hasParsedPaper = useRef(false)

  // PDF URL from arXiv with viewer configuration
  // #toolbar=0 hides the toolbar, #navpanes=0 hides navigation pane, #scrollbar=0 hides scrollbar
  const pdfUrl = `https://arxiv.org/pdf/${paperId}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH`

  // Parse and add paper to database on mount
  useEffect(() => {
    if (!hasParsedPaper.current && paperId) {
      hasParsedPaper.current = true
      parseAndAddPaper(paperId).catch(error => {
        console.error('Failed to parse and add paper:', error)
      })
    }
  }, [paperId])

  // Send arXiv URL as first message on mount
  useEffect(() => {
    if (!hasInitialized.current && paperId) {
      hasInitialized.current = true
      const arxivUrl = `https://arxiv.org/html/${paperId}`
      handleSendMessage(arxivUrl, false)
    }
  }, [paperId])

  const handleSendMessage = async (message: string, showMessage: boolean = true) => {
    if (!message.trim() || isAssistantTyping) return

    if (showMessage) {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
        variant: 'user'
      }
      setMessages(prev => [...prev, userMessage])
    }
    
    setIsAssistantTyping(true)

    try {
      const userId = user?.id || 'default-user'
      
      const response = await sendChatMessage(message, userId)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        variant: 'agent',
        isTyping: false
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        variant: 'agent',
        isTyping: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsAssistantTyping(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-soft">
      <div className="flex flex-1 min-w-0">
        <div className={`relative flex flex-col transition-all duration-300 w-[80%]`} style={{ backgroundColor: '#ffffff' }}>
          <div className="flex-1 relative" style={{ overflow: 'hidden', backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background-soft z-10">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-neutral-strong animate-spin mx-auto mb-4" />
                  <p className="text-lg text-neutral-strong tracking-wider">
                    Loading
                    <span className="inline-block w-4">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse delay-100">.</span>
                      <span className="animate-pulse delay-200">.</span>
                    </span>
                  </p>
                </div>
              </div>
            )}
              <iframe
                src={pdfUrl}
                style={{ 
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  margin: '-2px',  
                  padding: 0,
                  display: 'block',
                  transform: 'scale(1.02)',
                }}
                title="PDF Viewer"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                }}
              />
          </div>
        </div>

 
          <div className="w-[50%] min-h-screen flex flex-col border-l border-neutral-soft bg-neutral-xxsoft">
          <PaperHeader 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
            <div className="min-h-screen flex flex-col px-md bg-background-soft">
              {activeTab === 'chat' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Chat>
                    <Chat.Body>
                      {messages.map((msg) => (
                        <Chat.Message
                          key={msg.id}
                          message={msg.text}
                          variant={msg.variant}
                          isTyping={msg.isTyping}
                        />
                      ))}
                      {isAssistantTyping && (
                        <Chat.Message
                          key="typing-indicator"
                          message=""
                          variant="agent"
                          isTyping={true}
                        />
                      )}
                    </Chat.Body>
                    <Chat.Input 
                      placeholder="Ask me anything about this paper..."
                      onSend={handleSendMessage}
                      disabled={isAssistantTyping}
                    />
                  </Chat>
                </div>
              )}

              {activeTab === 'highlights' && (
                <Highlights paperId={paperId} />
              )}

              {activeTab === 'requirements' && (
                <div className="flex flex-col gap-y-md py-md">
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}