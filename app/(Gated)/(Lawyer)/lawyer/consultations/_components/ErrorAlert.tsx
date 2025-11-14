import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
    error: string;
    onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => {
    return (
        <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="ml-4"
                >
                    Try Again
                </Button>
            </AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
