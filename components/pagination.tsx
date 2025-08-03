import React from "react";
import { cn } from "@/lib/utils"; // Utility for conditionally applying classes
import { ChevronRight } from "lucide-react"; // Arrow icon for next button

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                            "w-14 h-14 flex items-center justify-center border rounded-[4px] text-lg font-semibold transition-all",
                            pageNum === page
                                ? "border-black text-black font-bold border-2"
                                : "border-muted-gray text-muted-gray hover:border-black hover:text-black"
                        )}
                    >
                        {pageNum}
                    </button>
                );
            })}
            <button
                onClick={() => page < totalPages && onPageChange(page + 1)}
                disabled={page >= totalPages}
                className={cn(
                    "w-14 h-14 flex items-center justify-center border rounded-[4px] transition-all",
                    page < totalPages
                        ? "border-border text-black hover:border-black"
                        : "border-muted-gray text-muted-gray cursor-not-allowed"
                )}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
