import React, { ReactNode, CSSProperties } from 'react';
import './Typography.css';

interface TypographyProps {
    children: ReactNode;
    className?: string;
    type?: 'title' | 'subtitle' | 'subsubtitle' | 'text' | 'caption' | 'link' | 'label' | 'error';
    align?: 'left' | 'center' | 'right';
    justify?: boolean;
    style?: CSSProperties;
    dataType?: string;
}

const Typography: React.FC<TypographyProps> = ({
    children,
    className = '',
    type = 'text',
    align = 'left',
    justify = false,
    style,
    dataType,
}) => {
    const alignClass = `text-${align}`;
    const justifyClass = justify ? 'text-justify' : '';

    switch (type) {
        case 'title':
            return (
                <h1 style={style} className={`title ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </h1>
            );
        case 'subtitle':
            return (
                <h2 style={style} className={`subtitle ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </h2>
            );
        case 'subsubtitle':
            return (
                <h3 style={style} className={`subsubtitle ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </h3>
            );
        case 'caption':
            return (
                <span style={style} className={`caption ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </span>
            );
        case 'link':
            return (
                <a href="#" className={`link ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </a>
            );
        case 'label':
            return (
                <label className={`label ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </label>
            );
        case 'error':
            return (
                <p className={`error ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </p>
            );
        default:
            return (
                <p style={style} className={`text ${alignClass} ${justifyClass} ${className}`} data-type={dataType}>
                    {children}
                </p>
            );
    }
};

export default Typography;
