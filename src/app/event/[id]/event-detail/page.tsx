"use client";

import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Container from "@/Components/Container/Container";
import Row from "@/Components/Row/Row";
import Cell from "@/Components/Cell/Cell";
import Typography from "@/Components/Typography/Typography";
import Button from "@/Components/Button/Button";
import Card from "@/Components/Card/Card";
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import { useRegistrationStore } from '@/stores/registrationStore';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - Replace with actual API call
const mockEventData = {
  rules: [
    "Llegar puntual al evento",
    "Traer identificación oficial",
    "Seguir las instrucciones del personal",
  ],
  schedule: [
    { time: "07:00", activity: "Registro de participantes" },
    { time: "08:00", activity: "Calentamiento y briefing" },
    { time: "09:00", activity: "Inicio del evento" },
    { time: "17:00", activity: "Ceremonia de premiación" },
  ],
  requirements: [
    "Ropa deportiva adecuada",
    "Botella de agua",
    "Formulario médico completado",
  ],
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { setCurrentStep } = useRegistrationStore();
  const resolvedParams = React.use(params);

  // Set the current step to 1 (index 1) when this page loads
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleBack = () => {
    router.push(`/event/${resolvedParams.id}/`);
  };

  const handleRegister = () => {
    router.push(`/event/${resolvedParams.id}/personal-info`);
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


        <Row >
          <Typography type="subtitle">Descripcion del Evento</Typography>
        </Row>

        <Row>
          <Typography type="text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Row>

        <Row>
            <Typography type="subtitle">Ubicación del Evento</Typography>
        </Row>
        <Row>
            <Typography type="text">Ciudad de Guatemala</Typography>
        </Row>

        <Row justify="center" style={{ marginTop: "2rem" }}>
          <Cell xs={4}>
            <Button variant="outlined" onClick={handleBack} fullWidth>
              Volver
            </Button>
          </Cell>

          <Cell xs={4}>
            <Button variant="filled" onClick={handleRegister} fullWidth>
              Inscribirse
            </Button>
          </Cell>
        </Row>

      </Card>
    </Container>
  );
}
