'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import Cell from '@/Components/Cell/Cell';
import { useRegistrationStore } from '@/stores/registrationStore';
import { 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    FormHelperText 
} from '@mui/material';

interface PersonalInfoPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Default values for the form
const defaultPersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    gender: '',
};

export default function PersonalInfoPage({ params }: PersonalInfoPageProps) {
    const router = useRouter();
    const { 
        personalInfo = defaultPersonalInfo, // Provide default value
        updatePersonalInfo, 
        setCurrentStep,
        validateField,
        validateForm,
        formErrors = {} // Provide default value for formErrors
    } = useRegistrationStore();
    const resolvedParams = React.use(params);
    
    // Set the current step to 2 (index 2) when this page loads
    useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const field = e.target.name as keyof typeof personalInfo;
        const value = e.target.value as string;
        
        updatePersonalInfo({ [field]: value });
        validateField(field, value);
    };

    const handleNext = () => {
        if (validateForm()) {
            router.push(`/event/${resolvedParams.id}/payment`);
        }
    };

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center" gap="16">
                    <Typography type="title">
                        Información Personal
                    </Typography>
                </Row>
                
                <div style={{ margin: '2rem 0' }}>
                    <ProgressBar />
                </div>

                <Row justify="center" gap="16">
                    <Typography>
                        Por favor, completa tus datos personales
                    </Typography>
                </Row>

                <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="firstName"
                            value={personalInfo.firstName}
                            onChange={handleInputChange}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                        />

                        <TextField
                            fullWidth
                            label="Apellido"
                            name="lastName"
                            value={personalInfo.lastName}
                            onChange={handleInputChange}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                        />

                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={personalInfo.email}
                            onChange={handleInputChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />

                        <TextField
                            fullWidth
                            label="Teléfono"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handleInputChange}
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            inputProps={{ maxLength: 8 }}
                        />

                        <TextField
                            fullWidth
                            label="Nombre de Contacto de Emergencia"
                            name="emergencyContact"
                            value={personalInfo.emergencyContact}
                            onChange={handleInputChange}
                            error={!!formErrors.emergencyContact}
                            helperText={formErrors.emergencyContact}
                        />

                        <TextField
                            fullWidth
                            label="Teléfono de Contacto de Emergencia"
                            name="emergencyPhone"
                            value={personalInfo.emergencyPhone}
                            onChange={handleInputChange}
                            error={!!formErrors.emergencyPhone}
                            helperText={formErrors.emergencyPhone}
                            inputProps={{ maxLength: 8 }}
                        />

                        <FormControl fullWidth error={!!formErrors.gender}>
                            <InputLabel id="gender-label">Sexo</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={personalInfo.gender}
                                onChange={handleInputChange}
                                label="Sexo"
                            >
                                <MenuItem value="">
                                    <em>Seleccionar</em>
                                </MenuItem>
                                <MenuItem value="masculino">Masculino</MenuItem>
                                <MenuItem value="femenino">Femenino</MenuItem>
                                <MenuItem value="otro">Otro</MenuItem>
                            </Select>
                            {formErrors.gender && (
                                <FormHelperText>{formErrors.gender}</FormHelperText>
                            )}
                        </FormControl>
                    </div>

                    <Row justify="space-between" style={{ marginTop: '2rem' }}>
                        <Cell xs={4}>
                            <Button 
                                variant="outlined"
                                onClick={() => router.push(`/event/${resolvedParams.id}/event-detail`)}
                                fullWidth
                            >
                                Anterior
                            </Button>
                        </Cell>
                        <Cell xs={4}>
                            <Button 
                                variant="filled"
                                onClick={handleNext}
                                fullWidth
                            >
                                Siguiente
                            </Button>
                        </Cell>
                    </Row>
                </form>
            </Card>
        </Container>
    );
} 