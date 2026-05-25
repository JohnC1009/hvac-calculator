'use client';

import React, { useState } from 'react';
import {
  calculateConduitFill,
  calculateMaxConductors,
  WIRE_AREAS,
  CONDUIT_AREAS,
  NEC_FILL_LIMITS,
} from '@/lib/hvac-calculations';

interface WireEntry {
  id: number;
  gauge: string;
  count: number;
}

export function ConduitFillCalculator() {
  const [wires, setWires] = useState<WireEntry[]>([
    { id: 1, gauge: '14 AWG', count: 3 }
  ]);
  const [conduitSize, setConduitSize] = useState<string>('3/4');
  const [result, setResult] = useState<ReturnType<typeof calculateConduitFill> | null>(null);

  const wireGauges = Object.keys(WIRE_AREAS);
  const conduitSizes = Object.keys(CONDUIT_AREAS);

  const handleAddWire = () => {
    setWires([...wires, { id: Date.now(), gauge: '14 AWG', count: 1 }]);
  };

  const handleRemoveWire = (id: number) => {
    if (wires.length > 1) {
      setWires(wires.filter(w => w.id !== id));
    }
  };

  const handleWireChange = (id: number, field: 'gauge' | 'count', value: string | number) => {
    setWires(wires.map(w =>
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const handleCalculate = () => {
    try {
      const calcResult = calculateConduitFill(
        wires.map(w => ({ gauge: w.gauge, count: w.count })),
        conduitSize
      );
      setResult(calcResult);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setWires([{ id: 1, gauge: '14 AWG', count: 3 }]);
    setConduitSize('3/4');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Wire Entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Conductors in Conduit
          </label>
          <button
            onClick={handleAddWire}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            + Add Wire Type
          </button>
        </div>
        
        {wires.map((wire, index) => (
          <div key={wire.id} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Wire Gauge
              </label>
              <select
                value={wire.gauge}
                onChange={(e) => handleWireChange(wire.id, 'gauge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {wireGauges.map(gauge => (
                  <option key={gauge} value={gauge}>{gauge}</option>
                ))}
              </select>
            </div>
            
            <div className="w-24">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Count
              </label>
              <input
                type="number"
                min="1"
                value={wire.count}
                onChange={(e) => handleWireChange(wire.id, 'count', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            
            <button
              onClick={() => handleRemoveWire(wire.id)}
              disabled={wires.length === 1}
              className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
              title="Remove wire type"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Conduit Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conduit Size (EMT)
        </label>
        <select
          value={conduitSize}
          onChange={(e) => setConduitSize(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {conduitSizes.map(size => (
            <option key={size} value={size}>{size}" ({CONDUIT_AREAS[size]} in²)</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Calculate Fill
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
        <div className={`p-4 rounded-lg border-2 ${
          result.compliant
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-2xl ${result.compliant ? 'text-green-600' : 'text-red-600'}`}>
              {result.compliant ? '✓' : '✗'}
            </span>
            <span className={`font-semibold ${
              result.compliant ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}>
              {result.compliant ? 'NEC Compliant' : 'NEC Violation'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Fill Percentage</span>
              <p className={`text-lg font-semibold ${
                result.compliant ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }`}>
                {result.fillPercentage}%
              </p>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">Max Allowable</span>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {result.maxAllowableFill}%
              </p>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500 dark:text-gray-400">Remaining Capacity</span>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {result.remainingCapacity} in²
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>NEC Fill Limits:</strong> 1 conductor = 53%, 2 conductors = 31%, 3+ conductors = 40%
            </p>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          NEC Conduit Fill Reference
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• NEC Table 1, Chapter 9: 1 wire = 53%, 2 wires = 31%, 3+ wires = 40%</li>
          <li>• Includes equipment grounding conductor in fill calculation</li>
          <li>• Nipples (conduit ≤ 24"): 60% fill permitted</li>
          <li>• &gt;3 current-carrying conductors: ampacity derating required</li>
        </ul>
      </div>
    </div>
  );
}
