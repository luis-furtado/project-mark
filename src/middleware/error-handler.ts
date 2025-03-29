import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError, ConflictError } from '../shared/errors';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
  }

  // log and respond with generic error
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
}
