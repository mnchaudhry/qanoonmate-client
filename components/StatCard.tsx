import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconBg = 'bg-primary/10', iconColor = 'text-primary-600 dark:text-primary-500', className }) => {
    return (
        <Card className={cn("p-4 border-border", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground font-medium">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                        {value}
                    </p>
                </div>
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBg)}>
                    <Icon className={cn("h-6 w-6", iconColor)} />
                </div>
            </div>
        </Card>
    );
};

interface StatCardSkeletonProps {
    className?: string;
}

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({ className }) => {
    return (
        <Card className={cn("p-4 border-border", className)}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
                </div>
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            </div>
        </Card>
    );
};

interface StatCardEnhancedProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: string;
    icon: LucideIcon;
    trendIcon?: LucideIcon;
    iconColor?: string;
    className?: string;
}

export const StatCardEnhanced: React.FC<StatCardEnhancedProps> = ({
    title,
    value,
    description,
    trend,
    icon: Icon,
    trendIcon: TrendIcon,
    iconColor = 'text-primary',
    className
}) => {
    return (
        <Card className={cn("border-border hover:shadow-md transition-shadow", className)}>
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <div className="flex items-center mt-2">
                        {TrendIcon && <TrendIcon className="h-3 w-3 text-primary mr-1" />}
                        <span className="text-xs text-primary">{trend}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};