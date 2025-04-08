import React, { ReactNode, CSSProperties } from 'react'
import './Card.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    selected?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", style, onClick, selected = false }) => {
    return (
        <div 
            className={`Card ${className} ${selected && 'selected'}`} 
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Card;