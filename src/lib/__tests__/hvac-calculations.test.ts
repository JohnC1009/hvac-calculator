import { describe, it, expect } from 'vitest';
import * as hvac from '../hvac-calculations';

describe('HVAC Calculations', () => {
  describe('calculateLoadFromCFM', () => {
    it('should calculate heating load correctly', () => {
      // Q = 1.08 × CFM × ΔT
      // For CFM = 400, ΔT = 20: Q = 1.08 × 400 × 20 = 8640
      const result = hvac.calculateLoadFromCFM(400, 20, 'heating');
      expect(result).toBe(8640);
    });

    it('should calculate cooling load (negative)', () => {
      const result = hvac.calculateLoadFromCFM(400, 20, 'cooling');
      expect(result).toBe(-8640);
    });

    it('should handle zero values', () => {
      expect(hvac.calculateLoadFromCFM(0, 20)).toBe(0);
      expect(hvac.calculateLoadFromCFM(400, 0)).toBe(0);
    });

    it('should throw error for negative CFM', () => {
      expect(() => hvac.calculateLoadFromCFM(-100, 20)).toThrow('non-negative');
    });

    it('should throw error for negative deltaT', () => {
      expect(() => hvac.calculateLoadFromCFM(400, -5)).toThrow('non-negative');
    });
  });

  describe('calculateCFMFromLoad', () => {
    it('should calculate required CFM from load', () => {
      // CFM = Q / (1.08 × ΔT)
      // For Q = 12000, ΔT = 20: CFM = 12000 / (1.08 × 20) = 555.56
      const result = hvac.calculateCFMFromLoad(12000, 20);
      expect(result).toBeCloseTo(555.56, 0);
    });

    it('should handle negative load (cooling)', () => {
      const result = hvac.calculateCFMFromLoad(-12000, 20);
      expect(result).toBeCloseTo(555.56, 0);
    });

    it('should throw error for zero deltaT', () => {
      expect(() => hvac.calculateCFMFromLoad(12000, 0)).toThrow('positive');
    });
  });

  describe('calculateDeltaT', () => {
    it('should calculate temperature difference from load and CFM', () => {
      // ΔT = Q / (1.08 × CFM)
      // For Q = 12000, CFM = 500: ΔT = 12000 / (1.08 × 500) = 22.22
      const result = hvac.calculateDeltaT(12000, 500);
      expect(result).toBeCloseTo(22.22, 1);
    });

    it('should throw error for zero CFM', () => {
      expect(() => hvac.calculateDeltaT(12000, 0)).toThrow('positive');
    });
  });

  describe('calculateTotalCooling', () => {
    it('should calculate total cooling with enthalpy', () => {
      // Q_total = 4.5 × CFM × Δh
      // For CFM = 1000, Δh = 10: Q = 4.5 × 1000 × 10 = 45000
      const result = hvac.calculateTotalCooling(1000, 10);
      expect(result).toBe(45000);
    });

    it('should throw error for negative values', () => {
      expect(() => hvac.calculateTotalCooling(-1000, 10)).toThrow('non-negative');
      expect(() => hvac.calculateTotalCooling(1000, -5)).toThrow('non-negative');
    });
  });

  describe('calculateGPM', () => {
    it('should calculate hydronic flow rate', () => {
      // GPM = Q / (500 × ΔT)
      // For Q = 50000, ΔT = 20: GPM = 50000 / (500 × 20) = 5
      const result = hvac.calculateGPM(50000, 20);
      expect(result).toBe(5);
    });

    it('should handle cooling load (negative)', () => {
      const result = hvac.calculateGPM(-50000, 20);
      expect(result).toBe(5);
    });

    it('should throw error for zero deltaT', () => {
      expect(() => hvac.calculateGPM(50000, 0)).toThrow('positive');
    });
  });

  describe('calculateLoadFromGPM', () => {
    it('should calculate load from hydronic flow', () => {
      // Q = 500 × GPM × ΔT
      // For GPM = 5, ΔT = 20: Q = 500 × 5 × 20 = 50000
      const result = hvac.calculateLoadFromGPM(5, 20, 'heating');
      expect(result).toBe(50000);
    });

    it('should calculate cooling load (negative)', () => {
      const result = hvac.calculateLoadFromGPM(5, 20, 'cooling');
      expect(result).toBe(-50000);
    });

    it('should throw error for negative values', () => {
      expect(() => hvac.calculateLoadFromGPM(-5, 20)).toThrow('non-negative');
      expect(() => hvac.calculateLoadFromGPM(5, -10)).toThrow('non-negative');
    });
  });

  describe('airflow calculations', () => {
    it('should calculate CFM from area and velocity', () => {
      // CFM = Area × Velocity
      // For Area = 2 sq ft, Velocity = 500 FPM: CFM = 2 × 500 = 1000
      const result = hvac.calculateCFMFromArea(2, 500);
      expect(result).toBe(1000);
    });

    it('should calculate area from CFM and velocity', () => {
      // Area = CFM / Velocity
      // For CFM = 1000, Velocity = 500: Area = 1000 / 500 = 2
      const result = hvac.calculateAreaFromCFM(1000, 500);
      expect(result).toBe(2);
    });

    it('should calculate velocity from CFM and area', () => {
      // Velocity = CFM / Area
      // For CFM = 1000, Area = 2: Velocity = 1000 / 2 = 500
      const result = hvac.calculateVelocity(1000, 2);
      expect(result).toBe(500);
    });
  });

  describe('calculateEquivalentDiameter', () => {
    it('should calculate equivalent diameter for rectangular duct', () => {
      // For 12" × 24" duct
      const result = hvac.calculateEquivalentDiameter(12, 24);
      expect(result).toBeGreaterThan(16);
      expect(result).toBeLessThan(20);
    });

    it('should throw error for zero dimensions', () => {
      expect(() => hvac.calculateEquivalentDiameter(0, 24)).toThrow('positive');
      expect(() => hvac.calculateEquivalentDiameter(12, 0)).toThrow('positive');
    });
  });

  describe('calculateSHR', () => {
    it('should calculate sensible heat ratio', () => {
      // SHR = Q_sensible / Q_total
      // For sensible = 80000, total = 100000: SHR = 0.8
      const result = hvac.calculateSHR(80000, 100000);
      expect(result).toBe(0.8);
    });

    it('should throw error when sensible exceeds total', () => {
      expect(() => hvac.calculateSHR(120000, 100000)).toThrow('cannot exceed');
    });

    it('should throw error for zero total load', () => {
      expect(() => hvac.calculateSHR(80000, 0)).toThrow('positive');
    });
  });

  describe('convertTemperature', () => {
    it('should convert Celsius to Fahrenheit', () => {
      expect(hvac.convertTemperature(0, 'C', 'F')).toBe(32);
      expect(hvac.convertTemperature(100, 'C', 'F')).toBe(212);
      expect(hvac.convertTemperature(20, 'C', 'F')).toBe(68);
    });

    it('should convert Fahrenheit to Celsius', () => {
      expect(hvac.convertTemperature(32, 'F', 'C')).toBe(0);
      expect(hvac.convertTemperature(212, 'F', 'C')).toBe(100);
      expect(hvac.convertTemperature(68, 'F', 'C')).toBe(20);
    });

    it('should return same value for same units', () => {
      expect(hvac.convertTemperature(25, 'C', 'C')).toBe(25);
      expect(hvac.convertTemperature(77, 'F', 'F')).toBe(77);
    });
  });

  describe('calculateHVACLoad (complete)', () => {
    it('should calculate complete HVAC load for a room', () => {
      // For a 500 sq ft room with 8 ft ceiling, 2 occupants, average insulation, moderate climate
      const result = hvac.calculateHVACLoad(500, 8, 2, 'average', 'moderate');
      
      expect(result.coolingLoad).toBeGreaterThan(0);
      expect(result.heatingLoad).toBeGreaterThan(0);
      expect(result.cfm).toBeGreaterThan(0);
      expect(result.gpm).toBeGreaterThan(0);
      expect(result.SHR).toBeGreaterThan(0);
      expect(result.SHR).toBeLessThanOrEqual(1);
    });

    it('should adjust for insulation level', () => {
      const poor = hvac.calculateHVACLoad(500, 8, 0, 'poor', 'moderate');
      const excellent = hvac.calculateHVACLoad(500, 8, 0, 'excellent', 'moderate');
      
      expect(poor.coolingLoad!).toBeGreaterThan(excellent.coolingLoad!);
      expect(poor.heatingLoad!).toBeGreaterThan(excellent.heatingLoad!);
    });

    it('should adjust for climate', () => {
      const hot = hvac.calculateHVACLoad(500, 8, 0, 'average', 'hot');
      const cold = hvac.calculateHVACLoad(500, 8, 0, 'average', 'cold');
      
      expect(hot.coolingLoad!).toBeGreaterThan(cold.coolingLoad!);
    });

    it('should add occupant load', () => {
      const withOccupants = hvac.calculateHVACLoad(500, 8, 3, 'average', 'moderate');
      const withoutOccupants = hvac.calculateHVACLoad(500, 8, 0, 'average', 'moderate');
      
      // Each occupant adds ~400 BTU/hr
      expect(withOccupants.coolingLoad!).toBeGreaterThan(withoutOccupants.coolingLoad!);
      expect(withOccupants.warnings).toContainEqual(expect.stringContaining('occupant'));
    });

    it('should throw error for invalid inputs', () => {
      expect(() => hvac.calculateHVACLoad(0, 8, 0)).toThrow('Invalid input');
      expect(() => hvac.calculateHVACLoad(-100, 8, 0)).toThrow('Invalid input');
      expect(() => hvac.calculateHVACLoad(500, 0, 0)).toThrow('Invalid input');
      expect(() => hvac.calculateHVACLoad(500, 8, -1)).toThrow('Invalid input');
    });
  });
});
