'use client';

import React, { useState } from 'react';
import { NumberInput } from '../ui/number-input';
import { ResultsDisplay } from '../ui/results-display';
import * as hvac from '@/lib/hvac-calculations';

export function CFMCalculator() {
  const [load, setLoad] = useState<number | ''>('');
  const [deltaT, setDeltaT] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    cfm?: number;
    formula?: string;
  } | null>(null);

  const calculate = () => {
    setError(null);
    setResults(null);

    if (load === '' || deltaT === '') {
      setError('Please enter both load and Delta T values');
      return;
    }

    if (deltaT <= 0) {
      setError('Delta T must be positive');
      return;
    }

    try {
      const cfm = hvac.calculateCFMFromLoad(load, deltaT);
      setResults({
        cfm: Math.round(cfm),
        formula: `CFM = |${load}| / (1.08 × ${deltaT})`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
    }
  };

  return (
    <div className="space-y-4">
      <NumberInput
        id="cfm-load"
        label="Heating/Cooling Load"
        value={load}
        onChange={setLoad}
        placeholder="e.g., 12000"
        unit="BTU/hr"
        helpText="Total heating or cooling load (use positive values)"
      />
      <NumberInput
        id="cfm-deltaT"
        label="Temperature Difference (ΔT)"
        value={deltaT}
        onChange={setDeltaT}
        placeholder="e.g., 20"
        min={0.1}
        step={0.1}
        unit="°F"
        helpText="Typical ΔT: 15-25°F for cooling, 40-70°F for heating"
      />
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={load === '' || deltaT === ''}
      >
        Calculate Required CFM
      </button>

      {results && (
        <ResultsDisplay
          title="Required Airflow"
          results={[
            {
              label: 'Required CFM',
              value: results.cfm || 0,
              unit: 'CFM',
              formula: results.formula,
              highlighted: true,
            },
            {
              label: 'Load',
              value: load || 0,
              unit: 'BTU/hr',
            },
            {
              label: 'Temperature Difference',
              value: deltaT || 0,
              unit: '°F',
            },
          ]}
          warnings={[
            'This is the theoretical airflow. Add 10-20% safety margin for real-world applications.'
          ]}
        />
      )}
    </div>
  );
}
