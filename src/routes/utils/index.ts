import { z } from 'zod';

export const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('The email address is badly formatted'),
    message: z.string().min(1, 'Message is required'),
    token: z.string().min(1, 'Token is missing')
});

export type FormSchema = z.infer<typeof schema>;
