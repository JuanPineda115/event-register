'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import Cell from '@/Components/Cell/Cell';
import { useRegistrationStore } from '@/stores/registrationStore';
import { useSpectatorStore } from '@/stores/spectatorStore';
import { useGroupRegistrationStore } from '@/stores/groupRegistrationStore';
import { useRegistrationTypeStore } from '@/stores/registrationTypeStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

interface PaymentSuccessPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { resetRegistration } = useRegistrationStore();
    const { resetSpectator } = useSpectatorStore();
    const { resetGroupRegistration } = useGroupRegistrationStore();
    const { registrationType } = useRegistrationTypeStore();

    const handleStartOver = () => {
        // Reset all stores based on registration type
        switch (registrationType) {
            case 'individual':
                resetRegistration();
                break;
            case 'spectator':
                resetSpectator();
                break;
            case 'groups':
                resetGroupRegistration();
                break;
        }

        // Navigate back to event detail
        router.push(`/event/${resolvedParams.id}/event-detail`);
    };

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center" style={{ flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: green[500] }} />

                    <Typography type="title" style={{ textAlign: 'center' }}>
                        ¡Registro Exitoso!
                    </Typography>

                    <Typography style={{ textAlign: 'center' }}>
                        Tu registro ha sido procesado correctamente.
                        {registrationType === 'spectator'
                            ? ' Recibirás tus entradas por correo electrónico.'
                            : ' Recibirás un correo electrónico con los detalles de tu registro.'}
                    </Typography>

                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Cell xs={6} md={4}>
                            <Button
                                variant="filled"
                                onClick={handleStartOver}
                                fullWidth
                            >
                                Registrar Otro Participante
                            </Button>
                        </Cell>
                    </Row>
                </Row>
            </Card>
        </Container>
    );
} 