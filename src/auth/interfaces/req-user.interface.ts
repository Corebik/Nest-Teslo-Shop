import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}

export interface AuthedRequest extends Request {
  user: AuthUser;
}
