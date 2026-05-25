'use client';

import React, { useState } from 'react';
import {
  applyPumpLaws,
  calculateHydraulicPower,
  calculateBrakeHorsepower,
  calculateSpecificSpeed,
  getPumpType,
} from '@/lib/hvac-calculations';

export function PumpLawsCalculator() {
  const [condition1, setCondition1] = useState({
    flowRate: 100,
    speed: 3500,
    head: 100,
    power: 5.0,
    npshRequired: 10,
  });
  const [newSpeed, setNewSpeed] = useState<number>(0);
  const [specificGravity, setSpecificGravity] = useState<number>(1.0);
  const [efficiency, setEfficiency] = useState<number>(75);
  const [result, setResult] = useState<ReturnType<typeof applyPumpLaws> | null>(null);

  const handleCalculate = () => {
    try {
      const densityRatio = specificGravity;
      const calcResult = applyPumpLaws(condition1, newSpeed, densityRatio);
      setResult(calcResult);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setCondition1({
      flowRate: 100,
      speed: 3500,
      head: 100,
      power: 5.0,
      npshRequired: 10,
    });
    setNewSpeed(0);
    setSpecificGravity(1.0);
    setEfficiency(75);
    setResult(null);
  };

  // Calculate derived values
  const hydraulicPower = calculateHydraulicPower(condition1.flowRate, condition1.head, specificGravity);
  const brakeHP = calculateBrakeHorsepower(
    condition1.flowRate,
    condition1.head,
    efficiency / 100,
    specificGravity
  );
  const specificSpeed = calculateSpecificSpeed(condition1.speed, condition1.flowRate, condition1.head);
  const pumpType = getPumpType(specificSpeed);

  return (
    <div className="space-y-6">
      {/* Known Condition */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Known Operating Condition (at BEP)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Flow Rate (GPM)
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
              Total Head (feet)
            </label>
            <input
              type="number"
              min="0"
              value={condition1.head}
              onChange={(e) => setCondition1({ ...condition1, head: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Brake Power (HP)
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
          
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              NPSH Required (feet)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={condition1.npshRequired}
              onChange={(e) => setCondition1({ ...condition1, npshRequired: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* New Speed */}
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
          placeholder="Enter new pump speed"
        />
      </div>

      {/* Fluid Properties */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specific Gravity
          </label>
          <input
            type="number"
            min="0.5"
            max="2.0"
            step="0.01"
            value={specificGravity}
            onChange={(e) => setSpecificGravity(parseFloat(e.target.value) || 1.0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            1.0 = water, 0.8-0.9 = oil, 1.03 = seawater
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pump Efficiency (%)
          </label>
          <input
            type="number"
            min="10"
            max="100"
            value={efficiency}
            onChange={(e) => setEfficiency(parseInt(e.target.value) || 75)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Current Performance */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Current Performance Analysis
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Hydraulic Power</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {hydraulicPower} HP
            </p>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Brake Horsepower</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {brakeHP} HP
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              at {efficiency}% efficiency
            </p>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Specific Speed</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {specificSpeed.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {pumpType}
            </p>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Efficiency Check</span>
            <p className={`text-lg font-semibold ${
              Math.abs(condition1.power - brakeHP) < 0.5
                ? 'text-green-600 dark:text-green-400'
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {Math.abs(condition1.power - brakeHP) < 0.5 ? '✓ Consistent' : 'Check values'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          disabled={newSpeed <= 0}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Condition 1 ({condition1.speed} RPM)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Flow</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.flowRate} GPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Head</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.head} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Power</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.condition1.power} HP</span>
                </div>
                {result.condition1.npshRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">NPSHr</span>
                    <span className="text-gray-900 dark:text-white font-medium">{result.condition1.npshRequired} ft</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Condition 2 ({newSpeed} RPM)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Flow</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.flowRate} GPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Head</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.head} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Power</span>
                  <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.condition2.power} HP</span>
                </div>
                {result.npshRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">NPSHr</span>
                    <span className="text-indigo-900 dark:text-indigo-100 font-medium">{result.npshRequired} ft</span>
                  </div>
                )}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Head Ratio</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.ratios.headRatio}×
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

          {/* Pump Laws */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Pump Affinity Laws Applied
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Pump Law 1: Q₂/Q₁ = N₂/N₁ (Flow ∝ Speed)</li>
              <li>• Pump Law 2: H₂/H₁ = (N₂/N₁)² (Head ∝ Speed²)</li>
              <li>• Pump Law 3: P₂/P₁ = (N₂/N₁)³ × ρ₂/ρ₁ (Power ∝ Speed³ × Density)</li>
              <li>• NPSHr scales with head: NPSHr₂ = NPSHr₁ × (N₂/N₁)²</li>
            </ul>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Pump Affinity Laws
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Pump laws predict performance changes when speed changes (constant impeller diameter):
        </p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Flow:</strong> Q₂ = Q₁ × (N₂/N₁)</li>
          <li>• <strong>Head:</strong> H₂ = H₁ × (N₂/N₁)²</li>
          <li>• <strong>Power:</strong> P₂ = P₁ × (N₂/N₁)³ × (ρ₂/ρ₁)</li>
          <li>• <strong>NPSHr:</strong> NPSHr₂ = NPSHr₁ × (N₂/N₁)²</li>
          <li>• <strong>Specific Speed:</strong> Ns = N × √Q / H^0.75 (pump type classifier)</li>
        </ul>
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Pump Types by Specific Speed:</strong>
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-1">
            <li>• Ns &lt; 2000: Radial flow (centrifugal) - high head, low flow</li>
            <li>• 2000-4000: Mixed flow - medium head and flow</li>
            <li>• 4000-9000: Axial flow (propeller) - low head, high flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
