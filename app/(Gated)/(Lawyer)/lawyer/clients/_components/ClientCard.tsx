import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Gavel, Calendar, Building2, Eye, FolderOpen } from 'lucide-react';
import { Client } from './ClientsTable';

interface ClientCardProps {
  client: Client;
  onAction: (action: string, client: Client) => void;
  view?: 'grid' | 'list';
}

const ClientCard = ({ client, onAction, view = 'grid' }: ClientCardProps) => {
  if (view === 'list') {
    // ...list view unchanged...
    return (
      <Card className="shadow-sm !border-border rounded-xl overflow-hidden flex flex-col md:flex-row items-center md:items-stretch">
        <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground truncate">{client.name}</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{client.court}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5 ml-2 whitespace-nowrap">{client.status}</Badge>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 p-4 bg-muted/50 border-t md:border-t-0 md:border-l !border-border">
          <Button variant="ghost" size="icon" onClick={() => onAction('viewProfile', client)} aria-label="View Profile"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onAction('viewCase', client)} aria-label="View Case File"><FolderOpen className="w-4 h-4" /></Button>
        </div>
      </Card>
    );
  }
  // Grid view: premium, visually balanced
  return (
    <Card className="flex flex-col justify-between h-full min-h-[340px] shadow-sm !border-border rounded-xl overflow-hidden transition-all">
      <CardContent className="flex flex-col items-center gap-4 pt-8 pb-4 px-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground text-center">{client.name}</div>
          <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5 mt-1">{client.status}</Badge>
        </div>
        {/* Info */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{client.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{client.phone}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Gavel className="w-4 h-4" />{client.caseType}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{client.caseDate}</span>
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{client.court}</span>
          </div>
        </div>
      </CardContent>
      <div className="border-t !border-border w-full" />
      <CardFooter className="flex flex-row flex-wrap justify-center gap-2 bg-muted/50 p-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => onAction('viewProfile', client)}>
          <Eye className="w-4 h-4" /> View Profile
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => onAction('viewCase', client)}>
          <FolderOpen className="w-4 h-4" /> View Case File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard; 
