import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),
  body('password').isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .exists().withMessage('refreshToken is required')
    .bail()
    .isString().withMessage('refreshToken must be a string')
    .notEmpty().withMessage('refreshToken cannot be empty'),
]

export const signupValidation = [
  body('firstName').notEmpty().withMessage('El nombre es obligatorio.'),
  body('lastName').notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').isEmail().withMessage('Correo electrónico inválido.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
];