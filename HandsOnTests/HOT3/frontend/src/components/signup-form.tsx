
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
import { authClient } from "@/lib/auth-client";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {z} from "zod";
import signupSchema from "@/schemas/signUpSchema";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');


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
      navigate("/");

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
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input 
                id="fullName"
                type="text" 
                placeholder="John Doe"
                name="fullName"
                onChange={(e) =>setFullName(e.target.value)} 
                required 
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </Field>
            <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select 
                value={role} 
                onValueChange={setRole} >
                <SelectTrigger id="role" className="w-[180px]">
                  <SelectValue placeholder="Select Role"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
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
                name="email"
                onChange={(e) =>setEmail(e.target.value)}
                required
              />
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
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit"className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>          
              </Field>
              <Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link to="/login" className="underline hover:text-primary">
                  Login
                </Link>
              </FieldDescription>
            </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

