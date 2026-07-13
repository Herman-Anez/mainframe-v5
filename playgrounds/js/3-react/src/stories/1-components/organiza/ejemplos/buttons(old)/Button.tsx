import React from 'react';

import './button.css';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  text: string;
  size?: "1" | "2"
  handleClick?: () => void;
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({ text, size, handleClick, onClick }: ButtonProps) => {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
      >
        {text}
      </button>
      <button
        type="button"
        onClick={handleClick}
      >
        {size}
      </button>
    </>
  );
};
