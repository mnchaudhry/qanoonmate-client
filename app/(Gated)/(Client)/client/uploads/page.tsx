"use client"

import React, { useEffect, useState } from 'react';
import DocumentsHeader from './_components/DocumentsHeader';
import DocumentsToolbar from './_components/DocumentsToolbar';
import DocumentsList from './_components/DocumentsList';
import DocumentPreview from './_components/DocumentPreview';
import UploadModal from './_components/UploadModal';
import EmptyState from './_components/EmptyState';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDocuments, deleteDocument, setSelectedDocument } from '@/store/reducers/documentSlice';
import type { Document } from '@/store/types/api';
import { toast } from 'sonner';

const DocumentsPage = () => {
  /////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error, selectedDocument } = useSelector((state: RootState) => state.document);

  /////////////////////////////////////////////// STATES ////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  /////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    dispatch(fetchDocuments(undefined));
  }, [dispatch]);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /////////////////////////////////////////////// FILTER ////////////////////////////////////////////////
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false) ||
      (doc.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || (doc.fileType?.toLowerCase() === typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  /////////////////////////////////////////////// HANDLERS ////////////////////////////////////////////////
  const handleSelectDocument = (doc: Document) => {
    dispatch(setSelectedDocument(doc));
  };

  const handleDeleteDocument = (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    dispatch(deleteDocument(id));
  };

  const handleEditDocument = (doc: Document) => {
    dispatch(setSelectedDocument(doc));
    setUploadModalOpen(true);
  };

  /////////////////////////////////////////////// RENDER ////////////////////////////////////////////////
  return (
    <div className="space-y-4 ">
      <DocumentsHeader />

      <DocumentsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onUploadClick={() => setUploadModalOpen(true)}
      />

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
      ) : documents.length === 0 ? (
        <EmptyState onUpload={() => setUploadModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1">
            <DocumentsList
              documents={filteredDocuments}
              selectedDocument={selectedDocument}
              onSelectDocument={handleSelectDocument}
            />
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-2">
            <DocumentPreview
              document={selectedDocument}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          dispatch(setSelectedDocument(null));
        }}
        editingDocument={selectedDocument!}
      />
    </div>
  );
};

export default DocumentsPage;
