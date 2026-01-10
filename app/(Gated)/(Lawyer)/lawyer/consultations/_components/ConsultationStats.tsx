import { StatCard, StatCardSkeleton } from '@/components/StatCard'
import { useAppSelector } from '@/store/store'
import { BarChart3, CalendarIcon, CheckCircle2, Clock } from 'lucide-react'
import React from 'react'

const ConsultationStats = () => {

    const { loading, consultationStats } = useAppSelector(state => state.consultation);

    const statsCards = [
        {
            id: 'total',
            title: 'Total Requests',
            value: consultationStats.total,
            icon: BarChart3,
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary-600 dark:text-primary-500'
        },
        {
            id: 'pending',
            title: 'Pending Review',
            value: consultationStats.pending,
            icon: Clock,
            iconBg: 'bg-yellow-500/10',
            iconColor: 'text-yellow-600 dark:text-yellow-500'
        },
        {
            id: 'scheduled',
            title: 'Scheduled',
            value: consultationStats.scheduled,
            icon: CalendarIcon,
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-600 dark:text-blue-500'
        },
        {
            id: 'completed',
            title: 'Completed',
            value: consultationStats.completed,
            icon: CheckCircle2,
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-600 dark:text-green-500'
        }
    ];


    return (
        <div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat) => (
                        <StatCard
                            key={stat.id}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            iconBg={stat.iconBg}
                            iconColor={stat.iconColor}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ConsultationStats