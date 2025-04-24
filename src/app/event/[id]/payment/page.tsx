'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import Cell from '@/Components/Cell/Cell';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useRegistrationTypeStore } from '@/stores/registrationTypeStore';
import eventStore from '@/stores/eventStore';
import { registerForEvent } from '@/services/registrationService';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    SelectChangeEvent,
    Box,
    InputAdornment
} from '@mui/material';
import { Icon } from '@systeminfected/react-payment-icons';

interface PaymentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
    const router = useRouter();
    const { setCurrentStep, personalInfo } = useRegistrationStore();
    const resolvedParams = React.use(params);
    const { event, isLoading, error, fetchEvent } = eventStore();
    const { registrationType } = useRegistrationTypeStore();
    const { paymentInfo, errors, updatePaymentInfo, validateField, validateForm } = usePaymentStore();

    useEffect(() => {
        setCurrentStep(3);
    }, [setCurrentStep]);

    useEffect(() => {
        if (resolvedParams?.id) {
            fetchEvent(resolvedParams.id);
        }
    }, [resolvedParams?.id, fetchEvent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
        const field = e.target.name as keyof typeof paymentInfo;
        const value = e.target.value as string;

        updatePaymentInfo({ [field]: value });
        validateField(field, value);
    };

    const handleBack = () => {
        router.push(`/event/${resolvedParams.id}/personal-info`);
    };

    const handleNext = async () => {
        if (validateForm()) {
            try {
                const registrationData = {
                    is_athlete: registrationType === 'individual',
                    event_id: parseInt(resolvedParams.id),
                    courtesy_code: '',

                    full_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                    email: personalInfo.email,
                    phone_number: personalInfo.phone,
                    gender: personalInfo.gender,
                    tshirt_size: personalInfo.size,

                    client_first_name: personalInfo.firstName,
                    client_last_name: personalInfo.lastName,
                    client_phone: personalInfo.phone,
                    client_email: personalInfo.email,
                    client_country: personalInfo.phoneCountry,
                    client_city: 'Guatemala',
                    client_state: 'Guatemala',
                    client_postal_code: '01011',
                    client_location: 'Zona 1',

                    card_name: paymentInfo.cardHolder,
                    expiration_month: paymentInfo.expiryMonth,
                    expiration_year: paymentInfo.expiryYear.slice(-2),
                    card_number: paymentInfo.cardNumber,
                    cvv: paymentInfo.cvv,

                    simulate: true
                };

                await registerForEvent(registrationData);
            } catch (error) {
                console.error('Registration failed:', error);
                // Handle error (show error message to user)
            }
        }
    };

    const getRegistrationAmount = () => {
        if (!event) return 0;
        switch (registrationType) {
            case 'individual':
                return parseFloat(event.individual_price) + parseFloat(event.individual_fee);
            case 'groups':
                return parseFloat(event.group_price) + parseFloat(event.group_fee);
            case 'spectator':
                return parseFloat(event.spectator_price) + parseFloat(event.spectator_fee);
            default:
                return 0;
        }
    };

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

    const amount = getRegistrationAmount();

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center">
                    <Typography type="title">
                        Pago
                    </Typography>
                </Row>

                <Row>
                    <ProgressBar />
                </Row>

                <Row style={{ flexDirection: "column" }} justify="center" gap={1}>
                    <Typography type="subtitle">
                        Detalle de pago
                    </Typography>
                    <Typography>
                        Tipo de Registro: {registrationType === 'individual' ? 'Individual' :
                            registrationType === 'groups' ? 'Grupo' :
                                'Espectador'}
                    </Typography>
                    <Typography>
                        Precio Base: Q{registrationType === 'individual' ? event.individual_price :
                            registrationType === 'groups' ? event.group_price :
                                event.spectator_price}
                    </Typography>
                    <Typography>
                        Cargo por Servicio: Q{registrationType === 'individual' ? event.individual_fee :
                            registrationType === 'groups' ? event.group_fee :
                                event.spectator_fee}
                    </Typography>
                    <Typography type="subtitle" style={{ marginTop: '1rem' }}>
                        Total a Pagar: Q{amount.toFixed(2)}
                    </Typography>
                </Row>

                <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
                    <Row gap={1}>
                        <TextField
                            fullWidth
                            label="Número de Tarjeta"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handleInputChange}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                            placeholder="1234 5678 9012 3456"
                        />

                        <TextField
                            fullWidth
                            label="Nombre del Titular"
                            name="cardHolder"
                            value={paymentInfo.cardHolder}
                            onChange={handleInputChange}
                            error={!!errors.cardHolder}
                            helperText={errors.cardHolder}
                        />

                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <FormControl fullWidth error={!!errors.expiryMonth}>
                                <InputLabel id="expiry-month-label">Mes</InputLabel>
                                <Select
                                    labelId="expiry-month-label"
                                    name="expiryMonth"
                                    value={paymentInfo.expiryMonth}
                                    onChange={handleInputChange}
                                    label="Mes"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                            {(i + 1).toString().padStart(2, '0')}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.expiryMonth && (
                                    <FormHelperText>{errors.expiryMonth}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth error={!!errors.expiryYear}>
                                <InputLabel id="expiry-year-label">Año</InputLabel>
                                <Select
                                    labelId="expiry-year-label"
                                    name="expiryYear"
                                    value={paymentInfo.expiryYear}
                                    onChange={handleInputChange}
                                    label="Año"
                                >
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return (
                                            <MenuItem key={year} value={year.toString()}>
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                                {errors.expiryYear && (
                                    <FormHelperText>{errors.expiryYear}</FormHelperText>
                                )}
                            </FormControl>
                        </Box>

                        <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handleInputChange}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                            placeholder={paymentInfo.cardType === 'amex' ? '4 dígitos' : '3 dígitos'}
                        />
                    </Row>

                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Cell xs={4}>
                            <Button variant="outlined" onClick={handleBack} fullWidth>
                                Volver
                            </Button>
                        </Cell>
                        <Cell xs={4}>
                            <Button variant="filled" onClick={handleNext} fullWidth>
                                Pagar
                            </Button>
                        </Cell>
                    </Row>
                </form>
            </Card>
        </Container>
    );
} 