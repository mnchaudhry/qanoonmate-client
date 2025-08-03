import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }: { search: string; setSearch: (value: string) => void; }) {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search drafts..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
      />
    </div>
  );
}
