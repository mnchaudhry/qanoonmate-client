import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileItem } from '../page';

interface FileTreeProps {
  files: FileItem[];
  currentPath: string[];
  onPathChange: (path: string[]) => void;
  loading?: boolean;
}

const FileTree: React.FC<FileTreeProps> = ({ files, currentPath, onPathChange, loading = false }) => {

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-5 h-5 text-primary" />;
    }

    switch (file.fileType) {
      case 'pdf':
        return <File className="w-5 h-5 text-destructive" />;
      case 'docx':
        return <File className="w-5 h-5 text-primary" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="w-5 h-5 text-accent-foreground" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
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

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      const newPath = [...currentPath, file.name];
      onPathChange(newPath);
    }
  };

  const isExpanded = (folderName: string) => {
    return currentPath.includes(folderName);
  };

  const getFolderContents = (folderName: string) => {
    return files.filter(file => {
      const filePathParts = file.path.split('/').filter(Boolean);
      const currentPathParts = currentPath;

      // Check if file is in the specific folder
      if (filePathParts.length === currentPathParts.length + 1) {
        return currentPathParts.every((part, index) => filePathParts[index] === part) &&
          filePathParts[currentPathParts.length] === folderName;
      }

      return false;
    });
  };

  const getRootFolders = () => {
    return files.filter(file => {
      if (file.type !== 'folder') return false;
      const filePathParts = file.path.split('/').filter(Boolean);
      return filePathParts.length === 1 && filePathParts[0] === 'Documents';
    });
  };

  const getCurrentFolderContents = () => {
    if (currentPath.length === 1) return [];

    return files.filter(file => {
      const filePathParts = file.path.split('/').filter(Boolean);
      const currentPathParts = currentPath;

      // Check if file is directly in current folder
      if (filePathParts.length === currentPathParts.length) {
        return filePathParts.every((part, index) => part === currentPathParts[index]);
      }

      return false;
    });
  };

  const rootFolders = getRootFolders();
  const currentFolderContents = getCurrentFolderContents();

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b !border-border">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b !border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Documents</h3>
        <p className="text-sm text-muted-foreground">Browse your files and folders</p>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {/* Root Folders */}
        {rootFolders.map(folder => (
          <div key={folder.id} className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFileClick(folder)}
              className="w-full justify-start h-10 px-3 text-sm hover:bg-muted/50"
            >
              {isExpanded(folder.name) ? (
                <ChevronDown className="w-4 h-4 mr-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-3 text-muted-foreground" />
              )}
              {getFileIcon(folder)}
              <span className="ml-3 flex-1 text-left font-medium">{folder.name}</span>
              {getOwnershipBadge(folder.uploadedBy)}
            </Button>

            {/* Show folder contents if expanded */}
            {isExpanded(folder.name) && (
              <div className="ml-8 space-y-1">
                {getFolderContents(folder.name).map(file => (
                  <div key={file.id} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted/30">
                    {getFileIcon(file)}
                    <span className="flex-1 truncate">{file.name}</span>
                    {getOwnershipBadge(file.uploadedBy)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Current folder files */}
        {currentFolderContents.length > 0 && (
          <div className="space-y-1 mt-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-2">
              Current Folder
            </div>
            {currentFolderContents.map(file => (
              <div key={file.id} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted/30">
                {getFileIcon(file)}
                <span className="flex-1 truncate">{file.name}</span>
                {getOwnershipBadge(file.uploadedBy)}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {rootFolders.length === 0 && currentFolderContents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-sm">
              No folders found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree; 