import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
    return (
        <div className="sticky top-24 w-full mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search legal terms..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
        </div>
    )
}

export default SearchBar
