import type { ReactNode } from "react";

export function Chat({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-[95vh] min-w-[40vw]">
      {children}
    </div>
  );
}

