import { Body } from "@/atomic/atm.typography/typography.component.style";
import Markdown from 'react-markdown'
import { messageBubbleStyle } from "./chat-message.style";
import { useState, useEffect, useRef } from "react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-xs min-h-[24px]">
      <span className="w-sm h-sm bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></span>
      <span className="w-sm h-sm bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></span>
      <span className="w-sm h-sm bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></span>
    </div>
  );
}

export function ChatMessage({ 
  message, 
  variant = "agent",
  isTyping = false,
  streamingSpeed = 20
}: { 
  message: string;
  variant?: "user" | "agent" | "cta";
  isTyping?: boolean;
  streamingSpeed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  useEffect(() => {
    if (variant === "agent" && !isTyping && message) {
      setDisplayedText("")
      
      let currentIndex = 0
      const intervalId = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedText(message.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(intervalId)
        }
      }, streamingSpeed)
      
      return () => clearInterval(intervalId)
    } else {
      setDisplayedText(message)
    }
  }, [message, variant, isTyping, streamingSpeed])
  
  return (
    <div 
      ref={containerRef}
      className={`flex flex-row items-start gap-sm ${variant === "user" ? "justify-end" : "justify-start"} 
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-[0px]' : 'opacity-0 translate-y-[10px]'}`}
    >
      <div className={messageBubbleStyle({ variant })}>
        {isTyping && variant === "agent" ? (
          <TypingIndicator />
        ) : (
          <Markdown components={{
            p: ({ children }) => <Body className={variant === "cta" ? "text-neutral-xxsoft font-normal" : ""}>{children}</Body>,
            img: ({ src, alt }) => <img src={src} alt={alt} className="w-full h-auto rounded-sm my-sm" />,
          }}>
            {variant === "agent" ? displayedText : message}
          </Markdown>
        )}
      </div>
    </div>
  );
}

