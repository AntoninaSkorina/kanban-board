/* eslint-disable react/jsx-props-no-spreading */
import { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.scss';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: 'default' | 'filled';
}

const IconButton = ({
  children,
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) => (
  <button
    type="button"
    className={`icon-button icon-button--${variant} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
