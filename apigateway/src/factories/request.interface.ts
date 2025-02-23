import { Request } from 'express';
import { User } from './ability.factory'; 

export interface CustomRequest extends Request {
  user: User; 
}
