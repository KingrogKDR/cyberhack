import {z} from 'zod'

export const createConsentSchema=z.object({
    appId: z.string(),
    dataFields: z.array(z.string()),
    purpose: z.string(),
    expiresAt: z.coerce.date(),
})

export type CreateConsentInput = z.infer<typeof createConsentSchema>;
