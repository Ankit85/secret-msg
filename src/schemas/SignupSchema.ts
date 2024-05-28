import {z} from 'zod'


export const usernameValidation =z
    .string()
    .min(2,"Username must be at least 2 char long")
    .max(20,"Username can be max 20 char long")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


export const signupSchema = z.object({
    username:usernameValidation,
    email:z.string()
           .email({message:"Invalid email address"}),
    password:z.string()
        .min(6,"Password must be at least 6 characters")
        .max(20,"Password cannot be more than 20 characters"),
})
