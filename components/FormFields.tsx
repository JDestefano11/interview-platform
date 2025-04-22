"use client"

import React from "react";
import { Mail, Lock, User } from "lucide-react";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FieldProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  showForgotPassword?: boolean;
}

// Email Field Component
export const EmailField = ({ 
  form, 
  name = "email", 
  label = "Email Address", 
  placeholder = "name@example.com", 
  disabled = false 
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder={placeholder} 
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                {...field} 
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
      )}
    />
  );
};

// Password Field Component
export const PasswordField = ({ 
  form, 
  name = "password", 
  label = "Password", 
  placeholder = "••••••••", 
  disabled = false,
  showForgotPassword = false
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-foreground">{label}</FormLabel>
            {showForgotPassword && (
              <span className="text-xs font-medium text-primary cursor-pointer hover:underline">
                Forgot password?
              </span>
            )}
          </div>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password" 
                placeholder={placeholder} 
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                {...field} 
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
      )}
    />
  );
};

// Name Field Component
export const NameField = ({ 
  form, 
  name = "name", 
  label = "Full Name", 
  placeholder = "John Doe", 
  disabled = false 
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={placeholder} 
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                {...field} 
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
      )}
    />
  );
};