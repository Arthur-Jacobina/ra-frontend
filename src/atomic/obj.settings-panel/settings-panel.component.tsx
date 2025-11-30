import type React from 'react';
import { PanelHeader } from '../atm.panel-header/panel-header.component';
import { 
  settingsPanelStyle,
  settingsSectionStyle,
  settingsSectionTitleStyle,
  settingsListStyle,
  type SettingsPanelStyleVariants,
} from './settings-panel.component.style';
import { H2 } from '../atm.typography/typography.component.style';

export interface SettingsPanelProps extends SettingsPanelStyleVariants {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsPanelRoot: React.FC<SettingsPanelProps> = ({
  title,
  children,
  width,
  className,
}) => {
  return (
    <div className={settingsPanelStyle({ width, class: className })}>
      <PanelHeader title={title} />
      {children}
    </div>
  );
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={settingsSectionStyle + (className ? ` ${className}` : '')}>
      <H2 className={settingsSectionTitleStyle}>{title}</H2>
      <div className={settingsListStyle}>
        {children}
      </div>
    </div>
  );
};

SettingsPanelRoot.displayName = 'SettingsPanel';
SettingsSection.displayName = 'SettingsSection';

export const SettingsPanel = Object.assign(SettingsPanelRoot, {
  Section: SettingsSection,
});

