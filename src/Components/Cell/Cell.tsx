import React, { ReactNode, CSSProperties } from 'react';
import './Cell.css';

interface CellProps {
    children: ReactNode;
    className?: string;
    width?: string;
    style?: CSSProperties;
}

const Cell: React.FC<CellProps> = ({ children, className = '', width = 'auto', style }) => {
    const widthClass = `cell-width-${width}`;

    return (
        <div className={`cell ${widthClass} ${className}`} style={style}>
            {children}
        </div>
    );
};

export default Cell;
