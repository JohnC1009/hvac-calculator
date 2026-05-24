'use client';

import React, { useState } from 'react';
import { NumberInput } from '../ui/number-input';
import { ResultsDisplay } from '../ui/results-display';
import * as hvac from '@/lib/hvac-calculations';

export function HydronicCalculator() {
  const [load, setLoad] = useState<number | ''>('');
  const [deltaT, setDeltaT] = useState<number | ''>('');
  const [gpm, setGpm] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<'load-from-gpm' | 'gpm-from-load'>('gpm-from-load');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    gpm?: number;
    load?: number;
    formula?: string;
  } | null>(null);

  const calculate = () => {
    setError(null);
    setResults(null);

    try {
      if (calculationType === 'gpm-from-load') {
        if (load === '' || deltaT === '') {
          setError('Please enter both load and Delta T values');
          return;
        }

        if (deltaT <= 0) {
          setError('Delta T must be positive');
          return;
        }

        const calculatedGpm = hvac.calculateGPM(load, deltaT);
        setResults({
          gpm: Math.round(calculatedGpm * 100) / 100,
          formula: `GPM = |${load}| / (500 × ${deltaT})`,
        });
      } else {
        if (gpm === '' || deltaT === '') {
          setError('Please enter both GPM and Delta T values');
          return;
        }

        if (gpm < 0 || deltaT < 0) {
          setError('Values cannot be negative');
          return;
        }

        const calculatedLoad = hvac.calculateLoadFromGPM(gpm, deltaT, 'heating');
        setResults({
          load: Math.round(calculatedLoad),
          formula: `Q = 500 × ${gpm} × ${deltaT}`,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setCalculationType('gpm-from-load');
            setResults(null);
            setError(null);
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            calculationType === 'gpm-from-load'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Calculate GPM
        </button>
        <button
          onClick={() => {
            setCalculationType('load-from-gpm');
            setResults(null);
            setError(null);
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            calculationType === 'load-from-gpm'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Calculate Load
        </button>
      </div>

      {calculationType === 'gpm-from-load' ? (
        <>
          <NumberInput
            id="hydronic-load"
            label="Heating/Cooling Load"
            value={load}
            onChange={setLoad}
            placeholder="e.g., 50000"
            unit="BTU/hr"
            helpText="Total heating or cooling load"
          />
          <NumberInput
            id="hydronic-deltaT"
            label="Temperature Difference (ΔT)"
            value={deltaT}
            onChange={setDeltaT}
            placeholder="e.g., 20"
            min={0.1}
            step={0.1}
            unit="°F"
            helpText="Typical ΔT: 10-20°F for hydronic systems"
          />
        </>
      ) : (
        <>
          <NumberInput
            id="hydronic-gpm"
            label="Flow Rate"
            value={gpm}
            onChange={setGpm}
            placeholder="e.g., 5"
            min={0}
            step={0.1}
            unit="GPM"
            helpText="Gallons Per Minute"
          />
          <NumberInput
            id="hydronic-deltaT-load"
            label="Temperature Difference (ΔT)"
            value={deltaT}
            onChange={setDeltaT}
            placeholder="e.g., 20"
            min={0}
            step={0.1}
            unit="°F"
          />
        </>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          calculationType === 'gpm-from-load'
            ? load === '' || deltaT === ''
            : gpm === '' || deltaT === ''
        }
      >
        Calculate
      </button>

      {results && (
        <ResultsDisplay
          title="Hydronic Calculation"
          results={[
            ...(results.gpm !== undefined
              ? [{
                  label: 'Flow Rate',
                  value: results.gpm,
                  unit: 'GPM',
                  formula: results.formula,
                  highlighted: true,
                }]
              : []),
            ...(results.load !== undefined
              ? [{
                  label: 'Heating Load',
                  value: results.load,
                  unit: 'BTU/hr',
                  formula: results.formula,
                  highlighted: true,
                }]
              : []),
          ]}
          warnings={[
            'Formula assumes water as the heat transfer fluid',
            'For glycol mixtures, adjust for different specific heat capacity'
          ]}
        />
      )}
    </div>
  );
}
