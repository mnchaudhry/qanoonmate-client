import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, LineChart, AreaChart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartTypes = [
  { value: 'line', icon: <LineChart className="w-5 h-5" /> },
  { value: 'bar', icon: <BarChart2 className="w-5 h-5" /> },
  { value: 'area', icon: <AreaChart className="w-5 h-5" /> },
];

const labels = [
  '2025-07-01', '2025-07-05', '2025-07-10', '2025-07-15', '2025-07-20', '2025-07-25', '2025-07-30'
];
const data = [5000, 12000, 8000, 15000, 7000, 11000, 14000];

const chartData = {
  labels,
  datasets: [
    {
      label: 'Earnings (Rs.)',
      data,
      borderColor: 'rgb(34,197,94)', // theme primary
      backgroundColor: 'rgba(34,197,94,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(34,197,94)',
      pointBorderColor: '#fff',
      barPercentage: 0.6,
      categoryPercentage: 0.5,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
  },
};

export default function EarningsChart() {
  const [type, setType] = useState('line');

  return (
    <div className="relative w-full">
      {/* Chart type buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {chartTypes.map((ct) => (
          <Button
            key={ct.value}
            variant={type === ct.value ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onClick={() => setType(ct.value)}
            aria-label={ct.value + ' chart'}
          >
            {ct.icon}
          </Button>
        ))}
      </div>
      <div className="w-full h-56 flex items-center justify-center text-muted-foreground bg-background rounded-lg border border-dashed !border-border">
        <div className="w-full h-full">
          {type === 'line' && <Line data={chartData} options={options} />}
          {type === 'bar' && <Bar data={chartData} options={options} />}
          {type === 'area' && <Line data={{
            ...chartData,
            datasets: [{ ...chartData.datasets[0], fill: true, backgroundColor: 'rgba(34,197,94,0.15)' }],
          }} options={options} />}
        </div>
      </div>
    </div>
  );
} 