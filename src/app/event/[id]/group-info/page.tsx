"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/Card/Card';
import Container from '@/Components/Container/Container';
import Typography from '@/Components/Typography/Typography';
import Row from '@/Components/Row/Row';
import Button from '@/Components/Button/Button';
import ProgressBar from '@/Components/ProgressBar/ProgressBar';
import Cell from '@/Components/Cell/Cell';
import { useRegistrationStore } from '@/stores/registrationStore';
import { useGroupRegistrationStore } from '@/stores/groupRegistrationStore';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
  Box
} from '@mui/material';

interface GroupInfoPageProps {
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

export default function GroupInfoPage({ params }: GroupInfoPageProps) {
  const router = useRouter();
  const { setCurrentStep } = useRegistrationStore();
  const {
    teamName,
    teamMembers,
    formErrors,
    setTeamName,
    setContactEmail,
    contactEmail,
    updateTeamMember,
    validateField,
    validateForm
  } = useGroupRegistrationStore();
  const resolvedParams = React.use(params);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleInputChange = (memberIndex: number, e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const field = e.target.name as keyof typeof teamMembers[0];
    const value = e.target.value as string;

    updateTeamMember(memberIndex, { [field]: value });
    validateField(memberIndex, field, value);
  };

  const handleBack = () => {
    router.push(`/event/${resolvedParams.id}/event-detail`);
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push(`/event/${resolvedParams.id}/payment`);
    }
  };

  const renderTeamMemberForm = (memberIndex: number) => {
    const member = teamMembers[memberIndex];
    const errors = formErrors.teamMembers?.[memberIndex] || {};

    return (
      <Row gap={1}>
        <Typography type="subtitle" style={{ marginTop: '1rem' }}>
          Miembro {memberIndex + 1}
        </Typography>
        <TextField
          fullWidth
          label="Nombre"
          name="firstName"
          value={member.firstName}
          onChange={(e) => handleInputChange(memberIndex, e)}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />

        <TextField
          fullWidth
          label="Apellido"
          name="lastName"
          value={member.lastName}
          onChange={(e) => handleInputChange(memberIndex, e)}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />

        <FormControl fullWidth error={!!errors.gender}>
          <InputLabel id={`gender-label-${memberIndex}`}>Sexo</InputLabel>
          <Select
            labelId={`gender-label-${memberIndex}`}
            name="gender"
            value={member.gender}
            onChange={(e) => handleInputChange(memberIndex, e)}
            label="Sexo"
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Femenino</MenuItem>
          </Select>
          {errors.gender && (
            <FormHelperText>{errors.gender}</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          type="email"
          value={member.email}
          onChange={(e) => handleInputChange(memberIndex, e)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Teléfono Personal con Selección de País */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <Cell xs={6} md={3}>
            <FormControl fullWidth error={!!errors.phoneCountry}>
              <InputLabel id={`phone-country-label-${memberIndex}`}>País</InputLabel>
              <Select
                labelId={`phone-country-label-${memberIndex}`}
                name="phoneCountry"
                value={member.phoneCountry}
                onChange={(e) => handleInputChange(memberIndex, e)}
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
              value={member.phone}
              onChange={(e) => handleInputChange(memberIndex, e)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={!member.phoneCountry}
              placeholder={member.phoneCountry ?
                `${countries.find(c => c.code === member.phoneCountry)?.phoneCode || ''} Ingrese su número` :
                'Seleccione un país primero'
              }
            />
          </Cell>
        </div>

        <TextField
          fullWidth
          label="Nombre de Contacto de Emergencia"
          name="emergencyContact"
          value={member.emergencyContact}
          onChange={(e) => handleInputChange(memberIndex, e)}
          error={!!errors.emergencyContact}
          helperText={errors.emergencyContact}
        />

        {/* Teléfono de Emergencia con Selección de País */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <Cell xs={6} md={3}>
            <FormControl fullWidth error={!!errors.emergencyPhoneCountry}>
              <InputLabel id={`emergency-phone-country-label-${memberIndex}`}>País</InputLabel>
              <Select
                labelId={`emergency-phone-country-label-${memberIndex}`}
                name="emergencyPhoneCountry"
                value={member.emergencyPhoneCountry}
                onChange={(e) => handleInputChange(memberIndex, e)}
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
              value={member.emergencyPhone}
              onChange={(e) => handleInputChange(memberIndex, e)}
              error={!!errors.emergencyPhone}
              helperText={errors.emergencyPhone}
              disabled={!member.emergencyPhoneCountry}
              placeholder={member.emergencyPhoneCountry ?
                `${countries.find(c => c.code === member.emergencyPhoneCountry)?.phoneCode || ''} Ingrese su número` :
                'Seleccione un país primero'
              }
            />
          </Cell>
        </div>

        <FormControl fullWidth error={!!errors.size}>
          <InputLabel id={`size-label-${memberIndex}`}>Talla</InputLabel>
          <Select
            labelId={`size-label-${memberIndex}`}
            name="size"
            value={member.size}
            onChange={(e) => handleInputChange(memberIndex, e)}
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
      </Row>
    );
  };

  return (
    <Container>
      <Card className="registration-card">
        <Row justify="center">
          <Typography type="title">
            Información del Equipo
          </Typography>
        </Row>

        <Row>
          <ProgressBar />
        </Row>

        <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
          <Row gap={1}>
            <TextField
              fullWidth
              label="Nombre del Equipo"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              error={!!formErrors.teamName}
              helperText={formErrors.teamName}
            />

            <TextField
              fullWidth
              label="Correo Electrónico de Contacto"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              error={!!formErrors.contactEmail}
              helperText={formErrors.contactEmail}
            />
          </Row>

          {teamMembers.map((_, index) => renderTeamMemberForm(index))}

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