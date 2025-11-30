import type React from 'react';
import { Toggle } from '../atm.toggle/toggle.component';
import { 
  toolItemStyle, 
  toolNameStyle,
  type ToolItemStyleVariants,
} from './tool-item.component.style';
import { Body } from '../atm.typography/typography.component.style';

export interface ToolItemProps extends ToolItemStyleVariants {
  name: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  className?: string;
}

export const ToolItem: React.FC<ToolItemProps> = ({
  name,
  enabled = false,
  onToggle,
  variant,
  className,
}) => {
  return (
    <div className={toolItemStyle({ variant, class: className })}>
      <Body className={toolNameStyle}>{name}</Body>
      <Toggle checked={enabled} onChange={onToggle} />
    </div>
  );
};

ToolItem.displayName = 'ToolItem';

