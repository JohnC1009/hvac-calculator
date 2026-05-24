'use client';

import React, { useState } from 'react';
import { LoadCalculator } from './load-calculator';
import { CFMCalculator } from './cfm-calculator';
import { HydronicCalculator } from './hydronic-calculator';
import { CompleteHVACCalculator } from './complete-hvac-calculator';

type CalculatorTab = 'complete' | 'load' | 'cfm' | 'hydronic';

interface TabButtonProps {
  id: CalculatorTab;
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({ id, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${id}`}
    >
      {label}
    </button>
  );
}

export function HVACCalculatorTabs() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('complete');
  const [heatingMode, setHeatingMode] = useState<'heating' | 'cooling'>('heating');

  const tabs: { id: CalculatorTab; label: string }[] = [
    { id: 'complete', label: 'Complete HVAC' },
    { id: 'load', label: 'Load Calculator' },
    { id: 'cfm', label: 'CFM Calculator' },
    { id: 'hydronic', label: 'Hydronic' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex" role="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {activeTab === 'complete' && (
          <div id="panel-complete" role="tabpanel" aria-labelledby="complete">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Complete HVAC Load Calculation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate heating and cooling loads based on room parameters, insulation, and climate zone.
              Uses industry-standard methods accounting for area, occupancy, and building envelope.
            </p>
            <CompleteHVACCalculator />
          </div>
        )}

        {activeTab === 'load' && (
          <div id="panel-load" role="tabpanel" aria-labelledby="load">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Heating/Cooling Load Calculator
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setHeatingMode('heating')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    heatingMode === 'heating'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Heating
                </button>
                <button
                  onClick={() => setHeatingMode('cooling')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    heatingMode === 'cooling'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Cooling
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate heating or cooling load from airflow and temperature difference.
              Formula: Q = 1.08 × CFM × ΔT
            </p>
            <LoadCalculator mode={heatingMode} />
          </div>
        )}

        {activeTab === 'cfm' && (
          <div id="panel-cfm" role="tabpanel" aria-labelledby="cfm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Required Airflow (CFM) Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate the required airflow for a given heating or cooling load.
              Formula: CFM = Q / (1.08 × ΔT)
            </p>
            <CFMCalculator />
          </div>
        )}

        {activeTab === 'hydronic' && (
          <div id="panel-hydronic" role="tabpanel" aria-labelledby="hydronic">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Hydronic System Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate flow rate (GPM) for hydronic heating/cooling systems or determine load from flow rate.
              Formula: GPM = Q / (500 × ΔT)
            </p>
            <HydronicCalculator />
          </div>
        )}
      </div>

      {/* Reference Section */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Formula Reference
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
          <li>• Load: Q = 1.08 × CFM × ΔT (BTU/hr)</li>
          <li>• CFM: CFM = Q / (1.08 × ΔT)</li>
          <li>• GPM: GPM = Q / (500 × ΔT)</li>
          <li>• Total Cooling: Q_total = 4.5 × CFM × Δh</li>
          <li>• 1.08 = 0.075 lb/ft³ × 0.24 BTU/lb-°F × 60 min/hr</li>
          <li>• 500 = 8.33 lb/gal × 60 min/hr × 1.0 BTU/lb-°F</li>
        </ul>
      </div>
    </div>
  );
}
