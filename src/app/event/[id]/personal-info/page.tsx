'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';

interface PersonalInfoPageProps {
    params: {
        id: string;
    };
}

export default function PersonalInfoPage({ params }: PersonalInfoPageProps) {
    const router = useRouter();
    const registrationSteps = [
        { label: 'Inicio', completed: true, current: false },
        { label: 'Información Personal', completed: false, current: true },
        { label: 'Detalles Médicos', completed: false, current: false },
        { label: 'Confirmación', completed: false, current: false },
    ];

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center" gap="16">
                    <Typography type="title">
                        Información Personal
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

                <form style={{ width: '100%', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                placeholder="Tu nombre"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="apellido" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                placeholder="Tu apellido"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tu@email.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="telefono" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                placeholder="+502 XXXX XXXX"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="emergencyContact" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Nombre de Contacto de Emergencia
                            </label>
                            <input
                                type="text"
                                id="emergencyContact"
                                placeholder="Nombre completo"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="emergencyPhone" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Teléfono de Contacto de Emergencia
                            </label>
                            <input
                                type="tel"
                                id="emergencyPhone"
                                placeholder="+502 XXXX XXXX"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="sexo" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Sexo
                            </label>
                            <select
                                id="sexo"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                    
                                }}
                            >
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <Row justify="center" gap="16" style={{ marginTop: '2rem' }}>
                        <Button 
                            variant="outlined"
                            onClick={() => router.push(`/event/${params.id}`)}
                        >
                            Anterior
                        </Button>
                        <Button 
                            variant="filled"
                            onClick={() => router.push(`/event/${params.id}/medical-info`)}
                        >
                            Siguiente
                        </Button>
                    </Row>
                </form>
            </Card>
        </Container>
    );
} 