import React, { ReactNode, CSSProperties } from 'react';
import './Container.css';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
    return (
        <div className={`container ${className}`} style={style}>
            {children}
        </div>
    );
};

export default Container;
