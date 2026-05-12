import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';

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
import { Input } from "#components/ui/input"

interface SignupProps extends React.ComponentProps<"div"> {
  fullname: string,
  setFullname: (val: string) => void,
  email: string,
  setEmail: (val: string) => void,
  password:string,
  setPassword: (val: string) => void,
  confirmPassword:string,
  setConfirmPassword: (val:string) => void, 
  onSubmit: (e: React.SubmitEvent) => void,
  loading?: boolean,
  error: string,
  success: string
}

export function SignupForm({ 
  className,
  fullname,
  setFullname,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  loading,
  error,
  success,
  ...props }: SignupProps) {
  return (
    <>
      {success ? 
      <Card size="sm" className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Success</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {success}
          </p>
        </CardContent>
      </Card>
      :
      <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input 
              id="name" 
              type="text" 
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)} 
              required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@email.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" 
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)} 
              required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
              id="confirm-password" 
              type="password"
              value={confirmPassword}
              onChange={(e)=> setConfirmPassword(e.target.value)}  
              required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              <Field>
                <Button type="submit" disabled={loading}>
                   {loading ? "Creating User..." : "Create Account" }
                </Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    }
    </>
  )
}
