import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagesHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ searchQuery, onSearchChange, }) => {


    return (
        <div className="w-full space-y-3">

            <div className="flex items-center justify-between w-full ">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                </div>
                <Button size='icon' variant='ghost' className="rounded-full">
                    <Filter className="w-5 h-5" />
                </Button>
            </div>

        </div>
    );
};

export default MessagesHeader;
