'use client';

import React from 'react';
import Row from '@/Components/Row/Row';
import Cell from '@/Components/Cell/Cell';
import './ProgressBar.css';
import Typography from '../Typography/Typography';
import { useRegistrationStore } from '@/stores/registrationStore';

interface ProgressBarProps {
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className = '' }) => {
    const steps = useRegistrationStore((state) => state.steps);

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
                    </React.Fragment>
                ))}
            </Row>
        </div>
    );
};

export default ProgressBar; 