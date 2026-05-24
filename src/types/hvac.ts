/**
 * HVAC Calculator Type Definitions
 */

export type CalculatorType = 
  | 'load'
  | 'cfm'
  | 'deltaT'
  | 'hydronic'
  | 'airflow'
  | 'duct'
  | 'complete';

export interface CalculatorInput {
  type: CalculatorType;
  // Common fields
  cfm?: number;
  deltaT?: number;
  load?: number;
  
  // Hydronic fields
  gpm?: number;
  
  // Airflow fields
  area?: number;
  velocity?: number;
  
  // Duct fields
  width?: number;
  height?: number;
  
  // Complete HVAC fields
  roomArea?: number;
  ceilingHeight?: number;
  occupants?: number;
  insulationLevel?: 'poor' | 'average' | 'good' | 'excellent';
  climate?: 'hot' | 'moderate' | 'cold';
  
  // Enthalpy (for total cooling)
  deltaH?: number;
  
  // Temperature units
  unit?: 'F' | 'C';
}

export interface CalculatorResult {
  success: boolean;
  type: CalculatorType;
  results: {
    load?: number;
    cfm?: number;
    deltaT?: number;
    gpm?: number;
    heatingLoad?: number;
    coolingLoad?: number;
    area?: number;
    velocity?: number;
    equivalentDiameter?: number;
    SHR?: number;
    totalCooling?: number;
  };
  formulas: string[];
  warnings?: string[];
  error?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
}

export type HVACMode = 'heating' | 'cooling';
