import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, FileText, Download, Eye, Shield } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  isVerified: boolean;
  category: 'license' | 'education' | 'identity' | 'certificate';
}

interface Props {
  lawyerId: string;
}

const DocumentsSection = ({ }: Props) => {
  // Mock documents data - replace with actual API call
  const documents: Document[] = [
    {
      id: '1',
      name: 'CNIC Front',
      type: 'JPG',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      isVerified: true,
      category: 'identity'
    },
    {
      id: '2',
      name: 'Bar License',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      isVerified: true,
      category: 'license'
    },
    {
      id: '3',
      name: 'Law Degree',
      type: 'PNG',
      size: '3.1 MB',
      uploadDate: '2024-01-15',
      isVerified: true,
      category: 'education'
    },
    {
      id: '4',
      name: 'Professional Certificate',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: '2024-01-10',
      isVerified: false,
      category: 'certificate'
    }
  ];

  const getCategoryInfo = (category: string) => {
    const categories = {
      'identity': { label: 'Identity', color: 'bg-primary-100 text-primary-700 border-primary-200' },
      'license': { label: 'License', color: 'bg-success-100 text-success-700 border-success-200' },
      'education': { label: 'Education', color: 'bg-secondary-100 text-secondary-700 border-secondary-200' },
      'certificate': { label: 'Certificate', color: 'bg-accent-100 text-accent-700 border-accent-200' },
    };
    return categories[category as keyof typeof categories] || categories['certificate'];
  };

  const getFileIcon = () => {
    return <FileText className="w-5 h-5 text-secondary-600" />;
  };

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <CardTitle className="text-xl text-primary-900 flex items-center gap-2">
          <FolderOpen className="w-6 h-6" />
          Documents & Licenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => {
            const categoryInfo = getCategoryInfo(doc.category);

            return (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-primary-900">{doc.name}</h4>
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.label}
                      </Badge>
                      {doc.isVerified && (
                        <Badge className="bg-success-100 text-success-700 border-success-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-secondary-600">
                      <span>{doc.type.toUpperCase()}</span>
                      <span>{doc.size}</span>
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-200 text-primary-700 hover:bg-primary-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-600 mb-2">
              No Documents Available
            </h3>
            <p className="text-secondary-500">
              Documents will appear here once uploaded and verified.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Note:</strong> All documents are verified by QanoonMate&apos;s verification team.
            Verified documents are marked with a shield icon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;