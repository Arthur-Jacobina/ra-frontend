import type React from 'react';
import { H2 } from '../atm.typography/typography.component.style';
import { panelHeaderStyle, type PanelHeaderStyleVariants } from './panel-header.component.style';

export interface PanelHeaderProps extends PanelHeaderStyleVariants {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  children,
  variant,
  className,
}) => {
  return (
    <div className={panelHeaderStyle({ variant, class: className })}>
      <H2>{title}</H2>
      {children}
    </div>
  );
};

PanelHeader.displayName = 'PanelHeader';

