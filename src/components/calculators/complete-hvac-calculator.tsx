'use client';

import React, { useState } from 'react';
import { NumberInput } from '../ui/number-input';
import { SelectInput } from '../ui/select-input';
import { ResultsDisplay } from '../ui/results-display';
import * as hvac from '@/lib/hvac-calculations';

export function CompleteHVACCalculator() {
  const [roomArea, setRoomArea] = useState<number | ''>('');
  const [ceilingHeight, setCeilingHeight] = useState<number | ''>('');
  const [occupants, setOccupants] = useState<number | ''>('');
  const [insulationLevel, setInsulationLevel] = useState<'poor' | 'average' | 'good' | 'excellent'>('average');
  const [climate, setClimate] = useState<'hot' | 'moderate' | 'cold'>('moderate');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<hvac.HVACResult | null>(null);

  const calculate = () => {
    setError(null);
    setResults(null);

    if (roomArea === '' || ceilingHeight === '' || occupants === '') {
      setError('Please fill in all required fields');
      return;
    }

    if (roomArea <= 0 || ceilingHeight <= 0 || occupants < 0) {
      setError('Please enter valid positive values');
      return;
    }

    try {
      const result = hvac.calculateHVACLoad(
        roomArea,
        ceilingHeight,
        occupants,
        insulationLevel,
        climate
      );
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
    }
  };

  return (
    <div className="space-y-4">
      <NumberInput
        id="complete-area"
        label="Room Area"
        value={roomArea}
        onChange={setRoomArea}
        placeholder="e.g., 500"
        min={0}
        unit="sq ft"
        required
        helpText="Total floor area of the space"
      />
      <NumberInput
        id="complete-height"
        label="Ceiling Height"
        value={ceilingHeight}
        onChange={setCeilingHeight}
        placeholder="e.g., 8"
        min={0}
        step={0.5}
        unit="ft"
        required
        helpText="Average ceiling height"
      />
      <NumberInput
        id="complete-occupants"
        label="Number of Occupants"
        value={occupants}
        onChange={setOccupants}
        placeholder="e.g., 2"
        min={0}
        required
        helpText="Typical maximum occupancy"
      />
      <SelectInput
        id="complete-insulation"
        label="Insulation Level"
        value={insulationLevel}
        onChange={(v) => setInsulationLevel(v as typeof insulationLevel)}
        options={[
          { value: 'poor', label: 'Poor (old building, single-pane windows)' },
          { value: 'average', label: 'Average (standard construction)' },
          { value: 'good', label: 'Good (modern, double-pane windows)' },
          { value: 'excellent', label: 'Excellent (energy efficient, well-sealed)' },
        ]}
        required
      />
      <SelectInput
        id="complete-climate"
        label="Climate Zone"
        value={climate}
        onChange={(v) => setClimate(v as typeof climate)}
        options={[
          { value: 'hot', label: 'Hot (e.g., Arizona, Texas, Florida)' },
          { value: 'moderate', label: 'Moderate (e.g., California coast, Pacific Northwest)' },
          { value: 'cold', label: 'Cold (e.g., Minnesota, New England)' },
        ]}
        required
      />
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={roomArea === '' || ceilingHeight === '' || occupants === ''}
      >
        Calculate HVAC Loads
      </button>

      {results && (
        <ResultsDisplay
          title="HVAC Load Calculation Results"
          results={[
            {
              label: 'Cooling Load',
              value: results.coolingLoad || 0,
              unit: 'BTU/hr',
              highlighted: true,
            },
            {
              label: 'Heating Load',
              value: results.heatingLoad || 0,
              unit: 'BTU/hr',
              highlighted: true,
            },
            {
              label: 'Required Airflow',
              value: results.cfm || 0,
              unit: 'CFM',
            },
            {
              label: 'Hydronic Flow Rate',
              value: results.gpm || 0,
              unit: 'GPM',
            },
            {
              label: 'Sensible Heat Ratio',
              value: results.SHR || 0,
            },
          ]}
          warnings={results.warnings}
        />
      )}
    </div>
  );
}
