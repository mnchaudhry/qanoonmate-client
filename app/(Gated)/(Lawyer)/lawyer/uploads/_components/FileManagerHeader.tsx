import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Upload, Grid3X3, List, Search, Loader2 } from 'lucide-react';

interface FileManagerHeaderProps {
  onNewFolder: () => void;
  onUpload: () => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  search: string;
  onSearch: (query: string) => void;
  uploadLoading?: boolean;
  uploadProgress?: number;
}

const FileManagerHeader: React.FC<FileManagerHeaderProps> = ({ onNewFolder, onUpload, view, onViewChange, search, onSearch, uploadLoading = false, uploadProgress = 0, }) => {

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left side - Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={onNewFolder} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
        <Button onClick={onUpload} size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side - View toggle and upload status */}
      <div className="flex items-center gap-3">
        {uploadLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading {uploadProgress}%</span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {view === 'grid' ? (
                <Grid3X3 className="w-4 h-4 mr-2" />
              ) : (
                <List className="w-4 h-4 mr-2" />
              )}
              View: {view === 'grid' ? 'Grid' : 'List'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('grid')}>
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('list')}>
              <List className="w-4 h-4 mr-2" />
              List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FileManagerHeader; 