// src/pages/Login.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"

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

// 2. Define the API call function
async function loginUser(data: LoginData) {
  const response = await fetch('/auth/login', {
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

  // This will return { access_token: "..." }
  return response.json()
}

export default function LoginPage() {
  // 3. Define your form
  const form = useForm<LoginData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 4. Set up React Query Mutation
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: { access_token: string }) => {
      toast.success("Login Successful", {
        description: "You are now being redirected.",
      })
      // You would typically save the token and redirect here
      console.log("Access Token:", data.access_token)
      // Example: localStorage.setItem('token', data.access_token);
      // Example: navigate('/dashboard');
      form.reset()
    },
    onError: (error) => {
      toast.error("Login Failed", {
        description: error.message,
      })
    },
  })

  // 5. Define a submit handler
  function onSubmit(values: LoginData) {
    mutation.mutate(values)
  }

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 6. Use the new Form component */}
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