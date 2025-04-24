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
import { useGroupRegistrationStore } from '@/stores/groupRegistrationStore';
import { TextField, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface GroupInfoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GroupInfoPage({ params }: GroupInfoPageProps) {
  const router = useRouter();
  const { setCurrentStep, currentStepIndex } = useRegistrationStore();
  const {
    teamName,
    teamMembers,
    setTeamName,
    addTeamMember,
    removeTeamMember,
  } = useGroupRegistrationStore();
  const resolvedParams = React.use(params);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    if (currentStepIndex < 2) {
      router.push(`/event/${resolvedParams.id}/event-detail`);
      return;
    }
    setCurrentStep(2);
  }, [setCurrentStep, currentStepIndex, router, resolvedParams.id]);

  const handleBack = () => {
    router.push(`/event/${resolvedParams.id}/event-detail`);
  };

  const handleNext = () => {
    router.push(`/event/${resolvedParams.id}/payment`);
  };

  const handleAddMember = () => {
    if (
      newMember.name &&
      newMember.email &&
      newMember.phone &&
      newMember.emergencyContact &&
      newMember.emergencyPhone
    ) {
      addTeamMember(newMember);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        emergencyContact: '',
        emergencyPhone: '',
      });
    }
  };

  return (
    <Container>
      <Card className="registration-card">
        <Row justify="center">
          <Typography align="center" type="title">
            Información del Equipo
          </Typography>
        </Row>

        <Row>
          <ProgressBar />
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Nombre del Equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            margin="normal"
          />
        </Row>

        <Row>
          <Typography type="subtitle">Miembros del Equipo</Typography>
        </Row>

        {teamMembers.map((member, index) => (
          <Row key={index} style={{ marginTop: '1rem' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Typography type="text" style={{ flex: 1 }}>
                {member.name} - {member.email}
              </Typography>
              <IconButton onClick={() => removeTeamMember(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Row>
        ))}

        <Row>
          <Typography type="subtitle">Agregar Nuevo Miembro</Typography>
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Nombre"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            margin="normal"
          />
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            margin="normal"
          />
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Teléfono"
            value={newMember.phone}
            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            margin="normal"
          />
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Contacto de Emergencia"
            value={newMember.emergencyContact}
            onChange={(e) =>
              setNewMember({ ...newMember, emergencyContact: e.target.value })
            }
            margin="normal"
          />
        </Row>

        <Row>
          <TextField
            fullWidth
            label="Teléfono de Emergencia"
            value={newMember.emergencyPhone}
            onChange={(e) =>
              setNewMember({ ...newMember, emergencyPhone: e.target.value })
            }
            margin="normal"
          />
        </Row>

        <Row justify="center">
          <Button
            variant="outlined"
            onClick={handleAddMember}
            startIcon={<AddIcon />}
          >
            Agregar Miembro
          </Button>
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
              onClick={handleNext}
              fullWidth
              disabled={!teamName || teamMembers.length === 0}
            >
              Continuar
            </Button>
          </Cell>
        </Row>
      </Card>
    </Container>
  );
} 