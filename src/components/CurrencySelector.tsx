import { useCurrency } from '../hooks/useCurrency';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const currencies = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'JPY', 'AUD', 'CAD'];
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm inline-flex">
      <label className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Currency:</label>
      <select 
        value={currency} 
        onChange={(e) => setCurrency(e.target.value)}
        className="px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
      >
        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
