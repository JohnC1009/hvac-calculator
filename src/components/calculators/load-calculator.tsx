'use client';

import React, { useState } from 'react';
import { NumberInput } from '../ui/number-input';
import { SelectInput } from '../ui/select-input';
import { ResultsDisplay } from '../ui/results-display';
import * as hvac from '@/lib/hvac-calculations';

interface LoadCalculatorProps {
  mode: 'heating' | 'cooling';
}

export function LoadCalculator({ mode }: LoadCalculatorProps) {
  const [cfm, setCfm] = useState<number | ''>('');
  const [deltaT, setDeltaT] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    load?: number;
    deltaT?: number;
    formula?: string;
  } | null>(null);

  const calculate = () => {
    setError(null);
    setResults(null);

    if (cfm === '' || deltaT === '') {
      setError('Please enter both CFM and Delta T values');
      return;
    }

    if (cfm < 0 || deltaT < 0) {
      setError('Values cannot be negative');
      return;
    }

    try {
      const load = hvac.calculateLoadFromCFM(cfm, deltaT, mode);
      setResults({
        load: Math.round(load),
        deltaT,
        formula: `Q = 1.08 × ${cfm} × ${deltaT}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
    }
  };

  return (
    <div className="space-y-4">
      <NumberInput
        id="load-cfm"
        label="Airflow (CFM)"
        value={cfm}
        onChange={setCfm}
        placeholder="e.g., 400"
        min={0}
        unit="CFM"
        helpText="Cubic Feet per Minute of airflow"
      />
      <NumberInput
        id="load-deltaT"
        label="Temperature Difference (ΔT)"
        value={deltaT}
        onChange={setDeltaT}
        placeholder="e.g., 20"
        min={0}
        unit="°F"
        helpText="Difference between supply and return air temperature"
      />
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={cfm === '' || deltaT === ''}
      >
        Calculate Load ({mode === 'heating' ? 'Heating' : 'Cooling'})
      </button>

      {results && (
        <ResultsDisplay
          title="Calculated Load"
          results={[
            {
              label: `${mode === 'heating' ? 'Heating' : 'Cooling'} Load`,
              value: results.load || 0,
              unit: 'BTU/hr',
              formula: results.formula,
              highlighted: true,
            },
            {
              label: 'Airflow',
              value: cfm,
              unit: 'CFM',
            },
            {
              label: 'Temperature Difference',
              value: deltaT || 0,
              unit: '°F',
            },
          ]}
        />
      )}
    </div>
  );
}
