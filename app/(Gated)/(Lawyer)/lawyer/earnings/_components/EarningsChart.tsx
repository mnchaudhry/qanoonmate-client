import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, LineChart, AreaChart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
// import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartTypes = [
  { value: 'line', icon: <LineChart className="w-5 h-5" /> },
  { value: 'bar', icon: <BarChart2 className="w-5 h-5" /> },
  { value: 'area', icon: <AreaChart className="w-5 h-5" /> },
];

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
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Chart component temporarily disabled</p>
        </div>
      </div>
    </div>
  );
} 