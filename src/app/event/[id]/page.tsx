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
import eventStore from '@/store/eventStore';

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EventPage({ params }: EventPageProps) {
    const router = useRouter();
    const { setCurrentStep } = useRegistrationStore();
    const resolvedParams = React.use(params);
    const { event, isLoading, error, fetchEvent } = eventStore();
    
    // Set the current step to 0 (index 0) when this page loads
    useEffect(() => {
        setCurrentStep(0);
    }, [setCurrentStep]);

    // Fetch event data when component mounts
    useEffect(() => {
        if (resolvedParams?.id) {
            fetchEvent(resolvedParams.id);
        }
    }, [resolvedParams?.id, fetchEvent]);

    // Handle 404 redirect
    useEffect(() => {
        if (error === 'Event not found') {
            router.push('/404');
        }
    }, [error, router]);
    
    if (!resolvedParams || isLoading) {
        return (
            <Container>
                <Card className="registration-card">
                    <Row justify="center">
                        <Typography type="title">Cargando...</Typography>
                    </Row>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Card className="registration-card">
                    <Row justify="center">
                        <Typography type="title">Error: {error}</Typography>
                    </Row>
                </Card>
            </Container>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center" >
                    {event.image_url && (
                        <img 
                            src={event.image_url} 
                            alt={event.name}
                            style={{ 
                                width: '120px', 
                                height: '120px', 
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} 
                        />
                    )}
                </Row>
                <Row justify="center" >
                    <Typography type="title">
                        {event.name}
                    </Typography>
                </Row>
                <Row justify="center" >
                    <Typography type="text">
                        {event.description}
                    </Typography>
                </Row>
                
                <Row>
                    <ProgressBar />
                </Row>

                <Row justify="center" style={{ marginTop: '2rem' }}>
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