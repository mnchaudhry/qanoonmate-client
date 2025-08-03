"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, PaperclipIcon, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachmentsUploadProps {
  attachments: File[];
  setAttachments: (attachments: File[]) => void;
}

export default function AttachmentsUpload({ attachments, setAttachments }: AttachmentsUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFiles(newFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      handleFiles(newFiles);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleFiles = (files: File[]) => {
    // Filter for allowed file types (images, PDFs)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const validFiles = files.filter(file => 
      allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileIcon className="h-4 w-4 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileIcon className="h-4 w-4 text-red-500" />;
    }
    return <PaperclipIcon className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <PaperclipIcon className="mr-2 h-5 w-5" />
          Attachments (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF, PDF (max 5MB each)
            </p>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/jpeg,image/png,image/gif,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>
        </div>

        {/* File List */}
        {attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Files ({attachments.length})</h4>
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                >
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <span className="ml-2 text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
