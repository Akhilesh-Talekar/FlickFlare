import { z } from "zod";

export const authFormSchema = (type:string) => z.object({
    // Sign-Up
    firstName: type === 'signin' ? z.string().optional() : z.string().min(1, { message: "Required" }),
    lastName: type === 'signin' ? z.string().optional() : z.string().min(1, { message: "Required" }),
    // both
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 6 characters" }),
  });