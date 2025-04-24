"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Container from "@/Components/Container/Container";
import Row from "@/Components/Row/Row";
import Cell from "@/Components/Cell/Cell";
import Typography from "@/Components/Typography/Typography";
import Button from "@/Components/Button/Button";
import Card from "@/Components/Card/Card";
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - Replace with actual API call
const mockEventData = {
  pricing: {
    individualPrice: 100,
    individualFee: 10,
    teamPrice: 500,
    teamFee: 50,
    spectatorPrice: 30,
    spectatorFee: 5,
  },
  registrationTypes: ['Individual', 'Grupo', 'Espectador']
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { setCurrentStep, currentStepIndex } = useRegistrationStore();
  const resolvedParams = React.use(params);
  const [registrationType, setRegistrationType] = useState('');

  // Set the current step to 1 (index 1) when this page loads
  useEffect(() => {
    // If user tries to access this step without completing previous steps
    if (currentStepIndex < 1) {
      router.push(`/event/${resolvedParams.id}`);
      return;
    }
    setCurrentStep(1);
  }, [setCurrentStep, currentStepIndex, router, resolvedParams.id]);

  const handleBack = () => {
    router.push(`/event/${resolvedParams.id}/`);
  };

  const handleRegister = () => {
    if (registrationType === 'Por grupo' || registrationType === 'Individual y Grupos') {
      router.push(`/event/${resolvedParams.id}/group-info`);
    } else {
      router.push(`/event/${resolvedParams.id}/personal-info`);
    }
  };

  const handleRegistrationTypeChange = (event: any) => {
    setRegistrationType(event.target.value);
  };

  return (
    <Container>
      <Card className="registration-card">
        <Row justify="center">
          <Typography align='center' type="title">Detalles del Evento</Typography>
        </Row>

        <Row>
          <ProgressBar />
        </Row>

        <Row gap={1} style={{ flexDirection: "column" }}>
          <Typography type="subtitle">Descripcion del Evento</Typography>
          <Typography type="text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Row>

        <Row gap={1} style={{ flexDirection: "column" }}>
          <Typography type="subtitle">Ubicación del Evento</Typography>
          <Typography type="text">Ciudad de Guatemala</Typography>
        </Row>

        <Row gap={1} style={{ flexDirection: "column" }}> 
          <Typography type="subtitle">Precios</Typography>
            {mockEventData.pricing.individualPrice && (
              <Typography type="text">
                Precio individual: Q{mockEventData.pricing.individualPrice}
                {mockEventData.pricing.individualFee && ` + Fee: Q${mockEventData.pricing.individualFee}`}
              </Typography>
            )}
            {mockEventData.pricing.teamPrice && (
              <Typography type="text">
                Precio por equipo: Q{mockEventData.pricing.teamPrice}
                {mockEventData.pricing.teamFee && ` + Fee: Q${mockEventData.pricing.teamFee}`}
              </Typography>
            )}
            {mockEventData.pricing.spectatorPrice && (
              <Typography type="text">
                Precio espectador: Q{mockEventData.pricing.spectatorPrice}
                {mockEventData.pricing.spectatorFee && ` + Fee: Q${mockEventData.pricing.spectatorFee}`}
              </Typography>
            )}
        </Row>

        <Row>
          <FormControl fullWidth>
            <InputLabel id="registration-type-label">Tipo de Registro</InputLabel>
            <Select
              labelId="registration-type-label"
              value={registrationType}
              label="Tipo de Registro"
              onChange={handleRegistrationTypeChange}
            >
              {mockEventData.registrationTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Row>

        <Row justify="center" style={{ marginTop: "2rem" }}>
          <Cell xs={4}>
            <Button variant="outlined" onClick={handleBack} fullWidth>
              Volver
            </Button>
          </Cell>

          <Cell xs={4}>
            <Button 
              variant="filled" 
              onClick={handleRegister} 
              fullWidth
              disabled={!registrationType}
            >
              Inscribirse
            </Button>
          </Cell>
        </Row>
      </Card>
    </Container>
  );
}
