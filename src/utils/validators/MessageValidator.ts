import { z } from 'zod';

export const MessageValidator = z.object({
    type: z.enum(["MSG", "ERR"]),
    group: z.string(), 
    payload: z.string().max(1000)
})

export type Message = z.infer<typeof MessageValidator>