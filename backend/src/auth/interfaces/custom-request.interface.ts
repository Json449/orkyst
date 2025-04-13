// src/auth/interfaces/custom-request.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  cookies: { [key: string]: string }; // Add the cookies property
}
