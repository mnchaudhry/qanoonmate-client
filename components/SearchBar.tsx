import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import React, { ChangeEvent } from 'react'

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    className?: string;
    containerClassName?: string;
    placeholder?: string;
}

const SearchBar = ({ value, onChange, onBlur, className, containerClassName, placeholder }: Props) => {

    return (
        <div className={cn("mb-10 max-w-2xl mx-auto flex justify-center relative", containerClassName)}>
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                className={cn("w-full px-4 py-2.5 pr-10 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition", className)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search size={24} />
            </span>
        </div>
    )
}

export default SearchBar