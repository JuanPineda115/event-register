import React, { ReactNode, CSSProperties } from 'react';
import './Row.css';

interface RowProps {
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    gap?: string;
    style?: CSSProperties;
}

const Row: React.FC<RowProps> = ({ children, className = '', align = 'left', justify = 'flex-start', gap = '0', style }) => {
    const alignClass = `row-align-${align}`;
    const justifyClass = `row-justify-${justify}`;
    const gapClass = `row-gap-${gap}`;

    return (
        <div className={`row ${alignClass} ${justifyClass} ${gapClass} ${className}`} style={style}>
            {children}
        </div>
    );
};

export default Row;
