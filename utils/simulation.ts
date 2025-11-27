import { MotorData, SimulationState } from '../types';

let currentTemp = 45;
let currentVibration = 2.5;
let currentRpm = 1500;

export const generateMotorData = (state: SimulationState): MotorData => {
  const now = new Date();
  
  // Lógica de simulación física básica
  switch (state) {
    case SimulationState.NORMAL:
      // El motor busca estabilizarse en valores nominales
      currentTemp = currentTemp * 0.95 + (45 + Math.random() * 5) * 0.05;
      currentVibration = currentVibration * 0.9 + (2.0 + Math.random() * 1.5) * 0.1;
      currentRpm = currentRpm * 0.9 + (1500 + Math.random() * 50) * 0.1;
      break;
      
    case SimulationState.OVERHEAT:
      // La temperatura sube exponencialmente
      currentTemp = currentTemp + (Math.random() * 1.5);
      currentRpm = currentRpm * 0.95 + (1400 + Math.random() * 20) * 0.05; // Pierde eficiencia
      break;
      
    case SimulationState.UNBALANCED:
      // La vibración se dispara
      currentVibration = currentVibration + (Math.random() * 0.8);
      currentTemp = currentTemp + 0.1; // Fricción genera calor leve
      break;
  }

  // Determinar estado simple basado en umbrales (Regla de negocio básica)
  let status: MotorData['status'] = 'Normal';
  if (currentTemp > 80 || currentVibration > 10) status = 'Critical';
  else if (currentTemp > 65 || currentVibration > 6) status = 'Warning';

  return {
    timestamp: now.toLocaleTimeString(),
    temperature: parseFloat(currentTemp.toFixed(1)),
    vibration: parseFloat(currentVibration.toFixed(2)),
    rpm: Math.round(currentRpm),
    power: parseFloat((currentRpm * 0.15).toFixed(1)), // Simulación simple de potencia
    status
  };
};