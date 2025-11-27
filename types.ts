export interface MotorData {
  timestamp: string;
  temperature: number; // Grados Celsius
  vibration: number;   // mm/s
  rpm: number;         // Revoluciones por minuto
  power: number;       // Watts
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface AnalysisResult {
  status: 'Healthy' | 'At Risk' | 'Critical Failure';
  explanation: string;
  recommendation: string;
}

export enum SimulationState {
  NORMAL = 'NORMAL',
  OVERHEAT = 'OVERHEAT',
  UNBALANCED = 'UNBALANCED' // Alta vibración
}