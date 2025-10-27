"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Gavel, Calendar, Building2, Eye, FolderOpen, MessageSquare } from 'lucide-react';
import { Client } from './ClientsTable';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onAction: (action: string, client: Client) => void;
  view?: 'grid' | 'list';
}

const ClientCard = ({ client, onAction, view = 'grid' }: ClientCardProps) => {
  const getInitials = () => {
    if (client.firstname && client.lastname) {
      return `${client.firstname[0]}${client.lastname[0]}`.toUpperCase();
    }
    const nameParts = client.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return client.name.substring(0, 2).toUpperCase();
  };

  if (view === 'list') {
    return (
      <Card className="shadow-sm border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          {/* Left: Client Info */}
          <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={client.profilePicture} alt={client.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-lg truncate">{client.name}</div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {client.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {client.city}
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 whitespace-nowrap font-medium",
                client.status === 'Active' 
                  ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950"
                  : "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950"
              )}
            >
              {client.status}
            </Badge>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 p-4 bg-muted/30 border-t md:border-t-0 md:border-l border-border w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('viewProfile', client)}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
              Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('viewCase', client)}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Case File
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('message', client)}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view: premium, visually balanced
  return (
    <Card className="flex flex-col justify-between h-full shadow-sm border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/20">
      <CardContent className="flex flex-col items-center gap-4 pt-8 pb-4 px-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20 border-4 border-primary/10">
            <AvatarImage src={client.profilePicture} alt={client.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold text-foreground text-center">{client.name}</div>
          <Badge 
            variant="outline" 
            className={cn(
              "font-medium",
              client.status === 'Active' 
                ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950"
                : "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950"
            )}
          >
            {client.status}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{client.city}</span>
          </div>
        </div>

        {/* Case Info */}
        <div className="w-full pt-3 border-t border-border">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Gavel className="w-3.5 h-3.5" />
              <span>{client.caseType}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{client.court}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{client.caseDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="border-t border-border w-full" />

      <CardFooter className="flex flex-col gap-2 bg-muted/30 p-4">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors" 
            onClick={() => onAction('viewProfile', client)}
          >
            <Eye className="w-4 h-4" />
            Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors" 
            onClick={() => onAction('viewCase', client)}
          >
            <FolderOpen className="w-4 h-4" />
            Case
          </Button>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full gap-2" 
          onClick={() => onAction('message', client)}
        >
          <MessageSquare className="w-4 h-4" />
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard; 
