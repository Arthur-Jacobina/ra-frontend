import type React from 'react';
import { Toggle } from '../atm.toggle/toggle.component';
import { 
  integrationItemStyle, 
  integrationIconStyle, 
  integrationLabelStyle,
  type IntegrationItemStyleVariants,
  type IntegrationIconStyleVariants,
} from './integration-item.component.style';
import { Body } from '../atm.typography/typography.component.style';

export interface IntegrationItemProps extends IntegrationItemStyleVariants {
  name: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconSize?: IntegrationIconStyleVariants['size'];
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  className?: string;
}

export const IntegrationItem: React.FC<IntegrationItemProps> = ({
  name,
  icon,
  iconColor = 'bg-neutral-soft',
  iconSize = 'md',
  enabled = false,
  onToggle,
  variant,
  className,
}) => {
  return (
    <div className={integrationItemStyle({ variant, class: className })}>
      <div className={integrationLabelStyle}>
        {icon ? (
          <div className={integrationIconStyle({ size: iconSize })}>
            {icon}
          </div>
        ) : (
          <div className={integrationIconStyle({ size: iconSize, class: iconColor })} />
        )}
        <Body>{name}</Body>
      </div>
      <Toggle checked={enabled} onChange={onToggle} />
    </div>
  );
};

IntegrationItem.displayName = 'IntegrationItem';

