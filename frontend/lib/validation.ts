import { z } from 'zod';

// Shared by the client forms (react-hook-form) and the server actions, so the
// browser and the server always agree on what "valid" means.

export const accountRoleSchema = z.enum(['BUYER', 'SELLER'], {
  message: 'نوع حساب را انتخاب کنید.',
});

export const loginSchema = z.object({
  email: z.email({ message: 'ایمیل معتبر وارد کنید.' }),
  password: z.string().min(1, { message: 'رمز عبور را وارد کنید.' }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(120, { message: 'نام حداکثر ۱۲۰ کاراکتر است.' })
      .optional()
      .or(z.literal('')),
    email: z.email({ message: 'ایمیل معتبر وارد کنید.' }),
    password: z
      .string()
      .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' })
      .max(72, { message: 'رمز عبور حداکثر ۷۲ کاراکتر است.' }),
    role: accountRoleSchema,
    shopName: z
      .string()
      .trim()
      .max(120, { message: 'نام مغازه حداکثر ۱۲۰ کاراکتر است.' })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'SELLER' && (!data.shopName || data.shopName.length < 2)) {
      ctx.addIssue({
        code: 'custom',
        path: ['shopName'],
        message: 'نام مغازه را وارد کنید.',
      });
    }
  });

export const completeProfileSchema = z
  .object({
    role: accountRoleSchema,
    shopName: z
      .string()
      .trim()
      .max(120, { message: 'نام مغازه حداکثر ۱۲۰ کاراکتر است.' })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'SELLER' && (!data.shopName || data.shopName.length < 2)) {
      ctx.addIssue({
        code: 'custom',
        path: ['shopName'],
        message: 'نام مغازه را وارد کنید.',
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type AccountRole = z.infer<typeof accountRoleSchema>;
