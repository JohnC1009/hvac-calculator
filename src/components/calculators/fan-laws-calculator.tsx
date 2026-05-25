'use client';

import React, { useState } from 'react';
import {
  applyFanLaws,
  calculateDensityCorrection,
} from '@/lib/hvac-calculations';

export function FanLawsCalculator() {
  const [condition1, setCondition1] = useState({
    flowRate: 1000,
    speed: 1750,
    pressure: 2.0,
    power: 1.0,
  });
  const [newSpeed, setNewSpeed] = useState<number>(0);
  const [newDiameter, setNewDiameter] = useState<number>(0);
  const [elevation, setElevation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(70);
  const [useDensityCorrection, setUseDensityCorrection] = useState<boolean>(false);
  const [result, setResult] = useState<ReturnType<typeof applyFanLaws> | null>(null);

  const handleCalculate = () => {
    try {
      let densityRatio = 1.0;
      
      if (useDensityCorrection) {
        densityRatio = calculateDensityCorrection(elevation, temperature);
      }

      const calcResult = applyFanLaws(
        condition1,
        newSpeed > 0 ? newSpeed : 0,
        newDiameter > 0 ? newDiameter : 0,
        densityRatio
      );
      setResult(calcResult);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setCondition1({
      flowRate: 1000,
      speed: 1750,
      pressure: 2.0,
      power: 1.0,
    });
    setNewSpeed(0);
    setNewDiameter(0);
    setElevation(0);
    setTemperature(70);
    setUseDensityCorrection(false);
    setResult(null);
  };

  const changeType = newSpeed > 0 ? 'speed' : newDiameter > 0 ? 'diameter' : null;

  return (
    <div className="space-y-6">
      {/* Known Condition */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Known Operating Condition
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Flow Rate (CFM)
            </label>
            <input
              type="number"
              min="0"
              value={condition1.flowRate}
              onChange={(e) => setCondition1({ ...condition1, flowRate: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Speed (RPM)
            </label>
            <input
              type="number"
              min="0"
              value={condition1.speed}
              onChange={(e) => setCondition1({ ...condition1, speed: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Static Pressure (" wg)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={condition1.pressure}
              onChange={(e) => setCondition1({ ...condition1, pressure: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Power (HP)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={condition1.power}
              onChange={(e) => setCondition1({ ...condition1, power: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Change Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Change Type
        </label>
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              checked={newSpeed >= 0 && newDiameter === 0}
              onChange={() => { setNewSpeed(1750); setNewDiameter(0); }}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Speed Change</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={newDiameter > 0}
              onChange={() => { setNewSpeed(0); setNewDiameter(condition1.power > 0 ? 10 : 10); }}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Impeller Diameter Change</span>
          </label>
        </div>
      </div>

      {/* New Speed or Diameter */}
      {newSpeed > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Speed (RPM)
          </label>
          <input
            type="number"
            min="0"
            value={newSpeed}
            onChange={(e) => setNewSpeed(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {newDiameter > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Diameter (inches)
          </label>
          <input
            type="number"
            min="1"
            value={newDiameter}
            onChange={(e) => setNewDiameter(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* Density Correction */}
      <div>
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={useDensityCorrection}
            onChange={(e) => setUseDensityCorrection(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Apply Density Correction</span>
        </label>
        
        {useDensityCorrection && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Elevation (feet)
              </label>
              <input
                type="number"
                min="0"
                value={elevation}
                onChange={(e) => setElevation(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Temperature (°F)
              </label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value) || 70)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            
            <div className="col-span-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Density ratio: ρ_actual/ρ_std = {calculateDensityCorrection(elevation, temperature)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Compare Conditions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Condition 1
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Flow</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.flowRate} CFM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Speed</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.speed} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pressure</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.pressure}" wg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Power</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.power} HP</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Condition 2 (Predicted)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Flow</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.flowRate} CFM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Speed</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.speed} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pressure</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.pressure}" wg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Power</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.power} HP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ratios */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Change Ratios
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Flow Ratio</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.ratios.flowRatio}×
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Pressure Ratio</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.ratios.pressureRatio}×
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Power Ratio</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.ratios.powerRatio}×
                </p>
              </div>
            </div>
          </div>

          {/* Fan Laws */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Fan Laws Applied
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Fan Law 1: Q₂/Q₁ = N₂/N₁ (Flow ∝ Speed)</li>
              <li>• Fan Law 2: P₂/P₁ = (N₂/N₁)² (Pressure ∝ Speed²)</li>
              <li>• Fan Law 3: HP₂/HP₁ = (N₂/N₁)³ (Power ∝ Speed³)</li>
            </ul>
            {result.densityCorrected && (
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                ✓ Density correction applied for elevation and temperature
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Fan Affinity Laws
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Fan laws predict performance changes when speed or impeller diameter changes:
        </p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Speed change:</strong> Flow ∝ RPM, Pressure ∝ RPM², Power ∝ RPM³</li>
          <li>• <strong>Diameter change:</strong> Flow ∝ D³, Pressure ∝ D², Power ∝ D⁵</li>
          <li>• Standard conditions: 70°F, sea level, air density 0.075 lb/ft³</li>
          <li>• Density correction needed at high elevation or extreme temperatures</li>
        </ul>
      </div>
    </div>
  );
}
