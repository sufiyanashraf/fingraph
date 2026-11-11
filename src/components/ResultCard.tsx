

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type?: 'default' | 'success' | 'warning' | 'danger';
}

export default function ResultCard({ title, value, subtitle, type = 'default' }: ResultCardProps) {
  const colorMap = {
    default: 'text-gray-900 dark:text-white',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className={`text-2xl md:text-3xl font-bold truncate ${colorMap[type]}`} title={value.toString()}>
        {value}
      </div>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate" title={subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
