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

            // Set authentication cookie
            document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

            if (type == "signin") {
                console.log("Sign In Data:", data);
                window.location.href = "/";
            } else {
                console.log("Signup Data:", data); 
                window.location.href = "/";
            }
        } catch { 
            console.error("Error during form submission:", error);
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="px-8 py-10 sm:px-10 sm:py-12 relative">
      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-[#4D4DFF]/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-[#01CDFE]/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse-delay"></div>
      
      {/* Floating accents */}
      <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-[#01CDFE]/60 shadow-[0_0_10px_rgba(1,205,254,0.7)] animate-float"></div>
      <div className="absolute bottom-10 left-10 w-3 h-3 rounded-full bg-[#9C42F5]/60 shadow-[0_0_10px_rgba(156,66,245,0.7)] animate-float-delay"></div>
      
      {/* Header */}
      <div className="text-center mb-8 relative">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#4D4DFF] via-[#01CDFE] to-[#9C42F5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {type === "signin" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-[#8BA3C7]">
          {type === "signin" 
            ? "Sign in to continue to your account" 
            : "Fill out the form to get started"}
        </p>
      </div>
      
      <div className="text-center mb-6 relative">
        <div className="h-px w-full max-w-[120px] mx-auto bg-gradient-to-r from-transparent via-[#4D4DFF]/30 to-transparent mb-4"></div>
        <p className="text-xs uppercase text-[#8BA3C7] tracking-wider">
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
            className="w-full mt-6 bg-[#4D4DFF] hover:bg-[#4D4DFF]/90 text-white font-medium transition-all shadow-[0_0_15px_rgba(77,77,255,0.2)] hover:shadow-[0_0_20px_rgba(77,77,255,0.4)] border border-[#4D4DFF]/30"
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
        <div className="h-px w-full max-w-[120px] mx-auto bg-gradient-to-r from-transparent via-[#4D4DFF]/30 to-transparent mb-4"></div>
        <p className="text-xs uppercase text-[#8BA3C7] tracking-wider mb-4">
          or
        </p>
        
        <p className="text-sm text-[#8BA3C7]">
          {type === "signin" ? (
            <>
              Don't have an account?{" "}
              <Link className="font-medium text-[#01CDFE] cursor-pointer hover:underline hover:text-[#01CDFE]/80 transition-colors" href="/signup">
                Sign up
            </Link>
            </>
          ) : (
            <>
                Already have an account?{" "}
             <Link href="/signin" className="font-medium text-[#01CDFE] cursor-pointer hover:underline hover:text-[#01CDFE]/80 transition-colors">
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