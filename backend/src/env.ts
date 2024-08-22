import { z } from "zod";

export const envSchema = z.object({
    APP_URL: z.string().optional(),
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().optional().default(3333),
    APP_FRONTEND_URL: z.string().optional(),
    //JWT_PRIVATE_KEY: z.string(),
    //JWT_PUBLIC_KEY: z.string(),
    MAIL_HOST: z.string().optional(),
    MAIL_PORT: z.coerce.number().optional().default(465),
    MAIL_USER: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    DEFAULT_MAIL_NAME: z.string().optional(),
    DEFAULT_MAIL_FROM: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>