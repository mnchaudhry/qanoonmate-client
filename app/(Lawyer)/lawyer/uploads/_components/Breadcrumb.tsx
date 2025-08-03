import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
  path: string[];
  onPathChange: (path: string[]) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onPathChange }) => {

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const handlePathClick = (index: number) => {
    const newPath = path.slice(0, index + 1);
    onPathChange(newPath);
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPathChange(['Case Files'])}
        className="h-6 px-2 text-muted-foreground hover:text-foreground"
      >
        <Home className="w-3 h-3" />
      </Button>
      
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePathClick(index)}
            className={`h-6 px-2 ${
              index === path.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {segment}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb; 