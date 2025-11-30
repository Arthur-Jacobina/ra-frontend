import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function ChatBody({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    observer.observe(scrollContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="flex flex-col gap-md flex-grow max-h-[80vh] overflow-y-auto pr-md scroll-smooth"
    >
      {children}
    </div>
  );
}

