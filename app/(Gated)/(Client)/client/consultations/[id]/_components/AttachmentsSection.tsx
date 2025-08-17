"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image as ImageIcon } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface AttachmentsSectionProps {
  attachments: Attachment[];
}

export default function AttachmentsSection({ attachments = [] }: AttachmentsSectionProps) {
  if (attachments.length === 0) {
    return null;
  }

  // Function to get the appropriate icon for each file type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="h-4 w-4 mr-2 text-red-500" />;
    } else if (type.includes('image')) {
      return <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />;
    } else {
      return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">📎</span>
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex justify-between items-center p-4">
              <div className="flex items-center">
                {getFileIcon(attachment.type)}
                <span>{attachment.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// For testing purposes, we'll provide default props
AttachmentsSection.defaultProps = {
  attachments: [
    {
      id: '1',
      name: 'property_inheritance.pdf',
      type: 'application/pdf',
      url: '#',
    },
    {
      id: '2',
      name: 'CNIC_copy.jpg',
      type: 'image/jpeg',
      url: '#',
    },
  ],
};
