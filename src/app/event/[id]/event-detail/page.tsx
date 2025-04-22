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
        <Row justify="center" >
          <Typography type="title">Detalles del Evento</Typography>
        </Row>

        <div style={{ margin: '2rem 0' }}>
          <ProgressBar />
        </div>

        {/* Rules Section */}
        <div style={{ margin: "2rem 0" }}>
          <Row className="mb-4">
            <Cell xs={12}>
              <Typography type="subtitle">Reglas del Evento</Typography>
            </Cell>
          </Row>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {mockEventData.rules.map((rule, index) => (
              <Row key={index} className="mb-3">
                <Cell xs={12} className="flex items-start">
                  <span className="text-blue-500 mr-3 font-bold">•</span>
                  <Typography>{rule}</Typography>
                </Cell>
              </Row>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div style={{ margin: "2rem 0" }}>
          <Row className="mb-4">
            <Cell xs={12}>
              <Typography type="subtitle">Horario del Evento</Typography>
            </Cell>
          </Row>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {mockEventData.schedule.map((item, index) => (
              <Row key={index} className="mb-4" align="center">
                <Cell xs={3} md={2}>
                  <Typography type="subtitle" className="text-blue-600">
                    {item.time}
                  </Typography>
                </Cell>
                <Cell
                  xs={9}
                  md={10}
                  className="border-l-2 border-blue-100 pl-4"
                >
                  <Typography>{item.activity}</Typography>
                </Cell>
              </Row>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div style={{ margin: "2rem 0" }}>
          <Row className="mb-4">
            <Cell xs={12}>
              <Typography type="subtitle">Requisitos del Evento</Typography>
            </Cell>
          </Row>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {mockEventData.requirements.map((requirement, index) => (
              <Row key={index} className="mb-3">
                <Cell xs={12} className="flex items-start">
                  <span className="text-blue-500 mr-3 font-bold">•</span>
                  <Typography>{requirement}</Typography>
                </Cell>
              </Row>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
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
