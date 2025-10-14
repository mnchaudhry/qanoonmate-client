import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Search, Loader2 } from 'lucide-react';
import ViewToggle from '@/components/ViewToggle';

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

      <div className="flex ">
        <div className="flex items-center gap-3">
          <Button onClick={onNewFolder} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={onUpload} size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          {uploadLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading {uploadProgress}%</span>
            </div>
          )}

          <ViewToggle view={view} onViewChange={onViewChange} />

        </div>
      </div>

    </div>
  );
};

export default FileManagerHeader; 