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
    FormHelperText,
    SelectChangeEvent
} from '@mui/material';

interface PersonalInfoPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Definición de países con sus códigos y longitudes de teléfono
const countries = [
    { code: 'GT', name: 'GT', phoneCode: '+502', minLength: 8, maxLength: 8 },
    { code: 'SV', name: 'SV', phoneCode: '+503', minLength: 8, maxLength: 8 },
    { code: 'HN', name: 'HN', phoneCode: '+504', minLength: 8, maxLength: 8 },
    { code: 'NI', name: 'NI', phoneCode: '+505', minLength: 8, maxLength: 8 },
    { code: 'CR', name: 'CR', phoneCode: '+506', minLength: 8, maxLength: 8 },
    { code: 'PA', name: 'PA', phoneCode: '+507', minLength: 8, maxLength: 8 },
    { code: 'MX', name: 'MX', phoneCode: '+52', minLength: 10, maxLength: 10 },
    { code: 'US', name: 'US', phoneCode: '+1', minLength: 10, maxLength: 10 },
];

export default function PersonalInfoPage({ params }: PersonalInfoPageProps) {
    const router = useRouter();
    const {
        personalInfo,
        updatePersonalInfo,
        setCurrentStep,
        validateField,
        validateForm,
        formErrors = {}
    } = useRegistrationStore();

    const resolvedParams = React.use(params);

    useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
        const field = e.target.name as keyof typeof personalInfo;
        const value = e.target.value as string;

        updatePersonalInfo({ [field]: value });
        validateField(field, value);

        if (field === 'phoneCountry' || field === 'emergencyPhoneCountry') {
            const phoneField = field === 'phoneCountry' ? 'phone' : 'emergencyPhone';
            const currentPhone = personalInfo[phoneField];
            if (currentPhone) {
                validateField(phoneField, currentPhone);
            }
        }
    };

    const getPhoneValidation = (countryCode: string) => {
        const country = countries.find(c => c.code === countryCode);
        return country ? {
            minLength: country.minLength,
            maxLength: country.maxLength,
            phoneCode: country.phoneCode
        } : null;
    };

    const handleNext = () => {
        console.log('Validating form...');
        if (validateForm()) {
            router.push(`/event/${resolvedParams.id}/payment`);
        }
    };

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center">
                    <Typography type="title">
                        Información Personal
                    </Typography>
                </Row>

                <Row>
                    <ProgressBar />
                </Row>

                <Row justify="center">
                    <Typography>
                        Por favor, completa tus datos personales
                    </Typography>
                </Row>

                <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
                    <Row gap={1}>
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

                        <FormControl fullWidth error={!!formErrors.gender}>
                            <InputLabel id="gender-label">Sexo</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={personalInfo.gender}
                                onChange={handleInputChange}
                                label="Sexo"
                            >
                                <MenuItem value="M">Masculino</MenuItem>
                                <MenuItem value="F">Femenino</MenuItem>
                            </Select>
                            {formErrors.gender && (
                                <FormHelperText>{formErrors.gender}</FormHelperText>
                            )}
                        </FormControl>

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

                        {/* Teléfono Personal con Selección de País */}
                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <Cell xs={6} md={3}>
                                <FormControl fullWidth error={!!formErrors.phoneCountry}>
                                    <InputLabel id="phone-country-label">País</InputLabel>
                                    <Select
                                        labelId="phone-country-label"
                                        name="phoneCountry"
                                        value={personalInfo.phoneCountry}
                                        onChange={handleInputChange}
                                        label="País"
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country.code} value={country.code}>
                                                {country.name} ({country.phoneCode})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formErrors.phoneCountry && (
                                        <FormHelperText>{formErrors.phoneCountry}</FormHelperText>
                                    )}
                                </FormControl>
                            </Cell>
                            <Cell xs={6} md={9}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="phone"
                                    value={personalInfo.phone}
                                    onChange={handleInputChange}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
                                    disabled={!personalInfo.phoneCountry}
                                    placeholder={personalInfo.phoneCountry ?
                                        `${getPhoneValidation(personalInfo.phoneCountry)?.phoneCode || ''} Ingrese su número` :
                                        'Seleccione un país primero'
                                    }
                                />
                            </Cell>
                        </div>

                        <TextField
                            fullWidth
                            label="Nombre de Contacto de Emergencia"
                            name="emergencyContact"
                            value={personalInfo.emergencyContact}
                            onChange={handleInputChange}
                            error={!!formErrors.emergencyContact}
                            helperText={formErrors.emergencyContact}
                        />

                        {/* Teléfono de Emergencia con Selección de País */}
                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <Cell xs={6} md={3}>
                                <FormControl fullWidth error={!!formErrors.emergencyPhoneCountry}>
                                    <InputLabel id="emergency-phone-country-label">País</InputLabel>
                                    <Select
                                        labelId="emergency-phone-country-label"
                                        name="emergencyPhoneCountry"
                                        value={personalInfo.emergencyPhoneCountry}
                                        onChange={handleInputChange}
                                        label="País"
                                    >

                                        {countries.map((country) => (
                                            <MenuItem key={country.code} value={country.code}>
                                                {country.name} ({country.phoneCode})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formErrors.emergencyPhoneCountry && (
                                        <FormHelperText>{formErrors.emergencyPhoneCountry}</FormHelperText>
                                    )}
                                </FormControl>
                            </Cell>
                            <Cell xs={6} md={9}>
                                <TextField
                                    fullWidth
                                    label="Teléfono de Emergencia"
                                    name="emergencyPhone"
                                    value={personalInfo.emergencyPhone}
                                    onChange={handleInputChange}
                                    error={!!formErrors.emergencyPhone}
                                    helperText={formErrors.emergencyPhone}
                                    disabled={!personalInfo.emergencyPhoneCountry}
                                    placeholder={personalInfo.emergencyPhoneCountry ?
                                        `${getPhoneValidation(personalInfo.emergencyPhoneCountry)?.phoneCode || ''} Ingrese su número` :
                                        'Seleccione un país primero'
                                    }
                                />

                            </Cell>
                        </div>

                        <FormControl fullWidth error={!!formErrors.size}>
                            <InputLabel id="size-label">Talla</InputLabel>
                            <Select
                                labelId="size-label"
                                name="size"
                                value={personalInfo.size}
                                onChange={handleInputChange}
                                label="Talla"
                            >
                                <MenuItem value="XS">XS</MenuItem>
                                <MenuItem value="S">S</MenuItem>
                                <MenuItem value="M">M</MenuItem>
                                <MenuItem value="L">L</MenuItem>
                                <MenuItem value="XL">XL</MenuItem>
                                <MenuItem value="2XL">2XL</MenuItem>
                            </Select>
                            {formErrors.size && (
                                <FormHelperText>{formErrors.size}</FormHelperText>
                            )}
                        </FormControl>
                    </Row>

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