import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Total Earnings',
    value: 'Rs. 85,000',
    icon: DollarSign,
    iconColor: 'text-primary',
  },
  {
    label: 'Completed Consultations',
    value: '32',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Pending Withdrawals',
    value: 'Rs. 5,000',
    icon: Clock,
    iconColor: 'text-yellow-600',
  },
  {
    label: 'Avg. Session Value',
    value: 'Rs. 2,300',
    icon: TrendingUp,
    iconColor: 'text-blue-600',
  },
];

export default function EarningsStatsStrip() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-[600px] md:min-w-0 md:grid md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex-1 min-w-[220px] border-border shadow-none hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-3 py-4 px-5">
              <div className={`rounded-lg bg-primary/10 p-2 ${stat.iconColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 