import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import signupSchema from "@/schemas/signupSchema"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import z from "zod"
import { UserPlus } from "lucide-react"


export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

   if (password !== confirmPassword) {
      setErrors({ root: "Passwords do not match" });
      setIsSubmitting(false);
      return;
    }

   if (!fullName|| !email || !password || !confirmPassword || !role) {
      setErrors({ root: "Please fill in all required fields." });
      setIsSubmitting(false);
      return;
    }


  const payload = {
    fullName,
    email,
    password,
    confirmPassword,
    role,
  }
  console.log("submitting: ", payload)

  try {
    const validated = signupSchema.parse(payload);


    const {data: result, error} = await authClient.signUp.email({
      name: validated.fullName,
      password: validated.password,
      email: validated.email
    },
    {
      onRequest: (ctx) => {
      const bodyData = 
      typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body;
      const updatedBody = {
        ...bodyData,
        fullName: validated.fullName,
        role: [validated.role]
      };

      ctx.body = JSON.stringify(updatedBody)
      return ctx
    } 
  })
   if (error) {
        throw new Error(error.message || "Registration failed");
      }

      console.log("Registration successful:", result);

      // Better Auth automatically sets session cookies
      // Redirect to home page after successful registration
      navigate("/landingPage");

  } catch (error) {
    console.error("Registration error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          root: error instanceof Error ? error.message : "Registration failed",
        });
      }
    } finally {
      setIsSubmitting(false);

  }
  } 

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input 
                id="fullName"
                type="text" 
                placeholder="John" 
                value={fullName} 
                onChange={(e) =>setFullName(e.target.value)} 
                required 
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </Field>
            
            <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select value={role} onValueChange={setRole} >
                <SelectTrigger id="role" className="w-[180px]">
                  <SelectValue placeholder="Developer, Business Analyst, QA ect..."/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="business analyst">Business Analyst</SelectItem>
                  <SelectItem value="quality analyst">Quality Analyst</SelectItem>
                  <SelectItem value="product manager">Product Manager</SelectItem>
                  <SelectItem value="technical manager">Technical Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <FieldDescription className="text-destructive">
                  {errors.role}
                </FieldDescription>
              )}
          </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) =>setEmail(e.target.value)}/>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}><UserPlus />Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
