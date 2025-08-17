"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, HardDrive, Eye, FileText, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import type { Document } from '@/store/types/api';
import { DocumentVisibility } from '@/store/types/api';

interface DocumentsListProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  loading?: boolean;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
  loading
}) => {
  const getVisibilityIcon = (visibility?: DocumentVisibility) => {
    switch (visibility) {
      case DocumentVisibility.PUBLIC:
        return '🌐';
      case DocumentVisibility.SHARED:
        return '👁️';
      case DocumentVisibility.PRIVATE:
      default:
        return '🔒';
    }
  };

  const getVisibilityText = (visibility?: DocumentVisibility) => {
    switch (visibility) {
      case DocumentVisibility.PUBLIC:
        return 'Public';
      case DocumentVisibility.SHARED:
        return 'Shared';
      case DocumentVisibility.PRIVATE:
      default:
        return 'Private';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">Loading documents...</CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Upload your first document to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-primary" />
          Uploaded Files
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {documents.map((document) => (
            <div
              key={document._id}
              className={`p-4 border-b !border-border cursor-pointer transition-colors hover:bg-accent/50 ${selectedDocument?._id === document._id ? 'bg-primary/10 border-primary/20' : ''
                }`}
              onClick={() => onSelectDocument(document)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {document.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {document.fileName}
                      </p>
                    </div>
                  </div>
                  <Badge className="text-xs">
                    {document.fileType?.toUpperCase() || 'FILE'}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Uploaded: {document.createdAt ? format(new Date(document.createdAt), 'yyyy-MM-dd') : '-'}
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    Size: {document.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : '-'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {getVisibilityIcon(document.access?.visibility)} Visibility: {getVisibilityText(document.access?.visibility)}
                  </div>
                </div>
                {document.description && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Description:</p>
                    <p className="text-xs text-foreground">- {document.description}</p>
                  </div>
                )}
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {document.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
