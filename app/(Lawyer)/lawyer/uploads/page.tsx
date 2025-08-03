"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDocuments, fetchDirectories, createDocument, deleteDocument, createDirectory, deleteDirectory, setCurrentPath, setViewMode, setSortBy, setSortOrder, setSearchQuery, setSelectedDocument } from '@/store/reducers/documentSlice';
import PageHeader from '../_components/PageHeader';
import FileManagerHeader from './_components/FileManagerHeader';
import FileTree from './_components/FileTree';
import FileDetailsPanel from './_components/FileDetailsPanel';
import FileGridView from './_components/FileGridView';
import FileListView from './_components/FileListView';
import UploadZone from './_components/UploadZone';
import Breadcrumb from './_components/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Document, Directory } from '@/store/types/api';

// Transform backend Document to FileItem for UI
const transformDocumentToFileItem = (doc: Document) => ({
  id: doc._id,
  name: doc.title || doc.fileName,
  type: 'file' as const,
  fileType: doc.fileType?.split('/')[1] || 'unknown',
  size: doc.fileSize,
  uploadedBy: doc.uploadedBy?.role || 'lawyer',
  uploadedAt: doc.createdAt,
  modifiedAt: doc.updatedAt,
  path: doc.fileName || '',
  visibility: doc.access?.visibility || 'private',
  tags: doc.tags || [],
  notes: doc.description,
  parentId: doc.consultationId || undefined,
  // Backend document properties
  _id: doc._id,
  fileUrl: doc.fileUrl,
  consultationId: doc.consultationId,
  metadata: doc.metadata,
  access: doc.access,
});

// Transform backend Directory to FileItem for UI
const transformDirectoryToFileItem = (dir: Directory) => ({
  id: dir._id,
  name: dir.name,
  type: 'folder' as const,
  uploadedBy: dir.ownerRole,
  uploadedAt: dir.createdAt,
  modifiedAt: dir.updatedAt,
  path: dir.name,
  visibility: 'private' as const,
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
  type: 'file' | 'folder';
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
  metadata?: any;
  access?: any;
  ownerId?: string;
  ownerRole?: string;
}

const FileManager = () => {
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { documents, directories, loading, directoryLoading, uploadLoading, uploadProgress, currentPath, viewMode, sortBy, sortOrder, searchQuery } = useSelector((state: RootState) => state.document);
  const { user } = useSelector((state: RootState) => state.auth);

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [showDetails, setShowDetails] = useState(false);
  const sidebarOpen = true;
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  //////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////////
  useEffect(() => {
    // Fetch documents and directories on mount
    dispatch(fetchDocuments({
      limit: 50,
      skip: 0,
      sort: sortBy === 'name' ? 'title' : sortBy === 'modified' ? 'updatedAt' : sortBy === 'size' ? 'fileSize' : 'createdAt'
    }));

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

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (file.type === 'file' && file.notes && file.notes.toLowerCase().includes(query))
      );
    }

    // Sort files
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'modified':
          comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
        case 'size':
          const sizeA = a.type === 'file' ? (a.size || 0) : 0;
          const sizeB = b.type === 'file' ? (b.size || 0) : 0;
          comparison = sizeA - sizeB;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [allFiles, searchQuery, sortBy, sortOrder]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'folder') {
      // Navigate to folder
      const newPath = [...currentPath, file.name];
      dispatch(setCurrentPath(newPath));
      setSelectedFile(null);
      setShowDetails(false);
    } else {
      // Select file for details
      setSelectedFile(file);
      setShowDetails(true);
      // Set selected document in store
      const document = documents.find(d => d._id === file._id);
      if (document) {
        dispatch(setSelectedDocument(document));
      }
    }
  };

  const handlePathChange = (newPath: string[]) => {
    dispatch(setCurrentPath(newPath));
    setSelectedFile(null);
    setShowDetails(false);
  };

  const handleNewFolder = async () => {
    try {
      const folderName = prompt('Enter folder name:');
      if (!folderName) return;

      const userId = user ? user._id! : "";
      const parentId = currentPath.length > 1 ? 'parent-id' : null; // TODO: Get actual parent ID

      await dispatch(createDirectory({
        ownerId: userId,
        ownerRole: 'lawyer' as any,
        name: folderName,
        parentId
      })).unwrap();

      // Refresh directories
      dispatch(fetchDirectories({ ownerId: userId }));
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('description', 'Uploaded via file manager');
        formData.append('tags', 'uploaded,file-manager');
        formData.append('access', JSON.stringify({ visibility: 'private' }));

        await dispatch(createDocument(formData)).unwrap();
      }

      // Refresh documents
      dispatch(fetchDocuments({
        limit: 50,
        skip: 0,
        sort: sortBy === 'name' ? 'title' : sortBy === 'modified' ? 'updatedAt' : sortBy === 'size' ? 'fileSize' : 'createdAt'
      }));
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const handleSort = (field: 'name' | 'modified' | 'size' | 'type') => {
    const sortMap = {
      name: 'title',
      modified: 'updatedAt',
      size: 'fileSize',
      type: 'fileType'
    };

    const newSortBy = sortMap[field];
    if (sortBy === newSortBy) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder('asc'));
    }
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    dispatch(setViewMode(view));
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      if (file.type === 'folder') {
        await dispatch(deleteDirectory(file.id)).unwrap();
        // Refresh directories
        const userId = user ? user._id! : "";
        dispatch(fetchDirectories({ ownerId: userId }));
      } else {
        await dispatch(deleteDocument(file.id)).unwrap();
        // Refresh documents
        dispatch(fetchDocuments({
          limit: 50,
          skip: 0,
          sort: sortBy === 'name' ? 'title' : sortBy === 'modified' ? 'updatedAt' : sortBy === 'size' ? 'fileSize' : 'createdAt'
        }));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="flex h-[calc(100vh-200px)]">
          <div className="w-80 border-r border-border bg-muted/20 flex-shrink-0">
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
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="p-6">
          <PageHeader
            title="File Manager"
            description="Manage your legal documents and case files"
          />

          <FileManagerHeader
            onNewFolder={handleNewFolder}
            onUpload={() => { }} // Handled by UploadZone
            view={viewMode}
            onViewChange={handleViewChange}
            search={searchQuery}
            onSearch={handleSearch}
            uploadLoading={uploadLoading}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3 bg-background">
        <Breadcrumb path={currentPath} onPathChange={handlePathChange} />
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - File Tree */}
        {sidebarOpen && (
          <div className="w-80 border-r border-border bg-muted/20 flex-shrink-0">
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
                    {searchQuery ? 'No files found' : 'No files yet'}
                  </div>
                  <div className="text-muted-foreground mb-6">
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'Upload files or create folders to get started'
                    }
                  </div>
                  {!searchQuery && <UploadZone onUpload={handleUpload} />}
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <FileGridView
                files={filteredAndSortedFiles as FileItem[]}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                formatFileSize={formatFileSize}
                onDelete={handleDeleteFile}
              />
            ) : (
              <FileListView
                files={filteredAndSortedFiles as FileItem[]}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                sortBy={sortBy as 'name' | 'modified' | 'size' | 'type'}
                sortOrder={sortOrder}
                onSort={handleSort}
                formatFileSize={formatFileSize}
                onDelete={handleDeleteFile}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Details */}
        {showDetails && selectedFile && (
          <div className="w-96 border-l border-border bg-muted/20 flex-shrink-0">
            <FileDetailsPanel
              file={selectedFile}
              formatFileSize={formatFileSize}
              onDelete={handleDeleteFile}
            />
          </div>
        )}
      </div>

      {/* Upload Zone (Bottom) */}
      {uploadLoading && (
        <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <div className="text-sm">Uploading... {uploadProgress}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;