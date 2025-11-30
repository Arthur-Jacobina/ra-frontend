import type React from 'react';
import { PanelHeader } from '../atm.panel-header/panel-header.component';
import { 
  sidebarContainerStyle, 
  sidebarItemStyle,
  type SidebarStyleVariants,
  type SidebarItemStyleVariants,
} from './sidebar.component.style';

export interface SidebarProps extends SidebarStyleVariants {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarItemProps extends SidebarItemStyleVariants {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SidebarRoot: React.FC<SidebarProps> = ({
  title,
  children,
  width,
  className,
}) => {
  return (
    <div className={sidebarContainerStyle({ width, class: className })}>
      <PanelHeader title={title} />
      {children}
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  onClick,
  active,
  className,
}) => {
  return (
    <div 
      className={sidebarItemStyle({ active, class: className })} 
      onClick={onClick}
      style={{ transform: 'translateY(-16px)' }}
    >
      {children}
    </div>
  );
};

SidebarRoot.displayName = 'Sidebar';
SidebarItem.displayName = 'SidebarItem';

export const Sidebar = Object.assign(SidebarRoot, {
  Item: SidebarItem,
});

