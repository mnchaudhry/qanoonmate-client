import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { File, Folder, MoreVertical, Download, Eye, Trash2, Share } from 'lucide-react';
import { FileItem } from '../page';

interface FileGridViewProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile: FileItem | null;
  formatFileSize: (bytes: number) => string;
  onDelete?: (file: FileItem) => void;
}

const FileGridView: React.FC<FileGridViewProps> = ({ files, onFileSelect, selectedFile, formatFileSize, onDelete, }) => {

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-12 h-12 text-primary" />;
    }

    switch (file.fileType) {
      case 'pdf':
        return <File className="w-12 h-12 text-destructive" />;
      case 'docx':
        return <File className="w-12 h-12 text-primary" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="w-12 h-12 text-accent-foreground" />;
      default:
        return <File className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const getOwnershipBadge = (uploadedBy: string) => {
    switch (uploadedBy) {
      case 'client':
        return <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">client</Badge>;
      case 'lawyer':
        return <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">lawyer</Badge>;
      case 'private':
        return <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">private</Badge>;
      default:
        return null;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'client':
        return <Badge variant="outline" className="text-xs">Client Shared</Badge>;
      case 'lawyer':
        return <Badge variant="outline" className="text-xs">Lawyer Only</Badge>;
      case 'private':
        return <Badge variant="outline" className="text-xs">Private</Badge>;
      default:
        return null;
    }
  };

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case 'open':
        onFileSelect(file);
        break;
      case 'download':
        console.log('Download file:', file.name);
        break;
      case 'share':
        console.log('Share file:', file.name);
        break;
      case 'delete':
        if (onDelete) {
          onDelete(file);
        }
        break;
    }
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {files.map(file => (
        <Card
          key={file.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg group border-2 ${selectedFile?.id === file.id
            ? 'border-primary shadow-lg'
            : 'border-border hover:border-primary/50'
            }`}
          onClick={() => onFileSelect(file)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* File Icon */}
              <div className="flex items-center justify-center w-16 h-16 mb-2">
                {getFileIcon(file)}
              </div>

              {/* File Name */}
              <div className="w-full space-y-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">{file.name}</h3>
                {file.type === 'file' && file.size && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 justify-center">
                {getOwnershipBadge(file.uploadedBy)}
                {getVisibilityBadge(file.visibility)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('open', file);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('download', file);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleFileAction('open', file)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFileAction('download', file)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFileAction('share', file)}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFileAction('delete', file)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FileGridView; 