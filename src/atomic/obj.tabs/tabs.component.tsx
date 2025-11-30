import type React from 'react';
import { tabsRootStyle, tabsListStyle, tabsTriggerStyle, type TabsTriggerStyleVariants } from './tabs.component.style';

interface TabsRootProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsRoot: React.FC<TabsRootProps> = ({ children, className }) => {
  return (
    <div className={tabsRootStyle({ class: className })}>
      {children}
    </div>
  );
};

TabsRoot.displayName = 'TabsRoot';

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={tabsListStyle({ class: className })}>
      {children}
    </div>
  );
};

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends TabsTriggerStyleVariants {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  children, 
  className, 
  onClick,
  value,
  ...rest 
}) => {
  return (
    <div
      className={tabsTriggerStyle({ ...rest, class: className })}
      onClick={onClick}
      role="tab"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
};

TabsTrigger.displayName = 'TabsTrigger';

