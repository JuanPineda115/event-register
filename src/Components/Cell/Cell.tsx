import React, { ReactNode, CSSProperties } from 'react';
import './Cell.css';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CellProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const Cell: React.FC<CellProps> = ({ 
    children, 
    className = '', 
    style,
    xs,
    sm,
    md,
    lg,
    xl
}) => {
    const getColumnClass = (breakpoint: Breakpoint, value?: CellProps[Breakpoint]) => {
        if (value === undefined) return '';
        return `cell-${breakpoint}-${value}`;
    };

    const columnClasses = [
        getColumnClass('xs', xs),
        getColumnClass('sm', sm),
        getColumnClass('md', md),
        getColumnClass('lg', lg),
        getColumnClass('xl', xl)
    ].filter(Boolean).join(' ');

    return (
        <div className={`cell ${columnClasses} ${className}`} style={style}>
            {children}
        </div>
    );
};

export default Cell;
