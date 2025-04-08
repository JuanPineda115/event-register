'use client';

import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'filled' | 'outlined';
    fullWidth?: boolean;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'filled',
    fullWidth = false,
    children,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`button ${variant} ${fullWidth ? 'full-width' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
