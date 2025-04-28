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
import { useGroupRegistrationStore } from '@/stores/groupRegistrationStore';
import eventStore from '@/stores/eventStore';
import { registerForEvent } from '@/services/registrationService';
import {
    individualRegistrationRequest,
    groupRegistrationRequest,
    spectatorRegistrationRequest
} from '@/types/registration';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    SelectChangeEvent,
    Box,
    InputAdornment,
    Alert,
    Snackbar
} from '@mui/material';
import { Icon } from '@systeminfected/react-payment-icons';
import { useSpectatorStore } from '@/stores/spectatorStore';

interface PaymentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
    const router = useRouter();
    const { setCurrentStep, personalInfo, resetRegistration } = useRegistrationStore();
    const resolvedParams = React.use(params);
    const { event, isLoading, error: eventError, fetchEvent } = eventStore();
    const { registrationType } = useRegistrationTypeStore();
    const { paymentInfo, errors, updatePaymentInfo, validateField, validateForm, resetPayment } = usePaymentStore();
    const { formatDataForApi: formatSpectatorData, resetSpectator } = useSpectatorStore();
    const { formatDataForApi: formatGroupData, resetGroupRegistration } = useGroupRegistrationStore();
    const { teamName, contactEmail, teamMembers, formatDataForApi } = useGroupRegistrationStore();
    const [error, setError] = useState<string | null>(null);

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
        if (registrationType === 'groups') {
            router.push(`/event/${resolvedParams.id}/group-info`);
        } else {
            router.push(`/event/${resolvedParams.id}/personal-info`);
        }
    };

    const handleNext = async () => {
        if (validateForm()) {
            try {
                setError(null);
                let registrationData;

                switch (registrationType) {
                    case 'individual':
                        registrationData = {
                            is_athlete: true,
                            event_id: parseInt(resolvedParams.id),
                            courtesy_code: '',
                            tshirt_size: personalInfo.size,
                            gender: personalInfo.gender,

                            full_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                            email: personalInfo.email,
                            phone_number: personalInfo.phone,

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

                            simulate: false
                        } as individualRegistrationRequest;
                        break;

                    case 'groups':
                        registrationData = formatGroupData(parseInt(resolvedParams.id), paymentInfo);
                        break;

                    case 'spectator':
                        registrationData = formatSpectatorData(parseInt(resolvedParams.id), paymentInfo);
                        break;
                }

                await registerForEvent(registrationData);

                // Clear all states after successful registration
                resetPayment();
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

                router.push(`/event/${resolvedParams.id}/payment-success`);
            } catch (error) {
                console.error('Registration failed:', error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al procesar el pago. Por favor, intenta nuevamente.');
                }
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

    if (eventError) {
        return (
            <Container>
                <Card className="registration-card">
                    <Row justify="center">
                        <Typography type="title">Error: {eventError}</Typography>
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
                                    {Array.from({ length: 20 }, (_, i) => {
                                        const year = 2020 + i;
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

                        <Typography type="subtitle" className="mt-6 mb-4">
                            Información de Facturación
                        </Typography>

                        <TextField
                            fullWidth
                            label="Ciudad"
                            name="clientCity"
                            value={paymentInfo.clientCity}
                            onChange={handleInputChange}
                            error={!!errors.clientCity}
                            helperText={errors.clientCity}
                            className="mb-4"
                        />

                        <TextField
                            fullWidth
                            label="Departamento"
                            name="clientState"
                            value={paymentInfo.clientState}
                            onChange={handleInputChange}
                            error={!!errors.clientState}
                            helperText={errors.clientState}
                            className="mb-4"
                        />

                        <TextField
                            fullWidth
                            label="Código Postal"
                            name="clientPostalCode"
                            value={paymentInfo.clientPostalCode}
                            onChange={handleInputChange}
                            error={!!errors.clientPostalCode}
                            helperText={errors.clientPostalCode}
                            className="mb-4"
                            inputProps={{ maxLength: 5 }}
                        />

                        <TextField
                            fullWidth
                            label="Dirección"
                            name="clientLocation"
                            value={paymentInfo.clientLocation}
                            onChange={handleInputChange}
                            error={!!errors.clientLocation}
                            helperText={errors.clientLocation}
                            className="mb-4"
                        />
                    </Row>

                    {/* Botones de acción */}
                    <Row justify="space-between" style={{ marginTop: '2rem' }}>
                        <Cell xs={4}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                fullWidth
                            >
                                Anterior
                            </Button>
                        </Cell>
                        <Cell xs={4}>
                            <Button
                                variant="filled"
                                type="submit"
                                fullWidth
                            >
                                Pagar
                            </Button>
                        </Cell>
                    </Row>
                </form>

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setError(null)}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Card>
        </Container>
    );
} 