'use client';

import React from 'react';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  formula?: string;
  highlighted?: boolean;
}

export function ResultCard({ label, value, unit, formula, highlighted = false }: ResultCardProps) {
  return (
    <div className={`rounded-lg p-4 ${
      highlighted 
        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800' 
        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }`}>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
        {unit && <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
      </dd>
      {formula && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          {formula}
        </p>
      )}
    </div>
  );
}

interface ResultsDisplayProps {
  results: {
    label: string;
    value: string | number;
    unit?: string;
    formula?: string;
    highlighted?: boolean;
  }[];
  warnings?: string[];
  title?: string;
}

export function ResultsDisplay({ results, warnings, title = 'Results' }: ResultsDisplayProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {results.map((result, index) => (
          <ResultCard
            key={index}
            label={result.label}
            value={result.value}
            unit={result.unit}
            formula={result.formula}
            highlighted={result.highlighted}
          />
        ))}
      </dl>
      {warnings && warnings.length > 0 && (
        <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-800">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">Notes</h4>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-400">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
