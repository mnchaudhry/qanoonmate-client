import { toast } from 'react-hot-toast';

export interface AuthRequiredAction {
  action: () => void;
  serviceName: string;
  cost?: number;
  customMessage?: string;
}

export const createAuthRequiredHandler = (
  requireAuth: (action: () => void, options?: any) => void
) => {
  return (config: AuthRequiredAction) => {
    const { action, serviceName, cost, customMessage } = config;
    
    const message = customMessage || 
      (cost ? 
        `Please sign in to use ${serviceName} (${cost} QC)` : 
        `Please sign in to use ${serviceName}`
      );

    requireAuth(action, {
      customMessage: message,
      showBenefits: true
    });
  };
};

export const showInsufficientCreditsToast = (required: number, available: number) => {
  toast.error(
    `Insufficient credits. Required: ${required} QC, Available: ${available} QC`,
    {
      duration: 5000
    }
  );
};

export const showAuthRequiredToast = (serviceName: string) => {
  toast.error(
    `Please sign in to use ${serviceName}`,
    {
      duration: 4000
    }
  );
};
