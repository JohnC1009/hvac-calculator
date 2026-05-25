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

// ============================================================================
// Conduit Fill Calculations (NEC)
// ============================================================================

export interface ConduitFillResult {
  fillPercentage: number;
  maxAllowableFill: number;
  remainingCapacity: number;
  compliant: boolean;
  maxConductors?: number;
}

export interface WireSpec {
  gauge: string; // e.g., "14 AWG", "12 AWG", "10 AWG", "8 AWG", "6 AWG", etc.
  insulationType: 'THHN' | 'THWN' | 'XHHW';
  area: number; // in square inches
}

export interface ConduitSpec {
  tradeSize: string; // e.g., "1/2", "3/4", "1", "1-1/4", etc.
  conduitType: 'EMT' | 'RMC' | 'PVC' | 'FMC';
  internalArea: number; // in square inches
}

/**
 * NEC conduit fill limits based on number of conductors
 * NEC Table 1, Chapter 9
 */
export const NEC_FILL_LIMITS = {
  1: 0.53,  // 53% for 1 conductor
  2: 0.31,  // 31% for 2 conductors
  3: 0.40,  // 40% for 3+ conductors
  min: 0.31,
  max: 0.53
};

/**
 * Common wire areas in square inches (NEC Chapter 9, Table 5)
 * THHN/THWN-2 values
 */
export const WIRE_AREAS: Record<string, number> = {
  "14 AWG": 0.0097,
  "12 AWG": 0.0133,
  "10 AWG": 0.0211,
  "8 AWG": 0.0366,
  "6 AWG": 0.0580,
  "4 AWG": 0.0973,
  "3 AWG": 0.1187,
  "2 AWG": 0.1523,
  "1 AWG": 0.1963,
  "1/0 AWG": 0.2479,
  "2/0 AWG": 0.3117,
  "3/0 AWG": 0.3898,
  "4/0 AWG": 0.4856,
  "250 kcmil": 0.5543,
  "300 kcmil": 0.6527,
  "350 kcmil": 0.7561,
  "400 kcmil": 0.8636,
  "500 kcmil": 1.0370,
};

/**
 * Standard conduit internal areas in square inches
 * EMT (Electrical Metallic Tubing) values
 */
export const CONDUIT_AREAS: Record<string, number> = {
  "1/2": 0.122,
  "3/4": 0.213,
  "1": 0.346,
  "1-1/4": 0.598,
  "1-1/2": 0.822,
  "2": 1.342,
  "2-1/2": 1.921,
  "3": 2.907,
  "3-1/2": 3.563,
  "4": 4.633,
};

/**
 * Calculate conduit fill percentage
 * Formula: Fill % = (Σ(A_wire × N_wire)) / A_conduit × 100
 * 
 * @param wires - Array of {gauge, count} objects
 * @param conduitSize - Trade size of conduit (e.g., "3/4")
 * @returns ConduitFillResult with fill percentage and compliance status
 */
export function calculateConduitFill(
  wires: Array<{ gauge: string; count: number }>,
  conduitSize: string
): ConduitFillResult {
  const conduitArea = CONDUIT_AREAS[conduitSize];
  if (!conduitArea) {
    throw new Error(`Unknown conduit size: ${conduitSize}`);
  }
  
  let totalWireArea = 0;
  let totalConductors = 0;
  
  for (const wire of wires) {
    const wireArea = WIRE_AREAS[wire.gauge];
    if (!wireArea) {
      throw new Error(`Unknown wire gauge: ${wire.gauge}`);
    }
    totalWireArea += wireArea * wire.count;
    totalConductors += wire.count;
  }
  
  const fillPercentage = (totalWireArea / conduitArea) * 100;
  const maxAllowableFill = getNECFillLimit(totalConductors) * 100;
  const remainingCapacity = conduitArea - totalWireArea;
  const compliant = fillPercentage <= maxAllowableFill;
  
  return {
    fillPercentage: Math.round(fillPercentage * 100) / 100,
    maxAllowableFill: Math.round(maxAllowableFill * 100) / 100,
    remainingCapacity: Math.round(remainingCapacity * 10000) / 10000,
    compliant,
  };
}

/**
 * Get NEC fill limit based on number of conductors
 */
function getNECFillLimit(conductorCount: number): number {
  if (conductorCount <= 0) return 0;
  if (conductorCount === 1) return NEC_FILL_LIMITS[1];
  if (conductorCount === 2) return NEC_FILL_LIMITS[2];
  return NEC_FILL_LIMITS[3]; // 3 or more
}

/**
 * Calculate maximum number of conductors that fit in conduit
 * 
 * @param wireGauge - Wire gauge (e.g., "14 AWG")
 * @param conduitSize - Conduit trade size
 * @param conductorCount - Number of conductors (for fill limit)
 * @returns Maximum number of conductors allowed
 */
export function calculateMaxConductors(
  wireGauge: string,
  conduitSize: string,
  conductorCount: number = 3
): number {
  const wireArea = WIRE_AREAS[wireGauge];
  const conduitArea = CONDUIT_AREAS[conduitSize];
  
  if (!wireArea || !conduitArea) {
    throw new Error('Invalid wire gauge or conduit size');
  }
  
  const fillLimit = getNECFillLimit(conductorCount);
  const maxArea = conduitArea * fillLimit;
  const maxConductors = Math.floor(maxArea / wireArea);
  
  return maxConductors;
}

// ============================================================================
// Pipe Sizing Calculations (Water/Glycol Systems)
// ============================================================================

export interface PipeSizingResult {
  velocity: number; // ft/s
  velocityStatus: 'low' | 'optimal' | 'high' | 'excessive';
  pressureDrop: number; // psi per 100 ft
  reynoldsNumber: number;
  flowRegime: 'laminar' | 'transitional' | 'turbulent';
  recommendedSize?: string;
}

export interface FluidProperties {
  density: number; // lb/ft³
  viscosity: number; // centipoise (cP)
  glycolPercent: number; // 0-100
}

export const WATER_PROPERTIES = {
  density: 62.4, // lb/ft³ at 60°F
  viscosity: 1.0, // cP at 68°F
  glycolPercent: 0,
};

/**
 * Standard pipe sizes with internal diameters in inches
 */
export const PIPE_SIZES: Record<string, number> = {
  "1/2": 0.622,
  "3/4": 0.824,
  "1": 1.049,
  "1-1/4": 1.380,
  "1-1/2": 1.610,
  "2": 2.067,
  "2-1/2": 2.469,
  "3": 3.068,
  "4": 4.026,
  "5": 5.047,
  "6": 6.065,
};

/**
 * Calculate pipe velocity from flow rate and diameter
 * Formula: v = Q / A = (Q × 0.4085) / D²
 * where Q is in GPM, D is in inches, v is in ft/s
 * 
 * @param flowRate - Flow rate in GPM
 * @param pipeSize - Pipe nominal size (e.g., "2")
 * @returns Velocity in ft/s
 */
export function calculatePipeVelocity(flowRate: number, pipeSize: string): number {
  const internalDiameter = PIPE_SIZES[pipeSize];
  if (!internalDiameter) {
    throw new Error(`Unknown pipe size: ${pipeSize}`);
  }
  
  // v = (GPM × 0.4085) / D²
  const velocity = (flowRate * 0.4085) / (internalDiameter * internalDiameter);
  
  return velocity;
}

/**
 * Get velocity status based on ASHRAE recommendations
 */
export function getVelocityStatus(velocity: number): 'low' | 'optimal' | 'high' | 'excessive' {
  if (velocity < 2) return 'low';
  if (velocity <= 4) return 'optimal'; // Chilled water: 2-4 ft/s
  if (velocity <= 7) return 'high'; // Condenser water: 4-7 ft/s
  return 'excessive'; // > 7 ft/s, approaching erosion limits
}

/**
 * Calculate Reynolds number
 * Formula: Re = (3160 × GPM) / (D × μ)
 * where D is in inches, μ is in cP
 * 
 * @param flowRate - Flow rate in GPM
 * @param pipeSize - Pipe nominal size
 * @param viscosity - Dynamic viscosity in cP
 * @returns Reynolds number (dimensionless)
 */
export function calculateReynoldsNumber(
  flowRate: number,
  pipeSize: string,
  viscosity: number = 1.0
): number {
  const internalDiameter = PIPE_SIZES[pipeSize];
  if (!internalDiameter || viscosity <= 0) {
    throw new Error('Invalid pipe size or viscosity');
  }
  
  // Re = (3160 × GPM) / (D × μ)
  const Re = (3160 * flowRate) / (internalDiameter * viscosity);
  
  return Math.round(Re);
}

/**
 * Get flow regime based on Reynolds number
 */
export function getFlowRegime(reynoldsNumber: number): 'laminar' | 'transitional' | 'turbulent' {
  if (reynoldsNumber < 2300) return 'laminar';
  if (reynoldsNumber < 4000) return 'transitional';
  return 'turbulent';
}

/**
 * Calculate friction factor using Swamee-Jain approximation
 * Formula: f = 0.25 / [log₁₀((ε/D)/3.7 + 5.74/Re^0.9)]²
 * 
 * @param reynoldsNumber - Reynolds number
 * @param pipeSize - Pipe nominal size
 * @param roughness - Pipe roughness in feet (default: 0.00015 for steel)
 * @returns Darcy friction factor (dimensionless)
 */
export function calculateFrictionFactor(
  reynoldsNumber: number,
  pipeSize: string,
  roughness: number = 0.00015
): number {
  const internalDiameter = PIPE_SIZES[pipeSize];
  if (!internalDiameter) {
    throw new Error(`Unknown pipe size: ${pipeSize}`);
  }
  
  const diameterFeet = internalDiameter / 12;
  const relativeRoughness = roughness / diameterFeet;
  
  if (reynoldsNumber < 2300) {
    // Laminar flow: f = 64 / Re
    return 64 / reynoldsNumber;
  }
  
  // Swamee-Jain approximation for turbulent flow
  const term = (relativeRoughness / 3.7) + (5.74 / Math.pow(reynoldsNumber, 0.9));
  const f = 0.25 / Math.pow(Math.log10(term), 2);
  
  return f;
}

/**
 * Calculate pressure drop using Darcy-Weisbach equation
 * Formula: ΔP = 0.0311 × f × (L/D) × (Q²/D⁴)  [psi per 100 ft]
 * Simplified: ΔP/100ft = (0.000216 × f × Q²) / D⁵
 * 
 * @param flowRate - Flow rate in GPM
 * @param pipeSize - Pipe nominal size
 * @param fluid - Fluid properties
 * @returns Pressure drop in psi per 100 ft
 */
export function calculatePressureDrop(
  flowRate: number,
  pipeSize: string,
  fluid: FluidProperties = WATER_PROPERTIES
): number {
  const internalDiameter = PIPE_SIZES[pipeSize];
  if (!internalDiameter) {
    throw new Error(`Unknown pipe size: ${pipeSize}`);
  }
  
  const Re = calculateReynoldsNumber(flowRate, pipeSize, fluid.viscosity);
  const f = calculateFrictionFactor(Re, pipeSize);
  
  // Simplified Darcy-Weisbach for GPM and inches: ΔP/100ft = (0.000216 × f × Q²) / D⁵
  const pressureDrop = (0.000216 * f * flowRate * flowRate) / Math.pow(internalDiameter, 5);
  
  return Math.round(pressureDrop * 1000) / 1000;
}

/**
 * Complete pipe sizing calculation
 * 
 * @param flowRate - Flow rate in GPM
 * @param pipeSize - Pipe nominal size
 * @param fluid - Fluid properties (optional, defaults to water)
 * @returns PipeSizingResult with velocity, pressure drop, and recommendations
 */
export function calculatePipeSizing(
  flowRate: number,
  pipeSize: string,
  fluid: FluidProperties = WATER_PROPERTIES
): PipeSizingResult {
  const velocity = calculatePipeVelocity(flowRate, pipeSize);
  const velocityStatus = getVelocityStatus(velocity);
  const Re = calculateReynoldsNumber(flowRate, pipeSize, fluid.viscosity);
  const flowRegime = getFlowRegime(Re);
  const pressureDrop = calculatePressureDrop(flowRate, pipeSize, fluid);
  
  let recommendedSize: string | undefined;
  if (velocityStatus === 'excessive' || velocityStatus === 'high') {
    // Find next larger size
    const sizes = Object.keys(PIPE_SIZES);
    const currentIndex = sizes.indexOf(pipeSize);
    if (currentIndex < sizes.length - 1) {
      recommendedSize = sizes[currentIndex + 1];
    }
  } else if (velocityStatus === 'low' && flowRate > 0) {
    // Find smaller size if velocity is too low
    const sizes = Object.keys(PIPE_SIZES);
    const currentIndex = sizes.indexOf(pipeSize);
    if (currentIndex > 0) {
      const smallerVelocity = calculatePipeVelocity(flowRate, sizes[currentIndex - 1]);
      if (getVelocityStatus(smallerVelocity) === 'optimal') {
        recommendedSize = sizes[currentIndex - 1];
      }
    }
  }
  
  return {
    velocity: Math.round(velocity * 100) / 100,
    velocityStatus,
    pressureDrop,
    reynoldsNumber: Re,
    flowRegime,
    recommendedSize,
  };
}

/**
 * Adjust fluid properties for glycol concentration
 * Approximate values for propylene glycol solutions
 * 
 * @param glycolPercent - Glycol concentration (0-100)
 * @param temperature - Temperature in °F
 * @returns Adjusted fluid properties
 */
export function getGlycolProperties(glycolPercent: number, temperature: number = 60): FluidProperties {
  if (glycolPercent <= 0) {
    return WATER_PROPERTIES;
  }
  
  // Approximate corrections (actual values depend on glycol type and temperature)
  const glycolFraction = glycolPercent / 100;
  
  // Density increases ~0.3% per 10% glycol
  const density = WATER_PROPERTIES.density * (1 + 0.003 * glycolFraction * 10);
  
  // Viscosity increases significantly with glycol (approximate)
  // At 60°F: 30% glycol ≈ 2.5 cP, 50% glycol ≈ 5 cP
  const viscosity = WATER_PROPERTIES.viscosity * (1 + 0.05 * glycolPercent);
  
  return {
    density: Math.round(density * 10) / 10,
    viscosity: Math.round(viscosity * 100) / 100,
    glycolPercent,
  };
}

// ============================================================================
// Duct Pressure Drop Calculations
// ============================================================================

export interface DuctPressureResult {
  velocity: number; // FPM
  velocityPressure: number; // inches wg
  frictionRate: number; // inches wg/100ft
  pressureDrop: number; // inches wg (total for length)
  equivalentDiameter?: number; // inches (for rectangular)
  flowRegime: 'laminar' | 'turbulent';
}

export interface DuctSpec {
  shape: 'circular' | 'rectangular';
  diameter?: number; // inches (circular)
  width?: number; // inches (rectangular)
  height?: number; // inches (rectangular)
}

/**
 * Standard air density at 70°F, sea level
 */
export const STANDARD_AIR_DENSITY = 0.075; // lb/ft³

/**
 * Calculate air velocity from CFM and duct area
 * Formula: v = Q / A
 * 
 * @param cfm - Airflow in CFM
 * @param duct - Duct specification
 * @returns Velocity in FPM (feet per minute)
 */
export function calculateDuctVelocity(cfm: number, duct: DuctSpec): number {
  let area: number; // square feet
  
  if (duct.shape === 'circular' && duct.diameter) {
    const diameterFeet = duct.diameter / 12;
    area = Math.PI * Math.pow(diameterFeet / 2, 2);
  } else if (duct.shape === 'rectangular' && duct.width && duct.height) {
    area = (duct.width / 12) * (duct.height / 12);
  } else {
    throw new Error('Invalid duct specification');
  }
  
  const velocity = cfm / area;
  return Math.round(velocity);
}

/**
 * Calculate velocity pressure
 * Formula: P_v = (v / 4005)²  [inches wg, v in FPM]
 * 
 * @param velocity - Air velocity in FPM
 * @returns Velocity pressure in inches wg
 */
export function calculateVelocityPressure(velocity: number): number {
  const Pv = Math.pow(velocity / 4005, 2);
  return Math.round(Pv * 1000) / 1000;
}

/**
 * Calculate equivalent diameter for rectangular duct (Huebscher equation)
 * Formula: D_e = 1.30 × ((a × b)^0.625) / ((a + b)^0.25)
 * 
 * @param width - Width in inches
 * @param height - Height in inches
 * @returns Equivalent diameter in inches
 */
export function calculateRectangularEquivalentDiameter(width: number, height: number): number {
  if (width <= 0 || height <= 0) {
    throw new Error('Dimensions must be positive');
  }
  
  const numerator = Math.pow(width * height, 0.625);
  const denominator = Math.pow(width + height, 0.25);
  const De = 1.30 * numerator / denominator;
  
  return Math.round(De * 100) / 100;
}

/**
 * Calculate friction rate (pressure drop per 100 ft)
 * Simplified formula for standard air in round ducts:
 * ΔP/100ft = 0.0307 × (Q^1.9) / (D^5.02)
 * where Q is in CFM, D is in inches
 * 
 * @param cfm - Airflow in CFM
 * @param diameter - Duct diameter in inches
 * @returns Friction rate in inches wg/100ft
 */
export function calculateFrictionRate(cfm: number, diameter: number): number {
  if (cfm <= 0 || diameter <= 0) {
    throw new Error('CFM and diameter must be positive');
  }
  
  // Simplified friction rate formula
  const frictionRate = 0.0307 * Math.pow(cfm, 1.9) / Math.pow(diameter, 5.02);
  
  return Math.round(frictionRate * 1000) / 1000;
}

/**
 * Get velocity status for duct systems
 */
export function getDuctVelocityStatus(velocity: number, ductType: 'supply' | 'return' | 'branch' | 'exhaust'): string {
  const limits: Record<string, [number, number]> = {
    supply: [600, 900],
    branch: [500, 700],
    return: [500, 800],
    exhaust: [1000, 2000],
  };
  
  const [min, max] = limits[ductType];
  
  if (velocity < min) return 'low';
  if (velocity <= max) return 'optimal';
  if (velocity <= max * 1.5) return 'high';
  return 'excessive';
}

/**
 * Complete duct pressure drop calculation
 * 
 * @param cfm - Airflow in CFM
 * @param duct - Duct specification
 * @param length - Duct length in feet
 * @returns DuctPressureResult
 */
export function calculateDuctPressureDrop(
  cfm: number,
  duct: DuctSpec,
  length: number = 100
): DuctPressureResult {
  let equivalentDiameter: number | undefined;
  let diameter: number;
  
  if (duct.shape === 'circular' && duct.diameter) {
    diameter = duct.diameter;
  } else if (duct.shape === 'rectangular' && duct.width && duct.height) {
    equivalentDiameter = calculateRectangularEquivalentDiameter(duct.width, duct.height);
    diameter = equivalentDiameter;
  } else {
    throw new Error('Invalid duct specification');
  }
  
  const velocity = calculateDuctVelocity(cfm, duct);
  const velocityPressure = calculateVelocityPressure(velocity);
  const frictionRate = calculateFrictionRate(cfm, diameter);
  const pressureDrop = (frictionRate * length) / 100;
  
  // Determine flow regime (simplified - most HVAC is turbulent)
  // Re ≈ (8.56 × velocity_ft/min × diameter_in) / viscosity
  // With standard air viscosity and typical velocities, Re is almost always > 4000
  const flowRegime: 'laminar' | 'turbulent' = 'turbulent';
  
  return {
    velocity,
    velocityPressure,
    frictionRate,
    pressureDrop: Math.round(pressureDrop * 1000) / 1000,
    equivalentDiameter,
    flowRegime,
  };
}

// ============================================================================
// Fan Laws (Affinity Laws)
// ============================================================================

export interface FanLawsResult {
  condition1: {
    flowRate: number; // CFM
    speed: number; // RPM
    pressure: number; // inches wg
    power: number; // HP
  };
  condition2: {
    flowRate: number; // CFM
    speed: number; // RPM
    pressure: number; // inches wg
    power: number; // HP
  };
  ratios: {
    flowRatio: number;
    pressureRatio: number;
    powerRatio: number;
  };
  densityCorrected?: boolean;
}

export interface FanCondition {
  flowRate: number; // CFM
  speed: number; // RPM
  pressure: number; // inches wg
  power: number; // HP
  diameter?: number; // inches (optional, for diameter changes)
}

/**
 * Apply fan laws to predict performance at new conditions
 * 
 * Fan Law 1: Q₂/Q₁ = N₂/N₁ (Flow ∝ Speed)
 * Fan Law 2: P₂/P₁ = (N₂/N₁)² (Pressure ∝ Speed²)
 * Fan Law 3: HP₂/HP₁ = (N₂/N₁)³ (Power ∝ Speed³)
 * 
 * @param condition1 - Known operating condition
 * @param newSpeed - New fan speed in RPM (or set to 0 to use newDiameter)
 * @param newDiameter - New impeller diameter in inches (optional)
 * @param densityRatio - ρ₂/ρ₁ for density correction (optional, default 1.0)
 * @returns FanLawsResult with predicted condition 2
 */
export function applyFanLaws(
  condition1: FanCondition,
  newSpeed: number = 0,
  newDiameter: number = 0,
  densityRatio: number = 1.0
): FanLawsResult {
  if (newSpeed === 0 && newDiameter === 0) {
    throw new Error('Must specify either newSpeed or newDiameter');
  }
  
  const speedRatio = newSpeed > 0 ? newSpeed / condition1.speed : 1;
  const diameterRatio = newDiameter > 0 ? newDiameter / (condition1.diameter || newDiameter) : 1;
  
  let flowRatio: number;
  let pressureRatio: number;
  let powerRatio: number;
  
  if (newSpeed > 0) {
    // Speed change at constant diameter
    flowRatio = speedRatio;
    pressureRatio = Math.pow(speedRatio, 2) * densityRatio;
    powerRatio = Math.pow(speedRatio, 3) * densityRatio;
  } else {
    // Diameter change at constant speed
    flowRatio = Math.pow(diameterRatio, 3);
    pressureRatio = Math.pow(diameterRatio, 2) * densityRatio;
    powerRatio = Math.pow(diameterRatio, 5) * densityRatio;
  }
  
  const condition2 = {
    flowRate: Math.round(condition1.flowRate * flowRatio),
    speed: newSpeed > 0 ? newSpeed : condition1.speed,
    pressure: Math.round(condition1.pressure * pressureRatio * 1000) / 1000,
    power: Math.round(condition1.power * powerRatio * 1000) / 1000,
  };
  
  return {
    condition1: { ...condition1 },
    condition2,
    ratios: {
      flowRatio: Math.round(flowRatio * 1000) / 1000,
      pressureRatio: Math.round(pressureRatio * 1000) / 1000,
      powerRatio: Math.round(powerRatio * 1000) / 1000,
    },
    densityCorrected: densityRatio !== 1.0,
  };
}

/**
 * Calculate air density correction factor
 * Formula: K_d = (P_actual / P_std) × (T_std / T_actual)
 * where P is absolute pressure (psia) and T is absolute temperature (°R)
 * 
 * @param elevation - Elevation in feet (optional)
 * @param temperature - Temperature in °F (optional, default 70)
 * @returns Density ratio ρ_actual/ρ_std
 */
export function calculateDensityCorrection(
  elevation: number = 0,
  temperature: number = 70
): number {
  // Standard conditions: 70°F, sea level (29.92" Hg)
  const T_std = 70 + 459.67; // °R
  const P_std = 29.92; // " Hg
  
  // Calculate atmospheric pressure at elevation (simplified barometric formula)
  // P = P_std × (1 - 0.0000068756 × elevation)^5.2559
  const P_actual = P_std * Math.pow(1 - 0.0000068756 * elevation, 5.2559);
  
  // Convert temperature to absolute
  const T_actual = temperature + 459.67;
  
  // Density ratio
  const densityRatio = (P_actual / P_std) * (T_std / T_actual);
  
  return Math.round(densityRatio * 1000) / 1000;
}

// ============================================================================
// Pump Laws (Affinity Laws)
// ============================================================================

export interface PumpLawsResult {
  condition1: PumpCondition;
  condition2: {
    flowRate: number; // GPM
    speed: number; // RPM
    head: number; // feet
    power: number; // HP
  };
  ratios: {
    flowRatio: number;
    headRatio: number;
    powerRatio: number;
  };
  npshRequired?: number; // feet at condition 2
}

export interface PumpCondition {
  flowRate: number; // GPM
  speed: number; // RPM
  head: number; // feet
  power: number; // HP
  npshRequired?: number; // feet (optional, at condition 1)
}

/**
 * Apply pump affinity laws to predict performance at new conditions
 * 
 * Pump Law 1: Q₂/Q₁ = N₂/N₁ (Flow ∝ Speed)
 * Pump Law 2: H₂/H₁ = (N₂/N₁)² (Head ∝ Speed²)
 * Pump Law 3: P₂/P₁ = (N₂/N₁)³ × (ρ₂/ρ₁) (Power ∝ Speed³ × Density)
 * 
 * Note: Pump laws are mathematically identical to fan laws, but use
 * different terminology (head instead of pressure, GPM instead of CFM)
 * 
 * @param condition1 - Known operating condition
 * @param newSpeed - New pump speed in RPM
 * @param densityRatio - ρ₂/ρ₁ for density correction (optional, default 1.0)
 * @returns PumpLawsResult with predicted condition 2
 */
export function applyPumpLaws(
  condition1: PumpCondition,
  newSpeed: number,
  densityRatio: number = 1.0
): PumpLawsResult {
  if (newSpeed <= 0) {
    throw new Error('New speed must be positive');
  }
  
  const speedRatio = newSpeed / condition1.speed;
  
  const flowRatio = speedRatio;
  const headRatio = Math.pow(speedRatio, 2);
  const powerRatio = Math.pow(speedRatio, 3) * densityRatio;
  
  const condition2 = {
    flowRate: Math.round(condition1.flowRate * flowRatio),
    speed: newSpeed,
    head: Math.round(condition1.head * headRatio * 10) / 10,
    power: Math.round(condition1.power * powerRatio * 1000) / 1000,
  };
  
  // NPSH required scales with speed²
  let npshRequired: number | undefined;
  if (condition1.npshRequired) {
    npshRequired = Math.round(condition1.npshRequired * headRatio * 10) / 10;
  }
  
  return {
    condition1: { ...condition1 },
    condition2,
    ratios: {
      flowRatio: Math.round(flowRatio * 1000) / 1000,
      headRatio: Math.round(headRatio * 1000) / 1000,
      powerRatio: Math.round(powerRatio * 1000) / 1000,
    },
    npshRequired,
  };
}

/**
 * Calculate hydraulic power (water horsepower)
 * Formula: P_hyd = (Q × H × SG) / 3960
 * where Q is in GPM, H is in feet, SG is specific gravity
 * 
 * @param flowRate - Flow rate in GPM
 * @param head - Total head in feet
 * @param specificGravity - Fluid specific gravity (1.0 for water)
 * @returns Hydraulic power in HP
 */
export function calculateHydraulicPower(
  flowRate: number,
  head: number,
  specificGravity: number = 1.0
): number {
  if (flowRate <= 0 || head <= 0) {
    throw new Error('Flow rate and head must be positive');
  }
  
  // P_hyd = (Q × H × SG) / 3960
  const power = (flowRate * head * specificGravity) / 3960;
  
  return Math.round(power * 1000) / 1000;
}

/**
 * Calculate brake horsepower (actual motor power)
 * Formula: PShaft = P_hyd / η
 * 
 * @param flowRate - Flow rate in GPM
 * @param head - Total head in feet
 * @param efficiency - Pump efficiency (0.0 to 1.0)
 * @param specificGravity - Fluid specific gravity (default 1.0)
 * @returns Brake horsepower in HP
 */
export function calculateBrakeHorsepower(
  flowRate: number,
  head: number,
  efficiency: number,
  specificGravity: number = 1.0
): number {
  if (efficiency <= 0 || efficiency > 1) {
    throw new Error('Efficiency must be between 0 and 1');
  }
  
  const hydraulicPower = calculateHydraulicPower(flowRate, head, specificGravity);
  const brakeHP = hydraulicPower / efficiency;
  
  return Math.round(brakeHP * 1000) / 1000;
}

/**
 * Calculate specific speed (pump classifier)
 * Formula: N_s = N × √Q / H^0.75
 * where N is in RPM, Q is in GPM, H is in feet
 * 
 * @param speed - Pump speed in RPM
 * @param flowRate - Flow rate in GPM (at BEP)
 * @param head - Head in feet (at BEP)
 * @returns Specific speed (dimensionless)
 */
export function calculateSpecificSpeed(
  speed: number,
  flowRate: number,
  head: number
): number {
  if (speed <= 0 || flowRate <= 0 || head <= 0) {
    throw new Error('All parameters must be positive');
  }
  
  const Ns = speed * Math.sqrt(flowRate) / Math.pow(head, 0.75);
  
  return Math.round(Ns);
}

/**
 * Get pump type classification based on specific speed
 */
export function getPumpType(specificSpeed: number): string {
  if (specificSpeed < 2000) return 'Radial flow (centrifugal)';
  if (specificSpeed < 4000) return 'Mixed flow';
  if (specificSpeed < 9000) return 'Axial flow (propeller)';
  return 'High specific speed';
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
