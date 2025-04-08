'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';

interface EventPageProps {
    params: {
        id: string;
    };
}

export default function EventPage({ params }: EventPageProps) {
    const router = useRouter();
    if (!params) {
        return;
    }
    // In a real application, you would fetch event data based on the ID
    const eventData = {
        title: `Event ${params.id}`,
        description: 'Registro de evento deportivo',
        imageUrl: '/event-placeholder.jpg', // You'll need to add this image to your public folder
    };

    const registrationSteps = [
        { label: 'Inicio', completed: true, current: false },
        { label: 'Información Personal', completed: false, current: true },
        { label: 'Detalles y reglamento', completed: false, current: false },
        { label: 'Pago', completed: false, current: false },
    ];

    return (
        <Container>
            <Card className="event-card">
                <Row justify="center" gap="16">
                    <img 
                        src={eventData.imageUrl} 
                        alt={eventData.title}
                        style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} 
                    />
                </Row>
                <Row justify="center" gap="16">
                    <Typography type="title">
                        {eventData.description}
                    </Typography>
                </Row>
                
                <div style={{ margin: '2rem 0' }}>
                    <ProgressBar steps={registrationSteps} />
                </div>

                <Row justify="center" gap="16">
                    <Typography>
                        Por favor, completa tus datos personales
                    </Typography>
                </Row>

                <Row justify="center" gap="16" style={{ marginTop: '2rem' }}>
                    <Button 
                        variant="filled"
                        onClick={() => router.push(`/event/${params.id}/personal-info`)}
                    >
                        Comenzar Registro
                    </Button>
                </Row>
            </Card>
        </Container>
    );
} 