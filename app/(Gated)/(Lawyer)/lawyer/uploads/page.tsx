"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchDocuments,
  fetchDirectories,
  createDocument,
  deleteDocument,
  updateDocument,
  createDirectory,
  deleteDirectory,
  setCurrentPath,
  setViewMode,
  setSortBy,
  setSortOrder,
  setSearchQuery,
  setSelectedDocument,
  setUploadLoading,
  setUploadProgress,
} from "@/store/reducers/documentSlice";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import FileManagerHeader from "./_components/FileManagerHeader";
import FileTree from "./_components/FileTree";
import FileDetailsPanel from "./_components/FileDetailsPanel";
import FileGridView from "./_components/FileGridView";
import FileListView from "./_components/FileListView";
import UploadZone from "./_components/UploadZone";
import Breadcrumb from "./_components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Document, Directory } from "@/store/types/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Trash2, X } from "lucide-react";

// Transform backend Document to FileItem for UI
const transformDocumentToFileItem = (doc: Document) => ({
  id: doc._id,
  name: doc.title || doc.fileName,
  type: "file" as const,
  fileType: doc.fileType?.split("/")[1] || "unknown",
  size: doc.fileSize,
  uploadedBy: doc.uploadedBy?.role || "lawyer",
  uploadedAt: doc.createdAt,
  modifiedAt: doc.updatedAt,
  path: doc.fileName || "",
  visibility: doc.access?.visibility || "private",
  tags: doc.tags || [],
  notes: doc.description,
  parentId: doc.directoryId || undefined,
  // Backend document properties
  _id: doc._id,
  fileUrl: doc.fileUrl,
  consultationId: doc.consultationId,
  directoryId: doc.directoryId,
  metadata: doc.metadata,
  access: doc.access,
});

// Transform backend Directory to FileItem for UI
const transformDirectoryToFileItem = (dir: Directory) => ({
  id: dir._id,
  name: dir.name,
  type: "folder" as const,
  uploadedBy: dir.ownerRole,
  uploadedAt: dir.createdAt,
  modifiedAt: dir.updatedAt,
  path: dir.name,
  visibility: "private" as const,
  tags: [],
  parentId: dir.parentId || undefined,
  // Backend directory properties
  _id: dir._id,
  ownerId: dir.ownerId,
  ownerRole: dir.ownerRole,
});

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: string;
  modifiedAt: string;
  path: string;
  visibility: string;
  tags: string[];
  notes?: string;
  parentId?: string;
  // Backend properties
  _id?: string;
  fileUrl?: string;
  consultationId?: string;
  directoryId?: string;
  metadata?: any;
  access?: any;
  ownerId?: string;
  ownerRole?: string;
}

const FileManager = () => {
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const {
    documents,
    directories,
    loading,
    directoryLoading,
    uploadLoading,
    uploadProgress,
    currentPath,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
  } = useSelector((state: RootState) => state.document);
  const { user } = useSelector((state: RootState) => state.auth);

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [showDetails, setShowDetails] = useState(false);
  const sidebarOpen = true;
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [currentDirectoryId, setCurrentDirectoryId] = useState<string | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<FileItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    tags: "",
    visibility: "private",
  });

  //////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////////
  useEffect(() => {
    // Fetch documents and directories on mount
    dispatch(
      fetchDocuments({
        limit: 50,
        skip: 0,
        sort:
          sortBy === "name"
            ? "title"
            : sortBy === "modified"
            ? "updatedAt"
            : sortBy === "size"
            ? "fileSize"
            : "createdAt",
      })
    );

    // Fetch directories for current user
    const userId = user ? user._id! : "";
    dispatch(fetchDirectories({ ownerId: userId }));
  }, [dispatch, user, sortBy]);

  //////////////////////////////////////////////// MEMOES //////////////////////////////////////////////////////
  const transformedDocuments = useMemo(() => {
    return documents.map(transformDocumentToFileItem);
  }, [documents]);

  const transformedDirectories = useMemo(() => {
    return directories.map(transformDirectoryToFileItem);
  }, [directories]);

  const allFiles = useMemo(() => {
    return [...transformedDirectories, ...transformedDocuments];
  }, [transformedDirectories, transformedDocuments]);

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = allFiles;

    // Filter by current directory
    filtered = filtered.filter((file) => {
      // If we're at root, show files with no parent or root-level items
      if (!currentDirectoryId) {
        return !file.parentId || file.parentId === "";
      }
      // Otherwise, show files in current directory
      return file.parentId === currentDirectoryId;
    });

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (file.type === "file" &&
            file.notes &&
            file.notes.toLowerCase().includes(query))
      );
    }

    // Sort files
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "modified":
          comparison =
            new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
        case "size":
          const sizeA = a.type === "file" ? a.size || 0 : 0;
          const sizeB = b.type === "file" ? b.size || 0 : 0;
          comparison = sizeA - sizeB;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison =
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [allFiles, searchQuery, sortBy, sortOrder, currentDirectoryId]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const handleFileSelect = (file: FileItem) => {
    if (file.type === "folder") {
      // Navigate to folder
      setCurrentDirectoryId(file.id);
      const newPath = [...currentPath, file.name];
      dispatch(setCurrentPath(newPath));
      setSelectedFile(null);
      setShowDetails(false);
      setSelectedFiles(new Set()); // Clear selections when navigating
    } else {
      // Select file for details
      setSelectedFile(file);
      setShowDetails(true);
      // Set selected document in store
      const document = documents.find((d) => d._id === file._id);
      if (document) {
        dispatch(setSelectedDocument(document));
      }
    }
  };

  const handlePathChange = (newPath: string[]) => {
    dispatch(setCurrentPath(newPath));

    // Navigate to the appropriate directory
    if (newPath.length === 1) {
      // Root directory
      setCurrentDirectoryId(null);
    } else {
      // Find the directory ID for the last path segment
      const targetFolderName = newPath[newPath.length - 1];
      const targetFolder = transformedDirectories.find(
        (d) => d.name === targetFolderName
      );
      if (targetFolder) {
        setCurrentDirectoryId(targetFolder.id);
      }
    }

    setSelectedFile(null);
    setShowDetails(false);
    setSelectedFiles(new Set());
  };

  const handleNewFolder = async () => {
    try {
      const folderName = prompt("Enter folder name:");
      if (!folderName) return;

      const userId = user ? user._id! : "";
      const parentId = currentDirectoryId || null;

      await dispatch(
        createDirectory({
          ownerId: userId,
          ownerRole: "lawyer" as any,
          name: folderName,
          parentId,
        })
      ).unwrap();

      // Refresh directories
      dispatch(fetchDirectories({ ownerId: userId }));
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      dispatch(setUploadLoading(true));
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        dispatch(setUploadProgress(progress));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name.split(".").slice(0, -1).join("."));
        formData.append("description", "Uploaded via file manager");
        formData.append("tags", JSON.stringify(["uploaded", "file-manager"]));
        formData.append("access", JSON.stringify({ visibility: "private" }));

        // Add directory ID if inside a folder
        if (currentDirectoryId) {
          formData.append("directoryId", currentDirectoryId);
          console.log("Uploading to directory:", currentDirectoryId);
        } else {
          console.log("Uploading to root directory");
        }

        try {
          await dispatch(createDocument(formData)).unwrap();
          successCount++;
        } catch (err) {
          console.error("Failed to upload file:", file.name, err);
          failCount++;
        }
      }

      // Show summary toast
      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
      } else if (successCount > 0 && failCount > 0) {
        toast.success(`Uploaded ${successCount} file(s), ${failCount} failed`);
      }

      // Refresh documents
      dispatch(
        fetchDocuments({
          limit: 50,
          skip: 0,
          sort:
            sortBy === "name"
              ? "title"
              : sortBy === "modified"
              ? "updatedAt"
              : sortBy === "size"
              ? "fileSize"
              : "createdAt",
        })
      );
    } catch (error) {
      console.error("Failed to upload files:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      dispatch(setUploadLoading(false));
      dispatch(setUploadProgress(0));
    }
  };

  const handleSort = (field: "name" | "modified" | "size" | "type") => {
    const sortMap = {
      name: "title",
      modified: "updatedAt",
      size: "fileSize",
      type: "fileType",
    };

    const newSortBy = sortMap[field];
    if (sortBy === newSortBy) {
      dispatch(setSortOrder(sortOrder === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder("asc"));
    }
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleViewChange = (view: "grid" | "list") => {
    dispatch(setViewMode(view));
  };

  const handleDeleteFile = (file: FileItem) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      if (fileToDelete.type === "folder") {
        await dispatch(deleteDirectory(fileToDelete.id)).unwrap();
        // Refresh directories
        const userId = user ? user._id! : "";
        dispatch(fetchDirectories({ ownerId: userId }));
      } else {
        await dispatch(deleteDocument(fileToDelete.id)).unwrap();
        // Refresh documents
        dispatch(
          fetchDocuments({
            limit: 50,
            skip: 0,
            sort:
              sortBy === "name"
                ? "title"
                : sortBy === "modified"
                ? "updatedAt"
                : sortBy === "size"
                ? "fileSize"
                : "createdAt",
          })
        );
      }

      // Close details panel if deleted file was selected
      if (selectedFile?.id === fileToDelete.id) {
        setSelectedFile(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      if (file.fileUrl) {
        // Open file URL in new tab for download
        window.open(file.fileUrl, "_blank");
        toast.success("Download started");
      } else {
        toast.error("File URL not available");
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleView = async (file: FileItem) => {
    try {
      if (file.fileUrl) {
        // Open file URL in new tab for viewing
        window.open(file.fileUrl, "_blank");
      } else {
        toast.error("File URL not available");
      }
    } catch (error) {
      console.error("Failed to view file:", error);
      toast.error("Failed to view file");
    }
  };

  const handleShare = async (file: FileItem) => {
    try {
      // Copy file URL to clipboard
      if (file.fileUrl) {
        await navigator.clipboard.writeText(file.fileUrl);
        toast.success("File link copied to clipboard");
      } else {
        toast.error("File URL not available");
      }
    } catch (error) {
      console.error("Failed to share file:", error);
      toast.error("Failed to copy link");
    }
  };

  // Batch Operations
  const handleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredAndSortedFiles.map((f) => f.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedFiles.size === 0) {
      toast.error("No files selected");
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedFiles.size} item(s)?`);
    if (!confirmed) return;

    try {
      const filesToDelete = Array.from(selectedFiles);
      let successCount = 0;
      let failCount = 0;

      for (const fileId of filesToDelete) {
        const file = allFiles.find((f) => f.id === fileId);
        if (!file) continue;

        try {
          if (file.type === "folder") {
            await dispatch(deleteDirectory(fileId)).unwrap();
          } else {
            await dispatch(deleteDocument(fileId)).unwrap();
          }
          successCount++;
        } catch (err) {
          console.error("Failed to delete:", fileId, err);
          failCount++;
        }
      }

      // Refresh
      const userId = user ? user._id! : "";
      dispatch(fetchDirectories({ ownerId: userId }));
      dispatch(
        fetchDocuments({
          limit: 50,
          skip: 0,
          sort:
            sortBy === "name"
              ? "title"
              : sortBy === "modified"
              ? "updatedAt"
              : sortBy === "size"
              ? "fileSize"
              : "createdAt",
        })
      );

      setSelectedFiles(new Set());

      if (successCount > 0 && failCount === 0) {
        toast.success(`Deleted ${successCount} item(s)`);
      } else if (successCount > 0) {
        toast.success(`Deleted ${successCount}, ${failCount} failed`);
      }
    } catch (error) {
      console.error("Batch delete failed:", error);
      toast.error("Batch delete failed");
    }
  };

  const handleBatchDownload = async () => {
    if (selectedFiles.size === 0) {
      toast.error("No files selected");
      return;
    }

    const filesToDownload = Array.from(selectedFiles)
      .map((id) => allFiles.find((f) => f.id === id))
      .filter((f) => f && f.type === "file" && f.fileUrl) as FileItem[];

    if (filesToDownload.length === 0) {
      toast.error("No downloadable files selected");
      return;
    }

    filesToDownload.forEach((file) => {
      if (file.fileUrl) {
        window.open(file.fileUrl, "_blank");
      }
    });

    toast.success(`Downloading ${filesToDownload.length} file(s)`);
  };

  // Metadata Editing
  const handleEditMetadata = (file: FileItem) => {
    setFileToEdit(file);
    setEditFormData({
      title: file.name,
      description: file.notes || "",
      tags: file.tags.join(", "),
      visibility: file.visibility,
    });
    setEditDialogOpen(true);
  };

  const handleSaveMetadata = async () => {
    if (!fileToEdit) return;

    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);
      formData.append(
        "tags",
        JSON.stringify(
          editFormData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      formData.append(
        "access",
        JSON.stringify({ visibility: editFormData.visibility })
      );

      await dispatch(
        updateDocument({ id: fileToEdit.id, data: formData })
      ).unwrap();

      // Refresh documents
      dispatch(
        fetchDocuments({
          limit: 50,
          skip: 0,
          sort:
            sortBy === "name"
              ? "title"
              : sortBy === "modified"
              ? "updatedAt"
              : sortBy === "size"
              ? "fileSize"
              : "createdAt",
        })
      );

      setEditDialogOpen(false);
      setFileToEdit(null);
      toast.success("Metadata updated successfully");
    } catch (error) {
      console.error("Failed to update metadata:", error);
      toast.error("Failed to update metadata");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b !border-border bg-background sticky top-0 z-10">
          <div className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="flex h-[calc(100vh-200px)]">
          <div className="w-80 border-r !border-border bg-muted/20 flex-shrink-0">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b !border-border bg-background sticky top-0 z-10 space-y-4 pb-2">
        <DashboardPageHeader
          title="File Manager"
          description="Manage your legal documents and case files"
        />

        <FileManagerHeader
          onNewFolder={handleNewFolder}
          onUpload={handleUpload}
          view={viewMode}
          onViewChange={handleViewChange}
          search={searchQuery}
          onSearch={handleSearch}
          uploadLoading={uploadLoading}
          uploadProgress={uploadProgress}
        />
      </div>

      {/* Breadcrumb */}
      <div className="border-b !border-border px-6 py-3 bg-background flex items-center justify-between">
        <Breadcrumb path={currentPath} onPathChange={handlePathChange} />

        {/* Batch Actions */}
        {selectedFiles.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedFiles.size} selected
            </span>
            <Button size="sm" variant="outline" onClick={handleBatchDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBatchDelete}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFiles(new Set())}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - File Tree */}
        {sidebarOpen && (
          <div className="w-80 border-r !border-border bg-muted/20 flex-shrink-0">
            <FileTree
              files={allFiles as FileItem[]}
              currentPath={currentPath}
              onPathChange={handlePathChange}
              loading={directoryLoading}
            />
          </div>
        )}

        {/* Center Panel - File View */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* File List */}
          <div className="flex-1 overflow-auto p-6">
            {filteredAndSortedFiles.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="text-2xl font-medium mb-4 text-muted-foreground">
                    {searchQuery ? "No files found" : "No files yet"}
                  </div>
                  <div className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Upload files or create folders to get started"}
                  </div>
                  {!searchQuery && <UploadZone onUpload={handleUpload} />}
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <FileGridView
                files={filteredAndSortedFiles as FileItem[]}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                formatFileSize={formatFileSize}
                onDelete={handleDeleteFile}
                selectedFiles={selectedFiles}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                onEditMetadata={handleEditMetadata}
              />
            ) : (
              <FileListView
                files={filteredAndSortedFiles as FileItem[]}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                sortBy={sortBy as "name" | "modified" | "size" | "type"}
                sortOrder={sortOrder}
                onSort={handleSort}
                formatFileSize={formatFileSize}
                onDelete={handleDeleteFile}
                selectedFiles={selectedFiles}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                onEditMetadata={handleEditMetadata}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Details */}
        {showDetails && selectedFile && (
          <div className="w-96 border-l !border-border bg-muted/20 flex-shrink-0">
            <FileDetailsPanel
              file={selectedFile}
              formatFileSize={formatFileSize}
              onDelete={handleDeleteFile}
              onDownload={handleDownload}
              onView={handleView}
              onShare={handleShare}
              onEditMetadata={handleEditMetadata}
            />
          </div>
        )}
      </div>

      {/* Upload Zone (Bottom) */}
      {uploadLoading && (
        <div className="fixed bottom-4 right-4 bg-background border !border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <div className="text-sm">Uploading... {uploadProgress}%</div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {fileToDelete?.type === "folder"
                ? `This will permanently delete the folder "${fileToDelete?.name}" and all its contents. This action cannot be undone.`
                : `This will permanently delete "${fileToDelete?.name}". This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Metadata Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit File Metadata</DialogTitle>
            <DialogDescription>
              Update file information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="File title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder="File description or notes"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={editFormData.tags}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, tags: e.target.value })
                }
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={editFormData.visibility}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, visibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="lawyer">Lawyer Only</SelectItem>
                  <SelectItem value="client">Client Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetadata}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileManager;
