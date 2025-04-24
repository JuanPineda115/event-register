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
import { useRegistrationStore, FormErrors as AthleteFormErrors, PersonalInfo } from '@/stores/registrationStore';
import { useSpectatorStore, FormErrors as SpectatorFormErrors, SpectatorInfo } from '@/stores/spectatorStore';
import { useRegistrationTypeStore } from '@/stores/registrationTypeStore';
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
    const { registrationType } = useRegistrationTypeStore();
    const {
        personalInfo,
        updatePersonalInfo,
        setCurrentStep,
        validateField: validateAthleteField,
        validateForm: validateAthleteForm,
        formErrors: athleteErrors = {}
    } = useRegistrationStore();

    const {
        spectatorInfo,
        updateSpectatorInfo,
        validateField: validateSpectatorField,
        validateForm: validateSpectatorForm,
        formErrors: spectatorErrors = {}
    } = useSpectatorStore();

    const resolvedParams = React.use(params);

    useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
        const field = e.target.name as string;
        const value = e.target.value;

        if (registrationType === 'spectator') {
            updateSpectatorInfo({ [field]: field === 'quantity' ? Number(value) : value });
            validateSpectatorField(field as keyof SpectatorInfo, field === 'quantity' ? Number(value) : value as string);

            if (field === 'phoneCountry') {
                const currentPhone = spectatorInfo.phone;
                if (currentPhone) {
                    validateSpectatorField('phone', currentPhone);
                }
            }
        } else {
            updatePersonalInfo({ [field]: value });
            validateAthleteField(field as keyof PersonalInfo, value as string);

            if (field === 'phoneCountry' || field === 'emergencyPhoneCountry') {
                const phoneField = field === 'phoneCountry' ? 'phone' : 'emergencyPhone';
                const currentPhone = personalInfo[phoneField];
                if (currentPhone) {
                    validateAthleteField(phoneField, currentPhone);
                }
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
        const isValid = registrationType === 'spectator'
            ? validateSpectatorForm()
            : validateAthleteForm();

        if (isValid) {
            router.push(`/event/${resolvedParams.id}/payment`);
        }
    };

    const handleBack = () => {
        router.push(`/event/${resolvedParams.id}/event-detail`);
    };

    const info = registrationType === 'spectator' ? spectatorInfo : personalInfo;
    const errors = registrationType === 'spectator' ? spectatorErrors : athleteErrors;

    // Type guard for athlete errors
    const isAthleteErrors = (errors: SpectatorFormErrors | AthleteFormErrors): errors is AthleteFormErrors => {
        return registrationType !== 'spectator';
    };

    // Type guard for spectator errors
    const isSpectatorErrors = (errors: SpectatorFormErrors | AthleteFormErrors): errors is SpectatorFormErrors => {
        return registrationType === 'spectator';
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
                            value={info.firstName}
                            onChange={handleInputChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />

                        <TextField
                            fullWidth
                            label="Apellido"
                            name="lastName"
                            value={info.lastName}
                            onChange={handleInputChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />

                        {registrationType !== 'spectator' && isAthleteErrors(errors) && (
                            <FormControl fullWidth error={!!errors.gender}>
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
                                {errors.gender && (
                                    <FormHelperText>{errors.gender}</FormHelperText>
                                )}
                            </FormControl>
                        )}

                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={info.email}
                            onChange={handleInputChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        {/* Teléfono Personal con Selección de País */}
                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <Cell xs={6} md={3}>
                                <FormControl fullWidth error={!!errors.phoneCountry}>
                                    <InputLabel id="phone-country-label">País</InputLabel>
                                    <Select
                                        labelId="phone-country-label"
                                        name="phoneCountry"
                                        value={info.phoneCountry}
                                        onChange={handleInputChange}
                                        label="País"
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country.code} value={country.code}>
                                                {country.name} ({country.phoneCode})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.phoneCountry && (
                                        <FormHelperText>{errors.phoneCountry}</FormHelperText>
                                    )}
                                </FormControl>
                            </Cell>
                            <Cell xs={6} md={9}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="phone"
                                    value={info.phone}
                                    onChange={handleInputChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    disabled={!info.phoneCountry}
                                    placeholder={info.phoneCountry ?
                                        `${getPhoneValidation(info.phoneCountry)?.phoneCode || ''} Ingrese su número` :
                                        'Seleccione un país primero'
                                    }
                                />
                            </Cell>
                        </div>

                        {registrationType === 'spectator' && isSpectatorErrors(errors) && (
                            <TextField
                                fullWidth
                                label="Cantidad de Entradas"
                                name="quantity"
                                type="number"
                                value={spectatorInfo.quantity}
                                onChange={handleInputChange}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                                inputProps={{ min: 1, max: 10 }}
                            />
                        )}

                        {registrationType !== 'spectator' && isAthleteErrors(errors) && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Nombre de Contacto de Emergencia"
                                    name="emergencyContact"
                                    value={personalInfo.emergencyContact}
                                    onChange={handleInputChange}
                                    error={!!errors.emergencyContact}
                                    helperText={errors.emergencyContact}
                                />

                                {/* Teléfono de Emergencia con Selección de País */}
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <Cell xs={6} md={3}>
                                        <FormControl fullWidth error={!!errors.emergencyPhoneCountry}>
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
                                            {errors.emergencyPhoneCountry && (
                                                <FormHelperText>{errors.emergencyPhoneCountry}</FormHelperText>
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
                                            error={!!errors.emergencyPhone}
                                            helperText={errors.emergencyPhone}
                                            disabled={!personalInfo.emergencyPhoneCountry}
                                            placeholder={personalInfo.emergencyPhoneCountry ?
                                                `${getPhoneValidation(personalInfo.emergencyPhoneCountry)?.phoneCode || ''} Ingrese su número` :
                                                'Seleccione un país primero'
                                            }
                                        />
                                    </Cell>
                                </div>

                                <FormControl fullWidth error={!!errors.size}>
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
                                        <MenuItem value="XXL">XXL</MenuItem>
                                    </Select>
                                    {errors.size && (
                                        <FormHelperText>{errors.size}</FormHelperText>
                                    )}
                                </FormControl>
                            </>
                        )}
                    </Row>

                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Cell xs={4}>
                            <Button variant="outlined" onClick={handleBack} fullWidth>
                                Volver
                            </Button>
                        </Cell>
                        <Cell xs={4}>
                            <Button variant="filled" onClick={handleNext} fullWidth>
                                Siguiente
                            </Button>
                        </Cell>
                    </Row>
                </form>
            </Card>
        </Container>
    );
} 