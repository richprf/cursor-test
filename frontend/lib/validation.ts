import { z } from 'zod';

// Shared by the client forms (react-hook-form) and the server actions, so the
// browser and the server always agree on what "valid" means.

export const loginSchema = z.object({
  email: z.email({ message: 'ایمیل معتبر وارد کنید.' }),
  password: z.string().min(1, { message: 'رمز عبور را وارد کنید.' }),
});

export const registerSchema = z.object({
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
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
