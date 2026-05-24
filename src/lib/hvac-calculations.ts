/**
 * HVAC Calculation Library
 * Standard industry formulas for heating, cooling, and airflow calculations
 * 
 * Reference: Belimo HVAC Formulas Field Guide
 * - CFM = Q / (1.08 × ΔT) for heating
 * - CFM = Q_sensible / (1.08 × ΔT) for cooling sensible heat
 * - Q = 1.08 × CFM × ΔT (heating/cooling load)
 * - Q_total = 4.5 × CFM × Δh (total cooling with enthalpy)
 * - GPM = Q / (500 × ΔT) for hydronic systems
 */

export interface HeatingCoolingResult {
  load: number; // BTU/hr
  cfm: number; // Cubic Feet per Minute
  deltaT: number; // Temperature difference (°F)
  type: 'heating' | 'cooling';
}

export interface HydronicResult {
  gpm: number; // Gallons Per Minute
  load: number; // BTU/hr
  deltaT: number; // Temperature difference (°F)
}

export interface AirflowResult {
  cfm: number;
  area: number; // square feet
  velocity: number; // feet per minute (FPM)
}

/**
 * Calculate heating or cooling load from CFM and temperature difference
 * Formula: Q = 1.08 × CFM × ΔT
 * 
 * @param cfm - Airflow in Cubic Feet per Minute
 * @param deltaT - Temperature difference (°F)
 * @param type - 'heating' or 'cooling'
 * @returns Load in BTU/hr
 */
export function calculateLoadFromCFM(cfm: number, deltaT: number, type: 'heating' | 'cooling' = 'heating'): number {
  if (cfm < 0 || deltaT < 0) {
    throw new Error('CFM and Delta T must be non-negative values');
  }
  
  // Q = 1.08 × CFM × ΔT
  // 1.08 = 0.075 lb/cu-ft × 0.24 BTU/lb-°F × 60 min/hr (air density × specific heat × time conversion)
  const load = 1.08 * cfm * deltaT;
  
  return type === 'cooling' ? -load : load;
}

/**
 * Calculate required CFM from heating/cooling load and temperature difference
 * Formula: CFM = Q / (1.08 × ΔT)
 * 
 * @param load - Heating or cooling load in BTU/hr
 * @param deltaT - Temperature difference (°F)
 * @returns Required airflow in CFM
 */
export function calculateCFMFromLoad(load: number, deltaT: number): number {
  if (deltaT <= 0) {
    throw new Error('Delta T must be positive');
  }
  
  // CFM = Q / (1.08 × ΔT)
  const cfm = Math.abs(load) / (1.08 * deltaT);
  
  return cfm;
}

/**
 * Calculate temperature difference from load and CFM
 * Formula: ΔT = Q / (1.08 × CFM)
 * 
 * @param load - Heating or cooling load in BTU/hr
 * @param cfm - Airflow in Cubic Feet per Minute
 * @returns Temperature difference (°F)
 */
export function calculateDeltaT(load: number, cfm: number): number {
  if (cfm <= 0) {
    throw new Error('CFM must be positive');
  }
  
  // ΔT = Q / (1.08 × CFM)
  const deltaT = Math.abs(load) / (1.08 * cfm);
  
  return deltaT;
}

/**
 * Calculate total cooling load including latent heat (enthalpy method)
 * Formula: Q_total = 4.5 × CFM × Δh
 * 
 * @param cfm - Airflow in Cubic Feet per Minute
 * @param deltaH - Enthalpy difference (BTU/lb)
 * @returns Total cooling load in BTU/hr (positive value)
 */
export function calculateTotalCooling(cfm: number, deltaH: number): number {
  if (cfm < 0 || deltaH < 0) {
    throw new Error('CFM and enthalpy difference must be non-negative');
  }
  
  // Q_total = 4.5 × CFM × Δh
  // 4.5 = 0.075 lb/cu-ft × 60 min/hr (air density × time conversion)
  const totalCooling = 4.5 * cfm * deltaH;
  
  return totalCooling;
}

/**
 * Calculate hydronic system flow rate (water systems)
 * Formula: GPM = Q / (500 × ΔT)
 * 
 * @param load - Heating or cooling load in BTU/hr
 * @param deltaT - Temperature difference (°F)
 * @returns Flow rate in Gallons Per Minute
 */
export function calculateGPM(load: number, deltaT: number): number {
  if (deltaT <= 0) {
    throw new Error('Delta T must be positive');
  }
  
  // GPM = Q / (500 × ΔT)
  // 500 = 8.33 lb/gal × 60 min/hr × 1.0 BTU/lb-°F (water density × time × specific heat)
  const gpm = Math.abs(load) / (500 * deltaT);
  
  return gpm;
}

/**
 * Calculate load from hydronic flow rate
 * Formula: Q = 500 × GPM × ΔT
 * 
 * @param gpm - Flow rate in Gallons Per Minute
 * @param deltaT - Temperature difference (°F)
 * @param type - 'heating' or 'cooling'
 * @returns Load in BTU/hr
 */
export function calculateLoadFromGPM(gpm: number, deltaT: number, type: 'heating' | 'cooling' = 'heating'): number {
  if (gpm < 0 || deltaT < 0) {
    throw new Error('GPM and Delta T must be non-negative values');
  }
  
  // Q = 500 × GPM × ΔT
  const load = 500 * gpm * deltaT;
  
  return type === 'cooling' ? -load : load;
}

/**
 * Calculate airflow from duct area and velocity
 * Formula: CFM = Area × Velocity
 * 
 * @param area - Duct cross-sectional area in square feet
 * @param velocity - Air velocity in Feet Per Minute (FPM)
 * @returns Airflow in CFM
 */
export function calculateCFMFromArea(area: number, velocity: number): number {
  if (area < 0 || velocity < 0) {
    throw new Error('Area and velocity must be non-negative');
  }
  
  return area * velocity;
}

/**
 * Calculate duct area from CFM and velocity
 * Formula: Area = CFM / Velocity
 * 
 * @param cfm - Airflow in Cubic Feet per Minute
 * @param velocity - Air velocity in Feet Per Minute (FPM)
 * @returns Required duct area in square feet
 */
export function calculateAreaFromCFM(cfm: number, velocity: number): number {
  if (velocity <= 0) {
    throw new Error('Velocity must be positive');
  }
  
  return cfm / velocity;
}

/**
 * Calculate air velocity from CFM and duct area
 * Formula: Velocity = CFM / Area
 * 
 * @param cfm - Airflow in Cubic Feet per Minute
 * @param area - Duct area in square feet
 * @returns Air velocity in Feet Per Minute (FPM)
 */
export function calculateVelocity(cfm: number, area: number): number {
  if (area <= 0) {
    throw new Error('Area must be positive');
  }
  
  return cfm / area;
}

/**
 * Calculate rectangular duct equivalent diameter
 * Formula: D_e = 1.30 × ((a × b)^0.625) / ((a + b)^0.25)
 * 
 * @param a - Width in inches
 * @param b - Height in inches
 * @returns Equivalent circular diameter in inches
 */
export function calculateEquivalentDiameter(a: number, b: number): number {
  if (a <= 0 || b <= 0) {
    throw new Error('Dimensions must be positive');
  }
  
  // Huebscher equation for equivalent diameter
  const numerator = Math.pow(a * b, 0.625);
  const denominator = Math.pow(a + b, 0.25);
  const equivalentDiameter = 1.30 * numerator / denominator;
  
  return equivalentDiameter;
}

/**
 * Calculate sensible heat ratio (SHR)
 * Formula: SHR = Q_sensible / Q_total
 * 
 * @param sensibleLoad - Sensible heat load in BTU/hr
 * @param totalLoad - Total heat load in BTU/hr (sensible + latent)
 * @returns Sensible Heat Ratio (0 to 1)
 */
export function calculateSHR(sensibleLoad: number, totalLoad: number): number {
  if (totalLoad <= 0) {
    throw new Error('Total load must be positive');
  }
  
  if (Math.abs(sensibleLoad) > Math.abs(totalLoad)) {
    throw new Error('Sensible load cannot exceed total load');
  }
  
  return Math.abs(sensibleLoad) / Math.abs(totalLoad);
}

/**
 * Convert between temperature units
 * 
 * @param value - Temperature value
 * @param from - Source unit ('C' or 'F')
 * @param to - Target unit ('C' or 'F')
 * @returns Converted temperature
 */
export function convertTemperature(value: number, from: 'C' | 'F', to: 'C' | 'F'): number {
  if (from === to) return value;
  
  if (from === 'C' && to === 'F') {
    return (value * 9/5) + 32;
  } else {
    return (value - 32) * 5/9;
  }
}

/**
 * Complete HVAC calculation result
 */
export interface HVACResult {
  heatingLoad?: number;
  coolingLoad?: number;
  cfm?: number;
  gpm?: number;
  deltaT?: number;
  SHR?: number;
  warnings?: string[];
}

/**
 * Perform a complete HVAC calculation based on room parameters
 * 
 * @param area - Room area in square feet
 * @param ceilingHeight - Ceiling height in feet
 * @param occupants - Number of occupants
 * @param insulationLevel - 'poor' | 'average' | 'good' | 'excellent'
 * @param climate - 'hot' | 'moderate' | 'cold'
 * @returns Comprehensive HVAC calculation result
 */
export function calculateHVACLoad(
  area: number,
  ceilingHeight: number = 8,
  occupants: number = 0,
  insulationLevel: 'poor' | 'average' | 'good' | 'excellent' = 'average',
  climate: 'hot' | 'moderate' | 'cold' = 'moderate'
): HVACResult {
  if (area <= 0 || ceilingHeight <= 0 || occupants < 0) {
    throw new Error('Invalid input parameters');
  }

  const volume = area * ceilingHeight;
  const warnings: string[] = [];
  
  // Base load calculation (simplified method)
  // Typical values: 25-35 BTU/sq ft for cooling, 20-30 BTU/sq ft for heating
  let baseCoolingFactor = 30; // BTU/sq ft
  let baseHeatingFactor = 25; // BTU/sq ft
  
  // Adjust for insulation
  const insulationFactors = {
    poor: 1.3,
    average: 1.0,
    good: 0.85,
    excellent: 0.7
  };
  
  // Adjust for climate
  const climateFactors = {
    hot: 1.2,
    moderate: 1.0,
    cold: 1.15
  };
  
  baseCoolingFactor *= climateFactors[climate];
  baseHeatingFactor *= climateFactors[climate];
  
  const insulationFactor = insulationFactors[insulationLevel];
  
  let coolingLoad = area * baseCoolingFactor * insulationFactor;
  let heatingLoad = area * baseHeatingFactor * insulationFactor;
  
  // Add occupant load (approximately 400 BTU/hr per person for cooling)
  if (occupants > 0) {
    const occupantLoad = occupants * 400;
    coolingLoad += occupantLoad;
    warnings.push(`Added ${occupantLoad} BTU/hr for ${occupants} occupant(s)`);
  }
  
  // Calculate approximate CFM requirements (assuming ΔT = 20°F for cooling)
  const deltaT = 20;
  const cfm = calculateCFMFromLoad(coolingLoad, deltaT);
  
  // Calculate approximate GPM for hydronic system (assuming ΔT = 20°F)
  const gpm = calculateGPM(heatingLoad, deltaT);
  
  // Calculate SHR (typical residential is 0.75-0.85)
  // Using simplified assumption: latent load is ~15-25% of total
  const latentLoad = coolingLoad * 0.20;
  const totalLoad = coolingLoad + latentLoad;
  const SHR = calculateSHR(coolingLoad, totalLoad);
  
  return {
    heatingLoad: Math.round(heatingLoad),
    coolingLoad: Math.round(coolingLoad),
    cfm: Math.round(cfm),
    gpm: Math.round(gpm * 10) / 10,
    deltaT,
    SHR: Math.round(SHR * 100) / 100,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
