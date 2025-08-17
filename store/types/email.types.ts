export type EmailTemplate = 'custom' | 'waitlist_invite' | 'waitlist_joined' | 'beta_invite';

export interface SendEmailRequest {
  subject: string;
  html?: string;
  template?: EmailTemplate;
  inviteLink?: string;
  to?: string[];
  userIds?: string[];
  roles?: Array<'ADMIN' | 'LAWYER' | 'CLIENT'>;
}

export interface SendEmailResultItem {
  to: string;
  status: 'sent' | 'skipped' | 'failed';
  error?: string;
}

export interface SendEmailResponse {
  data: {
    totalRequested: number;
    totalSent: number;
    results: SendEmailResultItem[];
  };
  message: string;
}


