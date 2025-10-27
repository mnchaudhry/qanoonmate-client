import React from "react";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessagesHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ searchQuery, onSearchChange, }) => {


    return (
        <div className="w-full space-y-4 px-3 py-4 border-b !border-border bg-surface/30">

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
                    <p className="text-xs text-muted-foreground">Secure legal consultations</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-4 h-10 bg-background border-border"
                />
            </div>

        </div>
    );
};

export default MessagesHeader;
