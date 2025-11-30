import type * as React from 'react';
import { FaIcon } from '../atm.fa-icon/fa-icon.component';
import { type StyleVariants, style } from './activity-indicator.component.style';

export const ActivityIndicatorTypes = {
  spinner: FaIcon.LoaderSpinner,
  circle: FaIcon.LoaderCircle,
  sync: FaIcon.LoaderSync,
  cog: FaIcon.LoaderCog,
};

export type ActivityIndicatorType = keyof typeof ActivityIndicatorTypes;

export interface ActivityIndicatorProps extends StyleVariants {
  type: ActivityIndicatorType;
  size?: string | number;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = props => {
  const { type, size = '24px' } = props;

  const Loader = ActivityIndicatorTypes[type || 'spinner'];

  return <Loader className={style()} size={size} />;
};
