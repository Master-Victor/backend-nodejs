import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

export const errorHandler = ( error: Error, req: Request, res: Response, next: NextFunction ) => {
  console.error('Error:', error);

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'A record with these details already exists'
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found',
          message: 'The requested record does not exist'
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Foreign key violation',
          message: 'The referenced record does not exist'
        });
      default:
        return res.status(500).json({
          error: 'Database error',
          message: 'An error occurred while processing your request'
        });
    }
  }
  if (error instanceof PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Invalid data',
      message: 'The provided data is invalid'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
};