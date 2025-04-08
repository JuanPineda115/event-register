import React from 'react';
import './[id]/styles.css';

export default function EventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main style={{ 
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '20px'
        }}>
            {children}
        </main>
    );
} 