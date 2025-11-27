import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  File,
  Folder,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Share,
  ArrowUpDown,
  Edit,
} from "lucide-react";
import { FileItem } from "../page";

interface FileListViewProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile: FileItem | null;
  sortBy: "name" | "modified" | "size" | "type";
  sortOrder: "asc" | "desc";
  onSort: (field: "name" | "modified" | "size" | "type") => void;
  formatFileSize: (bytes: number) => string;
  onDelete?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  selectedFiles?: Set<string>;
  onSelectFile?: (fileId: string) => void;
  onSelectAll?: () => void;
  onEditMetadata?: (file: FileItem) => void;
}

const FileListView: React.FC<FileListViewProps> = ({
  files,
  onFileSelect,
  selectedFile,
  onSort,
  formatFileSize,
  onDelete,
  onDownload,
  onShare,
  selectedFiles = new Set(),
  onSelectFile,
  onSelectAll,
  onEditMetadata,
}) => {
  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return <Folder className="w-5 h-5 text-primary" />;
    }

    switch (file.fileType) {
      case "pdf":
        return <File className="w-5 h-5 text-destructive" />;
      case "docx":
        return <File className="w-5 h-5 text-primary" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-5 h-5 text-accent-foreground" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getOwnershipBadge = (uploadedBy: string) => {
    switch (uploadedBy) {
      case "client":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-accent text-accent-foreground"
          >
            client
          </Badge>
        );
      case "lawyer":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-primary text-primary-foreground"
          >
            lawyer
          </Badge>
        );
      case "private":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-muted text-muted-foreground"
          >
            private
          </Badge>
        );
      default:
        return null;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "client":
        return (
          <Badge variant="outline" className="text-xs">
            Client Shared
          </Badge>
        );
      case "lawyer":
        return (
          <Badge variant="outline" className="text-xs">
            Lawyer Only
          </Badge>
        );
      case "private":
        return (
          <Badge variant="outline" className="text-xs">
            Private
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case "open":
        onFileSelect(file);
        break;
      case "download":
        if (onDownload) {
          onDownload(file);
        }
        break;
      case "share":
        if (onShare) {
          onShare(file);
        }
        break;
      case "delete":
        if (onDelete) {
          onDelete(file);
        }
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="border !border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectFile && (
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedFiles.size === files.length && files.length > 0
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("name")}
                className="h-auto p-0 font-medium"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("type")}
                className="h-auto p-0 font-medium"
              >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("modified")}
                className="h-auto p-0 font-medium"
              >
                Last Modified
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("size")}
                className="h-auto p-0 font-medium"
              >
                Size
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              className={`cursor-pointer hover:bg-muted/50 ${
                selectedFile?.id === file.id
                  ? "bg-primary/5"
                  : selectedFiles.has(file.id)
                  ? "bg-muted/30"
                  : ""
              }`}
              onClick={() => onFileSelect(file)}
            >
              {onSelectFile && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedFiles.has(file.id)}
                    onCheckedChange={() => onSelectFile(file.id)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {file.type === "file"
                        ? file.fileType?.toUpperCase()
                        : "Folder"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getOwnershipBadge(file.uploadedBy)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDate(file.modifiedAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {file.type === "file" && file.size
                    ? formatFileSize(file.size)
                    : "-"}
                </div>
              </TableCell>
              <TableCell>{getVisibilityBadge(file.visibility)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction("open", file);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction("download", file);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleFileAction("open", file)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFileAction("download", file)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      {file.type === "file" && onEditMetadata && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditMetadata(file);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Metadata
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleFileAction("share", file)}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFileAction("delete", file)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileListView;
