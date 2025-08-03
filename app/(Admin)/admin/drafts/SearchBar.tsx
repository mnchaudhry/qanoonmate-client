import React from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search drafts..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
      />
    </div>
  )
}

export default SearchBar
