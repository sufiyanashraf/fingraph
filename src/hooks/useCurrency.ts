import { useState, useEffect } from 'react';

export function useCurrency() {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('app_currency') || 'USD';
  });

  const setCurrency = (c: string) => {
    localStorage.setItem('app_currency', c);
    setCurrencyState(c);
    window.dispatchEvent(new Event('currency_changed'));
  };

  useEffect(() => {
    const handleStorage = () => {
      setCurrencyState(localStorage.getItem('app_currency') || 'USD');
    };
    window.addEventListener('currency_changed', handleStorage);
    return () => window.removeEventListener('currency_changed', handleStorage);
  }, []);

  return { currency, setCurrency };
}
