import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

interface ChartProps {
  x: number[] | string[];
  yData: { name: string; y: number[]; color?: string; type?: 'bar' | 'scatter'; fill?: string }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisRange?: [number, number];
  yAxisRange?: [number, number];
}

export default function GrowthChart({ x, yData, title, xAxisLabel = 'Time', yAxisLabel = 'Value', xAxisRange, yAxisRange }: ChartProps) {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const layout: any = {
    title: title ? { text: title, font: { color: isDark ? '#fff' : '#000' } } : undefined,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    xaxis: {
      title: { text: xAxisLabel, font: { color: isDark ? '#9ca3af' : '#4b5563' } },
      tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
      gridcolor: isDark ? '#374151' : '#e5e7eb',
      range: xAxisRange,
    },
    yaxis: {
      title: { text: yAxisLabel, font: { color: isDark ? '#9ca3af' : '#4b5563' } },
      tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
      gridcolor: isDark ? '#374151' : '#e5e7eb',
      range: yAxisRange,
    },
    legend: {
      font: { color: isDark ? '#e5e7eb' : '#111827' },
      orientation: 'h',
      y: -0.2,
    },
    margin: { t: 40, l: 60, r: 20, b: 60 },
    autosize: true,
  };

  const data: any[] = yData.map((series) => ({
    x,
    y: series.y,
    name: series.name,
    type: series.type || 'scatter',
    mode: series.type === 'bar' ? undefined : 'lines+markers',
    marker: series.color ? { color: series.color } : undefined,
    fill: series.fill as any,
    hovertemplate: `%{y:$,.0f}<extra></extra>`,
  }));

  return (
    <div className="w-full h-96">
      <Plot
        data={data as any}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false, responsive: true }}
      />
    </div>
  );
}
