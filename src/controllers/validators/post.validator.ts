import { query, body } from 'express-validator';

export const createPostValidation = [
  body('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),

  body('content')
    .notEmpty().withMessage('El contenido es obligatorio')
    .isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
];

export const updatePostValidation = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),

  body('content')
    .optional()
    .isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
];

export const postQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('title').optional().isString().withMessage('Title must be a string'),
  query('publishedAfter').optional().isISO8601().toDate().withMessage('Invalid publishedAfter date'),
  query('publishedBefore').optional().isISO8601().toDate().withMessage('Invalid publishedBefore date'),
];