import type React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: string;
}

export function Drawer({ isOpen, onClose, children, side = 'right', width = 'w-1/2' }: DrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-600" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full ${width} bg-background-medium z-50 transform transition-transform duration-600 ease-in-out ${
          isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
        }`}>
        {/* Content */}
        <div className="h-full overflow-y-auto p-8">{children}</div>
      </div>
    </>
  );
}
