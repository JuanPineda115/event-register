'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Cell from '@/Components/Cell/Cell';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import { TextField } from '@mui/material';
import { useRegistrationStore } from '@/stores/registrationStore';

interface PaymentPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface PaymentForm {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}

interface FormErrors {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

export default function PaymentPage({ params }: PaymentPageProps) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { setCurrentStep } = useRegistrationStore();
    
    const [formData, setFormData] = useState<PaymentForm>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [cardType, setCardType] = useState<string>('');

    useEffect(() => {
        setCurrentStep(3);
    }, [setCurrentStep]);

    // Función para detectar el tipo de tarjeta basado en el número
    const detectCardType = (number: string): string => {
        const cleanNumber = number.replace(/\s+/g, '');
        
        // Patrones de tarjetas según OWASP
        const patterns = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
        };

        if (patterns.visa.test(cleanNumber)) return 'Visa';
        if (patterns.mastercard.test(cleanNumber)) return 'MasterCard';
        if (patterns.amex.test(cleanNumber)) return 'American Express';
        
        return '';
    };

    // Validación de número de tarjeta usando el algoritmo de Luhn
    const validateCardNumber = (number: string): boolean => {
        const digits = number.replace(/\s+/g, '').split('').map(Number);
        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const formatCardNumber = (value: string): string => {
        const cleaned = value.replace(/\s+/g, '');
        const parts = [];
        
        for (let i = 0; i < cleaned.length; i += 4) {
            parts.push(cleaned.substr(i, 4));
        }
        
        return parts.join(' ');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formateo específico para cada campo
        switch (name) {
            case 'cardNumber':
                formattedValue = formatCardNumber(value);
                const detectedType = detectCardType(value);
                setCardType(detectedType);
                break;
            case 'expiryDate':
                // Formato MM/YY
                formattedValue = value
                    .replace(/\D/g, '')
                    .replace(/^([0-9]{2})/, '$1/')
                    .substr(0, 5);
                break;
            case 'cvv':
                // Solo números, máximo 4 dígitos
                formattedValue = value.replace(/\D/g, '').substr(0, 4);
                break;
            case 'cardHolder':
                // Solo letras y espacios
                formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Limpiar error al escribir
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        // Validación del número de tarjeta
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'El número de tarjeta es requerido';
        } else if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Número de tarjeta inválido';
        }

        // Validación del titular
        if (!formData.cardHolder.trim()) {
            newErrors.cardHolder = 'El nombre del titular es requerido';
        } else if (formData.cardHolder.length < 3) {
            newErrors.cardHolder = 'Nombre del titular demasiado corto';
        }

        // Validación de fecha de vencimiento
        if (!formData.expiryDate) {
            newErrors.expiryDate = 'La fecha de vencimiento es requerida';
        } else {
            const [month, year] = formData.expiryDate.split('/').map(Number);
            if (month < 1 || month > 12) {
                newErrors.expiryDate = 'Mes inválido';
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiryDate = 'La tarjeta está vencida';
            }
        }

        // Validación del CVV
        if (!formData.cvv) {
            newErrors.cvv = 'El código de seguridad es requerido';
        } else if (formData.cvv.length < 3) {
            newErrors.cvv = 'Código de seguridad inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Aquí iría la lógica de procesamiento del pago
            console.log('Procesando pago...', formData);
        }
    };

    return (
        <Container>
            <Card className="registration-card">
                <Row justify="center">
                    <Typography type="title">Confirmación de Pago</Typography>
                </Row>

                <div style={{ margin: '2rem 0' }}>
                    <ProgressBar />
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Typography type="subtitle" className="mb-4">
                            Detalles de la Tarjeta {cardType && `(${cardType})`}
                        </Typography>

                        <TextField
                            fullWidth
                            label="Nombre del Titular"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleInputChange}
                            error={!!errors.cardHolder}
                            helperText={errors.cardHolder}
                            className="mb-4"
                        />
                        
                        <TextField
                            fullWidth
                            label="Número de Tarjeta"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                            inputProps={{ maxLength: 19 }}
                            className="mb-4"
                        />

                        <Row justify='space-between'>
                            <Cell style={{padding: 0}} xs={4} className="pr-2">
                                <TextField
                                    fullWidth
                                    label="MM/YY"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                    inputProps={{ maxLength: 5 }}
                                />
                            </Cell>
                            <Cell style={{padding: 0}} xs={4} className="pl-2">
                                <TextField
                                    fullWidth
                                    label="CVV"
                                    name="cvv"
                                    type="password"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                    inputProps={{ maxLength: 4 }}
                                />
                            </Cell>
                        </Row>
                        

                        {/* Total */}
                        <Typography type="subtitle" className="mb-2">
                            Total a Pagar
                        </Typography>
                        <Typography className="text-2xl font-bold text-blue-600">
                            GTQ 100.00
                        </Typography>
                    </div>

                    {/* Botones de acción */}
                    <Row justify="center" style={{ marginTop: '2rem' }}>
                        <Cell xs={4}>
                            <Button 
                                variant="outlined"
                                onClick={() => router.push(`/event/${resolvedParams.id}/personal-info`)}
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
            </Card>
        </Container>
    );
} 