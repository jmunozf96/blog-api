import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínima de 6 caracteres')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .exists().withMessage('refreshToken is required')
    .bail()
    .isString().withMessage('refreshToken must be a string')
    .notEmpty().withMessage('refreshToken cannot be empty'),
]