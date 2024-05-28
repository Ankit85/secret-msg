
import {z} from 'zod'

export const messageSchema = z.object({
   content:z.string()
       .min(10,"Content should be at least 10 characters long")
       .max(300,"content cannot be more than 300 characters long")
})
