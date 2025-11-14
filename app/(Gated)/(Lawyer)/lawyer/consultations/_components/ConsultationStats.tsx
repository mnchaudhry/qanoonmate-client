import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/store/store'
import { BarChart3, CalendarIcon, CheckCircle2, Clock, DollarSign, TrendingUp, Users } from 'lucide-react'
import React from 'react'

const ConsultationStats = () => {

    const { loading, consultationStats } = useAppSelector(state => state.consultation);

    const statsCards = [
        {
            id: 'total',
            title: 'Total Requests',
            value: consultationStats.total,
            description: 'All consultations',
            icon: BarChart3,
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            descriptionIcon: Users,
            descriptionColor: 'text-muted-foreground'
        },
        {
            id: 'pending',
            title: 'Pending Review',
            value: consultationStats.pending,
            description: consultationStats.pending > 0 ? 'Needs attention' : 'All reviewed',
            icon: Clock,
            iconBg: 'bg-yellow-500/10',
            iconColor: 'text-yellow-600 dark:text-yellow-500',
            descriptionColor: consultationStats.pending > 0 ? 'text-yellow-600 dark:text-yellow-500 font-medium' : 'text-muted-foreground'
        },
        {
            id: 'scheduled',
            title: 'Scheduled',
            value: consultationStats.scheduled,
            description: `${consultationStats.scheduled} today`,
            icon: CalendarIcon,
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-600 dark:text-blue-500',
            descriptionIcon: TrendingUp,
            descriptionColor: 'text-muted-foreground'
        },
        {
            id: 'completed',
            title: 'Completed',
            value: consultationStats.completed,
            description: `PKR ${consultationStats.completed.toLocaleString()}`,
            icon: CheckCircle2,
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-600 dark:text-green-500',
            descriptionIcon: DollarSign,
            descriptionColor: 'text-green-600 dark:text-green-500 font-medium'
        }
    ];


    return (
        <div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-border bg-surface">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat: any) => (
                        <Card key={stat.id} className="">
                            <CardHeader className="py-2">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {stat.title}
                                    </CardDescription>
                                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-colors", stat.iconBg)}>
                                        <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                    <div className={cn("flex items-center gap-1.5 text-xs", stat.descriptionColor)}>
                                        {stat.descriptionIcon && <stat.descriptionIcon className="h-3.5 w-3.5" />}
                                        <span className="font-medium">{stat.description}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ConsultationStats