import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function AuthPage() {
  const { loginMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send reset email");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reset email sent",
        description: "If an account exists with that email, you will receive a password reset link.",
      });
      setShowForgotPassword(false);
      forgotPasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send reset email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (user) {
    setLocation("/admin");
    return null;
  }

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  const onForgotPasswordSubmit = forgotPasswordForm.handleSubmit((data) => {
    forgotPasswordMutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{showForgotPassword ? "Reset Password" : "Admin Login"}</CardTitle>
          <CardDescription>
            {showForgotPassword
              ? "Enter your email to receive a password reset link"
              : "Login to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            <Form {...forgotPasswordForm} key="forgot-password-form">
              <form onSubmit={onForgotPasswordSubmit} className="space-y-6">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@company.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...loginForm} key="login-form">
              <form onSubmit={onLoginSubmit} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}