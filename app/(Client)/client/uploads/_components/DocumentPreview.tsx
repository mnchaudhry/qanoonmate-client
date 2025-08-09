"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, HardDrive, Eye, Edit, Trash2, Download } from 'lucide-react'
import { format } from 'date-fns'
import type { Document } from '@/store/types/api';
import { DocumentVisibility } from '@/store/types/api';
import { formatFileType } from '@/lib/utils';

interface DocumentPreviewProps {
  document: Document | null;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onEdit, onDelete, loading, error }) => {
  

  /////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////   
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

  /////////////////////////////////////////////////////// RENDERING ///////////////////////////////////////////////////////   
  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Loading document...
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64 text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }
  if (!document) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No document selected</h3>
            <p className="text-muted-foreground">
              Select a document from the list to view details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////   
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Document Details Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {document.title}
            </h3>
            <Badge className="text-xs">
              {formatFileType(document.fileType) || 'FILE'}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">File Name:</span>
                <span className="text-sm font-medium text-foreground">
                  {document.fileName}
                </span>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Uploaded On:</span>
                <span className="text-sm font-medium text-foreground">
                  {document.createdAt ? format(new Date(document.createdAt), 'yyyy-MM-dd') : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="text-sm font-medium text-foreground">
                  {document.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Visibility:</span>
                <span className="text-sm font-medium text-foreground">
                  {getVisibilityIcon(document.access?.visibility)} {getVisibilityText(document.access?.visibility)}
                </span>
              </div>
            </div>
          </div>
          {document.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Description:</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground">
                  {document.description}
                </p>
              </div>
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
        <div className="flex items-center gap-2 pt-4 border-t !border-border">
          <span className="text-sm text-muted-foreground">Actions:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(document)}
              className="text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(document._id)}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
            {document.fileUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
