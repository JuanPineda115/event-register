'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import { useRegistrationStore } from '@/stores/registrationStore';

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EventPage({ params }: EventPageProps) {
    const router = useRouter();
    const { setCurrentStep } = useRegistrationStore();
    const resolvedParams = React.use(params);
    
    // Set the current step to 0 (index 0) when this page loads
    useEffect(() => {
        setCurrentStep(0);
    }, [setCurrentStep]);
    
    if (!resolvedParams) {
        return null;
    }

    // In a real application, you would fetch event data based on the ID
    const eventData = {
        title: `Event ${resolvedParams.id}`,
        description: 'Registro de evento deportivo',
        imageUrl: '/event-placeholder.jpg', // You'll need to add this image to your public folder
    };

    return (
        <Container>
            <Card className="registration-card">
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
                
                <Row style={{ margin: '2rem 0' }}>
                    <ProgressBar />
                </Row>

                <Row justify="center" gap="16" style={{ marginTop: '2rem' }}>
                    <Button 
                        variant="filled"
                        onClick={() => router.push(`/event/${resolvedParams.id}/event-detail`)}
                    >
                        Comenzar Registro
                    </Button>
                </Row>
            </Card>
        </Container>
    );
} 