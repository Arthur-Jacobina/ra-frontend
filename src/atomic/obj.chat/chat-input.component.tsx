import { FaIcon } from "@/atomic/atm.fa-icon/fa-icon.component";
import { Body } from "../atm.typography/typography.component.style";

export function ChatInputComponent({ 
  disabled = false,
  placeholder = "Type your message here",
  onSend,
}: { 
  disabled?: boolean;
  placeholder?: string;
  onSend?: (message: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    
    if (message.trim() && onSend) {
      onSend(message);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="mt-md">
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col max-w-[40vw] border-1 shadow-md border-neutral-soft rounded-md ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {/* Input Row */}
          <div className="flex flex-row items-center px-md py-sm">
            <input 
              type="text" 
              name="message"
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full p-sm text-neutral-strongg rounded-lg px-md py-sm text-md focus:outline-none ${disabled ? 'cursor-not-allowed' : ''}`}
            />
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex flex-row items-center justify-between px-lg pb-sm">
            <div className="flex flex-row items-center gap-sm">
              <button 
                type="button" 
                className="w-lg h-lg rounded hover:bg-neutral-soft transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                disabled={disabled}
                onClick={() => {/* Add @ action here */}}
              >
                <Body className="text-neutral-strong text-lg">@</Body>
              </button>
              <button 
                type="button" 
                className="w-lg h-lg rounded hover:bg-neutral-soft transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                disabled={disabled}
                onClick={() => {/* Add plus action here */}}
              >
                <FaIcon.Plus className="text-neutral-strong text-xl" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={disabled}
              className="group w-lg h-lg rounded hover:bg-primary/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
            >
              <FaIcon.ArrowUp className="text-neutral-strong group-hover:text-primary text-xl transition-colors" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

