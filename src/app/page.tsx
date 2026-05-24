import { HVACCalculatorTabs } from '@/components/calculators/hvac-calculator-tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            HVAC Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional HVAC calculation tools for heating, cooling, and airflow calculations.
            Based on industry-standard formulas used by HVAC engineers.
          </p>
        </div>

        {/* Main Calculator */}
        <HVACCalculatorTabs />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All calculations follow ASHRAE guidelines and standard HVAC engineering practices.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            For estimation purposes only. Consult a licensed HVAC professional for final system design.
          </p>
        </div>
      </div>
    </div>
  );
}
