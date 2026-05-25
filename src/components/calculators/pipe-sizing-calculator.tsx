'use client';

import React, { useState } from 'react';
import {
  calculatePipeSizing,
  PIPE_SIZES,
  WATER_PROPERTIES,
  getGlycolProperties,
} from '@/lib/hvac-calculations';

export function PipeSizingCalculator() {
  const [flowRate, setFlowRate] = useState<number>(10);
  const [pipeSize, setPipeSize] = useState<string>('1');
  const [glycolPercent, setGlycolPercent] = useState<number>(0);
  const [result, setResult] = useState<ReturnType<typeof calculatePipeSizing> | null>(null);

  const pipeSizes = Object.keys(PIPE_SIZES);

  const handleCalculate = () => {
    try {
      const fluid = glycolPercent > 0 ? getGlycolProperties(glycolPercent) : { ...WATER_PROPERTIES, glycolPercent: 0 };
      const calcResult = calculatePipeSizing(flowRate, pipeSize, fluid);
      setResult(calcResult);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setFlowRate(10);
    setPipeSize('1');
    setGlycolPercent(0);
    setResult(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 dark:text-green-400';
      case 'low': return 'text-blue-600 dark:text-blue-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'excessive': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  const getFlowRegimeColor = (regime: string) => {
    switch (regime) {
      case 'turbulent': return 'text-red-600 dark:text-red-400';
      case 'transitional': return 'text-orange-600 dark:text-orange-400';
      case 'laminar': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Flow Rate (GPM)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={flowRate}
            onChange={(e) => setFlowRate(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pipe Size (inches)
          </label>
          <select
            value={pipeSize}
            onChange={(e) => setPipeSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {pipeSizes.map(size => (
              <option key={size} value={size}>{size}" (ID: {PIPE_SIZES[size]}")</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Glycol Concentration (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={glycolPercent}
            onChange={(e) => setGlycolPercent(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
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
          {/* Status Overview */}
          <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Velocity</span>
                <p className={`text-2xl font-bold ${getStatusColor(result.velocityStatus)}`}>
                  {result.velocity} ft/s
                </p>
                <p className={`text-sm ${getStatusColor(result.velocityStatus)}`}>
                  {result.velocityStatus.charAt(0).toUpperCase() + result.velocityStatus.slice(1)}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Pressure Drop</span>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.pressureDrop} psi/100ft
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Reynolds Number</span>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {result.reynoldsNumber.toLocaleString()}
              </p>
              <p className={`text-sm ${getFlowRegimeColor(result.flowRegime)}`}>
                {result.flowRegime.charAt(0).toUpperCase() + result.flowRegime.slice(1)} flow
              </p>
            </div>
            
            {result.recommendedSize && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="text-sm text-blue-600 dark:text-blue-400">Recommendation</span>
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  Consider {result.recommendedSize}" pipe
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  For {result.velocityStatus === 'low' ? 'better velocity' : 'reduced pressure drop'}
                </p>
              </div>
            )}
          </div>

          {/* Fluid Properties */}
          {glycolPercent > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Fluid Properties ({glycolPercent}% Glycol)
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Density</span>
                  <p className="text-gray-900 dark:text-white">
                    {getGlycolProperties(glycolPercent).density} lb/ft³
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Viscosity</span>
                  <p className="text-gray-900 dark:text-white">
                    {getGlycolProperties(glycolPercent).viscosity} cP
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          ASHRAE Velocity Guidelines
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Optimal velocity: 2-4 ft/s (chilled water), 4-7 ft/s (condenser water)</li>
          <li>• Max velocity: 7 ft/s (erosion limit for copper piping)</li>
          <li>• Min velocity: 2 ft/s (prevents sediment accumulation)</li>
          <li>• Pressure drop target: &lt;4 ft/100ft main runs, &lt;8 ft/100ft branches</li>
        </ul>
      </div>
    </div>
  );
}
