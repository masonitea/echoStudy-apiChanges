import './Button.scss';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  bubbleOnClickEvent?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const Button = ({
  className,
  variant = 'primary',
  bubbleOnClickEvent = true,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button className={`button ${variant} ${className || ''}`} onClick={handleClick}>
      {children}
    </button>
  );

  function handleClick(event: React.MouseEvent) {
    if (!bubbleOnClickEvent) {
      event.stopPropagation();
    }
    onClick(event);
  }
};
