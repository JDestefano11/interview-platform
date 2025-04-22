"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { NameField, EmailField, PasswordField } from "@/components/FormFields"

interface AuthFormProps {
    type: "signin" | "signup"
}

const signInSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }), 
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }), 
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

// These lines use Zod's inference to create TypeScript types from our validation schemas.
// SignInFormValues will have the type: { email: string; password: string; }
// SignUpFormValues will have the type: { name: string; email: string; password: string; }
// This ensures our form data types match exactly what our validation expects,
// creating a single source of truth for both validation and TypeScript typing.
type SignInFormValue = z.infer<typeof signInSchema>
type SignUpFormValue = z.infer<typeof signUpSchema>

const AuthForm = ({ type }: AuthFormProps) => {
    // Set the initial state for form data and loading status
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use the appropriate schema based on the form type (signin or signup)
    const form = useForm<SignInFormValue | SignUpFormValue>({
        resolver: zodResolver(type === "signin" ? signInSchema : signUpSchema),
        defaultValues: type === "signin" ? { email: "", password: "" } : { name: "", email: "", password: "" },
    })

    // Handle form submission
    const onSubmit = async (data: SignInFormValue | SignUpFormValue) => {
        setIsLoading(true)
        setError(null) 

        // Will replace the api simulation with a real API call later
        try {
            // Simulate an API call with a timeout
            await new Promise((resolve) => setTimeout(resolve, 2000)); 

            if (type == "signin") {
                console.log("Sign In Data:", data);
            } else {
                console.log("Signup Data:", data); 
                // Redirect here
                }
        } catch { 
            console.error("Error during form submission:", error);
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="px-8 py-10 sm:px-10 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-secondary via-secondary-light to-accent">
          {type === "signin" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {type === "signin" 
            ? "Sign in to continue to your account" 
            : "Fill out the form to get started"}
        </p>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-xs uppercase text-muted-foreground tracking-wider">
          {type === "signin" ? "sign in with email" : "create your account"}
        </p>
      </div>
      
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name field - only for signup */}
          {type === "signup" && (
            <NameField
              form={form}
              disabled={isLoading}
            />
          )}
          
          {/* Email field */}
          <EmailField
            form={form}
            disabled={isLoading}
          />
          
          {/* Password field */}
          <PasswordField
            form={form}
            disabled={isLoading}
          />
          
          {/* Error message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full mt-6 bg-[var(--auth-btn)] hover:bg-[var(--auth-btn-hover)] text-white font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>{type === "signin" ? "Signing in..." : "Creating account..."}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>{type === "signin" ? "Sign in" : "Create account"}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </Form>
      
      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-4">
          or
        </p>
        
        <p className="text-sm text-muted-foreground">
          {type === "signin" ? (
            <>
              Don't have an account?{" "}
              <Link className="font-medium text-[var(--secondary-light)] cursor-pointer hover:underline" href="/signup">
                Sign up
            </Link>
            </>
          ) : (
            <>
                Already have an account?{" "}
             <Link href="/signin" className="font-medium text-[var(--secondary-light)] cursor-pointer hover:underline">
                Sign in
             </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default AuthForm