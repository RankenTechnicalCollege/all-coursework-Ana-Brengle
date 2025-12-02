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
import { P } from "node_modules/better-auth/dist/index-BzgT8cQd.d.mts"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import z from "zod"


export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const navigate = useNavigate();
  const [givenName, setGivenName] = useState<string>('')
  const [familyName, setFamilyName] = useState<string>('')
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

   if (!givenName || !familyName || !email || !password || !confirmPassword) {
      setErrors({ root: "Please fill in all required fields." });
      setIsSubmitting(false);
      return;
    }


  const payload = {
    givenName,
    familyName,
    email,
    password,
    confirmPassword,
    role
  }
  console.log("submitting: ", payload)

  try {
    const validated = signupSchema.parse(payload);
    const fullName = `${validated.givenName} ${validated.familyName}`;

    const {data: result, error} = await authClient.signUp.email({
      name: fullName,
      password: validated.password,
      email: validated.email
    },
    {
      onRequest: (ctx) => {
      const bodyData = 
      typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body;
      const updatedBody = {
        ...bodyData,
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
              <FieldLabel htmlFor="firstname">Given Name</FieldLabel>
              <Input 
                id="givenName"
                type="text" 
                placeholder="John" 
                value={givenName} 
                onChange={(e) =>setGivenName(e.target.value)} 
                required 
              />
              {errors.givenName && (
                <p className="text-sm text-destructive">{errors.givenName}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="lastname"> Family Name</FieldLabel>
              <Input 
                id="familyName" 
                type="text" 
                placeholder="Doe"
                value={familyName} 
                onChange={(e) =>setFamilyName(e.target.value)} 
                required
              />
              {errors.familyName && (
                <p className="text-sm text-destructive">{errors.familyName}</p>
              )}
            </Field>
            <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select a role</option>
                <option value="Developer">Developer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Quality Analyst">Quality Analyst</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Technical Manager">Technical Manager</option>
              </select>
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
              <Input id="password" type="password" required onChange={(e)}/>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
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
