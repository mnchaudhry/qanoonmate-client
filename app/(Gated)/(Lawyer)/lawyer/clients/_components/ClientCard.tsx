"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Mail, Phone, MapPin, Gavel, Calendar, Building2, Eye, FolderOpen, MessageSquare, MoreVertical, UserMinus, FileText } from 'lucide-react';
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
      <Card className="shadow-sm border-border rounded-lg overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          {/* Left: Client Info */}
          <div className="flex items-center gap-3 p-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border-2 border-primary/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all flex-shrink-0">
              <AvatarImage src={client.profilePicture} alt={client.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors">{client.name}</div>
              <div className="flex flex-wrap gap-2.5 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{client.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {client.city}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "ml-2 whitespace-nowrap font-medium text-xs px-2 py-0.5 flex-shrink-0",
                client.status === 'Active'
                  ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950"
                  : "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950"
              )}
            >
              {client.status}
            </Badge>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-surface/30 border-t md:border-t-0 md:border-l border-border w-full md:w-auto">
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
              onClick={() => onAction('message', client)}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onAction('viewCase', client)}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View Case File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('viewDocuments', client)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction('remove', client)}
                  className="text-destructive focus:text-destructive"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Remove Client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view: premium, visually balanced
  return (
    <Card className="flex flex-col justify-between h-full shadow-sm border-border rounded-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-primary/30 group">
      <CardContent className="flex flex-col items-center gap-3 pt-5 pb-3 px-4 relative">
        {/* Quick Actions Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-primary/10">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction('viewProfile', client)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('viewCase', client)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                View Case File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('viewDocuments', client)}>
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onAction('remove', client)}
                className="text-destructive focus:text-destructive"
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Remove Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16 border-3 border-primary/10 ring-4 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage src={client.profilePicture} alt={client.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-base font-bold text-foreground text-center group-hover:text-primary transition-colors leading-tight">{client.name}</div>
          <Badge
            variant="outline"
            className={cn(
              "font-medium text-xs px-2 py-0.5",
              client.status === 'Active'
                ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950"
                : "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950"
            )}
          >
            {client.status}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{client.city}</span>
          </div>
        </div>

        {/* Case Info */}
        <div className="w-full pt-2 border-t border-border">
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1.5">
              <Gavel className="w-3 h-3" />
              <span className="truncate">{client.caseType}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{client.court}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>{client.caseDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="border-t border-border w-full" />

      <CardFooter className="flex flex-col gap-1.5 bg-surface/30 p-3">
        <div className="flex gap-1.5 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onAction('viewProfile', client)}
          >
            <Eye className="w-3.5 h-3.5" />
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onAction('viewCase', client)}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Case
          </Button>
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full gap-1.5 text-xs h-8"
          onClick={() => onAction('message', client)}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard; 
