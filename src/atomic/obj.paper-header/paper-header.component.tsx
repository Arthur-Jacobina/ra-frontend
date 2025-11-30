import type React from 'react';
import { Tabs } from '@/atomic/obj.tabs';
import { paperHeaderStyle, paperHeaderContentStyle } from './paper-header.component.style';

export interface PaperHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={paperHeaderStyle({ class: className })}>
      <div className={paperHeaderContentStyle()}>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger 
              value="highlights" 
              active={activeTab === 'highlights'}
            //   onClick={() => onTabChange('highlights')}
              className='text-neutral-soft hover:text-neutral-soft'
            >
              Highlights
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="requirements" 
              active={activeTab === 'requirements'}
            //   onClick={() => onTabChange('requirements')}
              className='text-neutral-soft hover:text-neutral-soft'
            >
              Requirements
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="chat" 
              active={activeTab === 'chat'}
              onClick={() => onTabChange('chat')}
            >
              Chat
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="notes" 
              active={activeTab === 'notes'}
            //   onClick={() => onTabChange('notes')}
              className='text-neutral-soft hover:text-neutral-soft'
            >
              Notes
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
    </div>
  );
};

PaperHeader.displayName = 'PaperHeader';

