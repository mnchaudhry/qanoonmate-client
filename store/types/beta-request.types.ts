import { APIResponse } from './api';
import { UserRole } from '@/lib/enums';

export interface BetaRequestInput {
  name: string;
  email: string;
  intendedRole: UserRole;
  message?: string;
}

export type CreateBetaRequestResponse = APIResponse<{ id: string } | any>;


