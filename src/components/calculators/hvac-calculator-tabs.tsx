'use client';

import React, { useState } from 'react';
import { LoadCalculator } from './load-calculator';
import { CFMCalculator } from './cfm-calculator';
import { HydronicCalculator } from './hydronic-calculator';
import { CompleteHVACCalculator } from './complete-hvac-calculator';
import { ConduitFillCalculator } from './conduit-fill-calculator';
import { PipeSizingCalculator } from './pipe-sizing-calculator';
import { DuctPressureDropCalculator } from './duct-pressure-calculator';
import { FanLawsCalculator } from './fan-laws-calculator';
import { PumpLawsCalculator } from './pump-laws-calculator';

type CalculatorTab = 'complete' | 'load' | 'cfm' | 'hydronic' | 'conduit' | 'pipe' | 'duct' | 'fan' | 'pump';

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
    { id: 'load', label: 'Load' },
    { id: 'cfm', label: 'CFM' },
    { id: 'hydronic', label: 'Hydronic' },
    { id: 'conduit', label: 'Conduit Fill' },
    { id: 'pipe', label: 'Pipe Sizing' },
    { id: 'duct', label: 'Duct Pressure' },
    { id: 'fan', label: 'Fan Laws' },
    { id: 'pump', label: 'Pump Laws' },
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

        {activeTab === 'conduit' && (
          <div id="panel-conduit" role="tabpanel" aria-labelledby="conduit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              NEC Conduit Fill Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate conduit fill percentage per NEC Chapter 9. Determine maximum conductors allowed
              and verify compliance with NEC fill limits (53% for 1 wire, 31% for 2 wires, 40% for 3+ wires).
            </p>
            <ConduitFillCalculator />
          </div>
        )}

        {activeTab === 'pipe' && (
          <div id="panel-pipe" role="tabpanel" aria-labelledby="pipe">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pipe Sizing Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate velocity, Reynolds number, and pressure drop for water/glycol piping systems.
              Uses Darcy-Weisbach equation with Swamee-Jain friction factor. Includes ASHRAE velocity recommendations.
            </p>
            <PipeSizingCalculator />
          </div>
        )}

        {activeTab === 'duct' && (
          <div id="panel-duct" role="tabpanel" aria-labelledby="duct">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Duct Pressure Drop Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Calculate air velocity, velocity pressure, and friction rate for circular or rectangular ducts.
              Includes equivalent diameter calculation for rectangular ducts using Huebscher equation.
            </p>
            <DuctPressureDropCalculator />
          </div>
        )}

        {activeTab === 'fan' && (
          <div id="panel-fan" role="tabpanel" aria-labelledby="fan">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Fan Laws Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apply fan affinity laws to predict performance at new speeds or impeller diameters.
              Includes density correction for elevation and temperature.
            </p>
            <FanLawsCalculator />
          </div>
        )}

        {activeTab === 'pump' && (
          <div id="panel-pump" role="tabpanel" aria-labelledby="pump">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pump Laws Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apply pump affinity laws to predict performance at new speeds.
              Includes hydraulic power, brake horsepower, specific speed, and pump type classification.
            </p>
            <PumpLawsCalculator />
          </div>
        )}
      </div>

      {/* Reference Section */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Formula Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">HVAC</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Load: Q = 1.08 × CFM × ΔT</li>
              <li>• CFM: CFM = Q / (1.08 × ΔT)</li>
              <li>• GPM: GPM = Q / (500 × ΔT)</li>
              <li>• Total Cooling: Q = 4.5 × CFM × Δh</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Electrical (NEC)</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Fill: Σ(A_wire × n) / A_conduit</li>
              <li>• 1 wire: 53%, 2 wires: 31%, 3+: 40%</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Piping</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Velocity: V = 0.4085 × Q / D²</li>
              <li>• Re: Re = 3162 × Q × ρ / (μ × D)</li>
              <li>• ΔP: ΔP = f × (L/D) × (ρV²/2)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Ductwork</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Velocity: V = Q / A</li>
              <li>• Pv: Pv = (V/4005)²</li>
              <li>• Eq. Ø: De = 1.3 × (W×H)^0.625 / (W+H)^0.25</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Fan Laws</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Q₂/Q₁ = N₂/N₁</li>
              <li>• P₂/P₁ = (N₂/N₁)²</li>
              <li>• HP₂/HP₁ = (N₂/N₁)³</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Pump Laws</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• Q₂/Q₁ = N₂/N₁</li>
              <li>• H₂/H₁ = (N₂/N₁)²</li>
              <li>• P₂/P₁ = (N₂/N₁)³ × ρ₂/ρ₁</li>
              <li>• Ns = N × √Q / H^0.75</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
