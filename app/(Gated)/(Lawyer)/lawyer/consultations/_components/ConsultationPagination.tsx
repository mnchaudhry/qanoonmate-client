import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';

interface ConsultationPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ConsultationPagination: React.FC<ConsultationPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    return (
        <Card className="border-border bg-surface">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
                        <span className="font-semibold text-foreground">{totalPages}</span>
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ConsultationPagination;
