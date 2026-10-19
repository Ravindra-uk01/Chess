import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Username can only contain letters, numbers, underscores, dots, or hyphens',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .toLowerCase()
    .email('Please provide a valid email address (e.g. alex@example.com)')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
  name: z.string().trim().max(100).optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email or username is required')
    .max(255, 'Email or username cannot exceed 255 characters')
    .refine((val) => {
      // If the user inputs an email (contains '@'), validate proper email structure
      if (val.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      // Otherwise, allow username login (at least 3 characters)
      return val.length >= 3;
    }, {
      message: 'Please provide a valid email address or username',
    }),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .toLowerCase()
    .email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
