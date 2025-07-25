import { body, param } from 'express-validator';

export const contentValidation = body('content')
  .trim()
  .notEmpty()
  .withMessage('El contenido es obligatorio.');

export const postIdParamValidation = param('postId')
  .notEmpty()
  .withMessage('El ID de la publicación es obligatorio.')
  .bail()
  .isUUID()
  .withMessage('El ID de la publicación debe tener formato UUID válido.');

export const commentIdParamValidation = param('commentId')
  .notEmpty()
  .withMessage('El ID del comentario es obligatorio.')
  .bail()
  .isUUID()
  .withMessage('El ID del comentario debe tener formato UUID válido.');

export const createCommentValidation = [
  postIdParamValidation,
  contentValidation,
];

export const updateCommentValidation = [
  postIdParamValidation,
  commentIdParamValidation,
  contentValidation,
];

export const deleteCommentValidation = [
  postIdParamValidation,
  commentIdParamValidation,
];
