'use client';

import { useState } from 'react';
import Container from '@/Components/Container/Container';
import Row from '@/Components/Row/Row';
import Cell from '@/Components/Cell/Cell';
import Typography from '@/Components/Typography/Typography';
import Button from '@/Components/Button/Button';

interface EventDetailAdminPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailAdminPage({ params }: EventDetailAdminPageProps) {
  // ... [Keep all the existing state and handlers from the previous file]
  const [rules, setRules] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Array<{time: string; activity: string}>>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  
  const [newRule, setNewRule] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleAddScheduleItem = () => {
    if (newTime.trim() && newActivity.trim()) {
      setSchedule([...schedule, { time: newTime.trim(), activity: newActivity.trim() }]);
      setNewTime('');
      setNewActivity('');
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement save functionality
      console.log('Saving event details:', { rules, schedule, requirements });
    } catch (error) {
      console.error('Error saving event details:', error);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} className="py-8">
        <Typography type="title" align="center">Administrar Detalles del Evento</Typography>
        
        {/* Rules Section */}
        <Cell className="mb-6">
          <Typography type="subtitle">Reglas del Evento</Typography>
          <Row justify="space-between" gap="1rem" className="mb-4">
            <Cell xs={9}>
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                placeholder="Agregar nueva regla"
                className="w-full p-2 border rounded"
              />
            </Cell>
            <Cell xs={3}>
              <Button onClick={handleAddRule} type="button" fullWidth>
                Agregar
              </Button>
            </Cell>
          </Row>
          {rules.map((rule, index) => (
            <Row key={index} justify="space-between" className="mb-2 bg-gray-100 p-2 rounded">
              <Cell xs={10}>
                <Typography>{rule}</Typography>
              </Cell>
              <Cell xs={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => setRules(rules.filter((_, i) => i !== index))}
                  type="button"
                >
                  Eliminar
                </Button>
              </Cell>
            </Row>
          ))}
        </Cell>

        {/* Schedule Section */}
        <Cell className="mb-6">
          <Typography type="subtitle">Horario del Evento</Typography>
          <Row justify="space-between" gap="1rem" className="mb-4">
            <Cell xs={3}>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </Cell>
            <Cell xs={6}>
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Actividad"
                className="w-full p-2 border rounded"
              />
            </Cell>
            <Cell xs={3}>
              <Button onClick={handleAddScheduleItem} type="button" fullWidth>
                Agregar
              </Button>
            </Cell>
          </Row>
          {schedule
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((item, index) => (
              <Row key={index} justify="space-between" className="mb-2 bg-gray-100 p-2 rounded">
                <Cell xs={2}>
                  <Typography>{item.time}</Typography>
                </Cell>
                <Cell xs={8}>
                  <Typography>{item.activity}</Typography>
                </Cell>
                <Cell xs={2}>
                  <Button 
                    variant="outlined"
                    onClick={() => setSchedule(schedule.filter((_, i) => i !== index))}
                    type="button"
                  >
                    Eliminar
                  </Button>
                </Cell>
              </Row>
          ))}
        </Cell>

        {/* Requirements Section */}
        <Cell className="mb-6">
          <Typography type="subtitle">Requisitos del Evento</Typography>
          <Row justify="space-between" gap="1rem" className="mb-4">
            <Cell xs={9}>
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                placeholder="Agregar nuevo requisito"
                className="w-full p-2 border rounded"
              />
            </Cell>
            <Cell xs={3}>
              <Button onClick={handleAddRequirement} type="button" fullWidth>
                Agregar
              </Button>
            </Cell>
          </Row>
          {requirements.map((requirement, index) => (
            <Row key={index} justify="space-between" className="mb-2 bg-gray-100 p-2 rounded">
              <Cell xs={10}>
                <Typography>{requirement}</Typography>
              </Cell>
              <Cell xs={2}>
                <Button 
                  variant="outlined"
                  onClick={() => setRequirements(requirements.filter((_, i) => i !== index))}
                  type="button"
                >
                  Eliminar
                </Button>
              </Cell>
            </Row>
          ))}
        </Cell>

        {/* Action Buttons */}
        <Row justify="space-between" className="mt-8">
          <Cell xs={6}>
            <Button variant="outlined" type="button" fullWidth>
              Volver
            </Button>
          </Cell>
          <Cell xs={6}>
            <Button type="submit" fullWidth>
              Guardar Cambios
            </Button>
          </Cell>
        </Row>
      </form>
    </Container>
  );
} 