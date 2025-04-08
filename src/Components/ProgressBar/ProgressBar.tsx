'use client';

import React from 'react';
import Row from '@/Components/Row/Row';
import Cell from '@/Components/Cell/Cell';
import './ProgressBar.css';
import Typography from '../Typography/Typography';

interface Step {
    label: string;
    completed: boolean;
    current: boolean;
}

interface ProgressBarProps {
    steps: Step[];
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, className = '' }) => {
    return (
        <div className={`progress-container ${className}`}>
            <Row justify="space-between" align="center" className="progress-bar">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <Cell xs={3}>
                            <div className={`progress-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                                <div className="step-number">
                                    {step.completed ? '✓' : index + 1}
                                </div>
                                <Typography justify className="step-label">{step.label}</Typography>
                            </div>
                        </Cell>
                        {index < steps.length - 1 && (
                            <Cell xs={3}>
                                <div className={`progress-line ${step.completed ? 'completed' : ''}`} />
                            </Cell>
                        )}
                    </React.Fragment>
                ))}
            </Row>
        </div>
    );
};

export default ProgressBar; 