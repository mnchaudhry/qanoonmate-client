import React from 'react';
import { FileText, Upload } from 'lucide-react';

const EmptyState = ({ onUpload }: { onUpload?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FileText className="h-14 w-14 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">No Documents Yet</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        You haven&apos;t uploaded any legal documents yet. Upload contracts, agreements, notices, or any important files securely here. Only you and your assigned lawyer will have access.
      </p>
      {onUpload && (
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium shadow"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      )}
    </div>
  );
};

export default EmptyState;