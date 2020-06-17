import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Banner/banner';
import { css } from '@patternfly/react-styles';

export interface BannerProps extends React.HTMLProps<HTMLButtonElement> {
  /** Content rendered inside the banner */
  children?: React.ReactNode;
  /** Additional classes added to the banner */
  className?: string;
  /** Variant styles for the banner */
  variant?: 'default' | 'info' | 'danger' | 'success' | 'warning';
  /** If set to true, the banner sticks to the top of its container */
  isSticky?: boolean;
}

const variantStyle = {
  ['default']: '',
  ['info']: styles.modifiers.info,
  ['danger']: styles.modifiers.danger,
  ['success']: styles.modifiers.success,
  ['warning']: styles.modifiers.warning
};

export const Banner: React.FunctionComponent<BannerProps> = ({
  children,
  className,
  variant = 'default',
  isSticky = false
}: BannerProps) => (
  <div className={css(styles.banner, variantStyle[variant], isSticky && styles.modifiers.sticky, className)}>
    {children}
  </div>
);
Banner.displayName = 'Banner';
