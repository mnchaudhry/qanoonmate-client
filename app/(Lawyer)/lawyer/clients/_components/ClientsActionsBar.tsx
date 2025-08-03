import React from 'react';
import { Button } from '@/components/ui/button';

const ClientsActionsBar = ({ onAdd, onExport, onRefresh }: { onAdd: () => void, onExport: () => void, onRefresh: () => void }) => {
  return (
    <div className="flex flex-wrap gap-2 py-4 justify-end">
      <Button onClick={onAdd} className="bg-[var(--primary)] text-[var(--primary-foreground)]">+ Add New Client Manually</Button>
      <Button variant="outline" onClick={onExport} className="border-[var(--border)] text-[var(--foreground)]">↓ Export List</Button>
      <Button variant="ghost" onClick={onRefresh} className="text-[var(--primary)]">↻ Refresh Data</Button>
    </div>
  );
};

export default ClientsActionsBar; 