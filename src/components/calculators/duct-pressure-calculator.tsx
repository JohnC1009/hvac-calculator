'use client';

import React, { useState } from 'react';
import {
  calculateDuctPressureDrop,
  getDuctVelocityStatus,
  calculateDuctVelocity,
  calculateVelocityPressure,
  calculateFrictionRate,
} from '@/lib/hvac-calculations';

type DuctShape = 'circular' | 'rectangular';
type DuctType = 'supply' | 'return' | 'branch' | 'exhaust';

export function DuctPressureDropCalculator() {
  const [cfm, setCfm] = useState<number>(1000);
  const [ductShape, setDuctShape] = useState<DuctShape>('circular');
  const [diameter, setDiameter] = useState<number>(12);
  const [width, setWidth] = useState<number>(14);
  const [height, setHeight] = useState<number>(10);
  const [length, setLength] = useState<number>(100);
  const [ductType, setDuctType] = useState<DuctType>('supply');
  const [result, setResult] = useState<ReturnType<typeof calculateDuctPressureDrop> | null>(null);

  const handleCalculate = () => {
    try {
      const duct = ductShape === 'circular'
        ? { shape: 'circular' as const, diameter }
        : { shape: 'rectangular' as const, width, height };
      
      const calcResult = calculateDuctPressureDrop(cfm, duct, length);
      setResult(calcResult);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setCfm(1000);
    setDuctShape('circular');
    setDiameter(12);
    setWidth(14);
    setHeight(10);
    setLength(100);
    setDuctType('supply');
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

  return (
    <div className="space-y-6">
      {/* Airflow */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Airflow (CFM)
        </label>
        <input
          type="number"
          min="0"
          value={cfm}
          onChange={(e) => setCfm(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Duct Shape */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duct Shape
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={ductShape === 'circular'}
              onChange={() => setDuctShape('circular')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Circular</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={ductShape === 'rectangular'}
              onChange={() => setDuctShape('rectangular')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Rectangular</span>
          </label>
        </div>
      </div>

      {/* Duct Dimensions */}
      {ductShape === 'circular' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Diameter (inches)
          </label>
          <input
            type="number"
            min="1"
            value={diameter}
            onChange={(e) => setDiameter(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Width (inches)
            </label>
            <input
              type="number"
              min="1"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (inches)
            </label>
            <input
              type="number"
              min="1"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Duct Length and Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duct Length (feet)
          </label>
          <input
            type="number"
            min="1"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duct Type
          </label>
          <select
            value={ductType}
            onChange={(e) => setDuctType(e.target.value as DuctType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="supply">Supply Main</option>
            <option value="branch">Branch</option>
            <option value="return">Return</option>
            <option value="exhaust">Exhaust</option>
          </select>
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
          {/* Main Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Velocity</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {result.velocity.toLocaleString()} FPM
              </p>
              <p className={`text-sm ${getStatusColor(getDuctVelocityStatus(result.velocity, ductType))}`}>
                {getDuctVelocityStatus(result.velocity, ductType)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Velocity Pressure</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {result.velocityPressure}" wg
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Friction Rate</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {result.frictionRate}" wg/100ft
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Pressure Drop</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {result.pressureDrop}" wg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                for {length} ft
              </p>
            </div>
          </div>

          {/* Equivalent Diameter */}
          {result.equivalentDiameter && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Equivalent Diameter:</strong> {result.equivalentDiameter}" (round duct with same pressure drop)
              </p>
            </div>
          )}

          {/* Flow Regime */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Flow Regime</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {result.flowRegime.charAt(0).toUpperCase() + result.flowRegime.slice(1)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Most HVAC duct systems operate in turbulent flow
            </p>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Recommended Duct Velocities (FPM)
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <strong>Supply:</strong> 600-900 FPM
          </div>
          <div>
            <strong>Branch:</strong> 500-700 FPM
          </div>
          <div>
            <strong>Return:</strong> 500-800 FPM
          </div>
          <div>
            <strong>Exhaust:</strong> 1000-2000 FPM
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Friction rate target: 0.08-0.12" wg/100ft for main runs, 0.15" wg/100ft for branches
        </p>
      </div>
    </div>
  );
}
