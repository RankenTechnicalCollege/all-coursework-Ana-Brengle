import {z} from 'zod'

const signupSchema = z.object({
    fullName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(['developer', 'business analyst', 'quality analyst', 'product manager', 'technical manager'])
    
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]  
  });

export default signupSchema