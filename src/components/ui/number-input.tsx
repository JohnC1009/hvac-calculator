'use client';

import React from 'react';

interface NumberInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  unit,
  required = false,
  helpText,
  error,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange('');
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="number"
          name={id}
          id={id}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border ${
            error ? 'border-red-500' : ''
          }`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
        {unit && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{unit}</span>
          </div>
        )}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
