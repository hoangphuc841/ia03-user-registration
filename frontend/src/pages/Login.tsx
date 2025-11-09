// src/pages/Login.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom' 
import { useAuth } from '@/contexts/AuthContext' 

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

// 1. Define Validation Schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})
type LoginData = z.infer<typeof formSchema>

const API_URL = import.meta.env.VITE_API_URL;

// ... (loginUser API function is unchanged)
async function loginUser(data: LoginData) {
  const response = await fetch(`${API_URL}/auth/login`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Invalid email or password.')
  }
  return response.json()
}

export default function LoginPage() {
  const navigate = useNavigate(); // <-- 3. Get navigate function
  const { login } = useAuth(); // <-- 4. Get login from context

  // ... (form definition is unchanged)
  const form = useForm<LoginData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 5. Update mutation
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: { access_token: string }) => {
      // 6. Call context login function
      login(data.access_token);
      
      toast.success("Login Successful", {
        description: "You are now being redirected.",
      })
      
      // 7. Redirect to home page
      navigate('/');
    },
    onError: (error) => {
      toast.error("Login Failed", {
        description: error.message,
      })
    },
  })

  // ... (onSubmit and JSX return are unchanged)
  function onSubmit(values: LoginData) {
    mutation.mutate(values)
  }

  return (
    <div className="flex justify-center items-center pt-16">
      {/* ... (rest of the JSX) */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}