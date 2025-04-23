'use client';

import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'filled' | 'outlined';
    fullWidth?: boolean;
    children: React.ReactNode;
    className?: string;
    startIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'filled',
    fullWidth = false,
    children,
    className = '',
    startIcon,
    ...props
}) => {
    return (
        <button
            className={`button ${variant} ${fullWidth ? 'full-width' : ''} ${className}`}
            {...props}
        >
            {startIcon && <span className="button-icon">{startIcon}</span>}
            {children}
        </button>
    );
};

export default Button;
