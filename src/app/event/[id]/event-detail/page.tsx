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
import eventStore from '@/store/eventStore';
import { useRegistrationTypeStore } from '@/stores/registrationTypeStore';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { setCurrentStep } = useRegistrationStore();
  const resolvedParams = React.use(params);
  const { registrationType, setRegistrationType } = useRegistrationTypeStore();
  const { event, isLoading, error, fetchEvent } = eventStore();

  // Set the current step to 1 (index 1) when this page loads
  useEffect(() => {
    setCurrentStep(1);
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

  const handleBack = () => {
    router.push(`/event/${resolvedParams.id}/`);
  };

  const handleRegister = () => {
    if (registrationType === 'groups') {
      router.push(`/event/${resolvedParams.id}/group-info`);
    } else {
      router.push(`/event/${resolvedParams.id}/personal-info`);
    }
  };

  const handleRegistrationTypeChange = (event: any) => {
    const newType = event.target.value;
    setRegistrationType(newType);
  };

  // Helper function to translate registration types
  const translateRegistrationType = (type: string) => {
    const translations: { [key: string]: string } = {
      'individual': 'Individual',
      'groups': 'Grupal',
      'individual and groups': 'Individual y Grupal'
    };
    return translations[type.toLowerCase()] || type;
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
            {event.description}
          </Typography>
        </Row>

        <Row gap={1} style={{ flexDirection: "column" }}>
          <Typography type="subtitle">Ubicación del Evento</Typography>
          <Typography type="text">{event.location}</Typography>
        </Row>

        <Row gap={1} style={{ flexDirection: "column" }}>
          <Typography type="subtitle">Precios</Typography>
          {event.individual_price && (
            <Typography type="text">
              Precio individual: Q{event.individual_price}
              {event.individual_fee && ` + Fee: Q${event.individual_fee}`}
            </Typography>
          )}
          {event.group_price && (
            <Typography type="text">
              Precio por equipo: Q{event.group_price}
              {event.group_fee && ` + Fee: Q${event.group_fee}`}
            </Typography>
          )}
          {event.spectator_price && (
            <Typography type="text">
              Precio espectador: Q{event.spectator_price}
              {event.spectator_fee && ` + Fee: Q${event.spectator_fee}`}
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
              {event.registration_type.split(' and ').map((type) => (
                <MenuItem key={type} value={type}>{translateRegistrationType(type)}</MenuItem>
              ))}
              <MenuItem value="spectator">Espectador</MenuItem>
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
