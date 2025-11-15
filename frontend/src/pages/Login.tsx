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
import api from '@/lib/api'

// 1. Define Validation Schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

type LoginData = z.infer<typeof formSchema>

async function loginUser(data: LoginData): Promise<LoginResponse> {
  // Use the 'api' instance, it already has the baseURL
  const response = await api.post('/auth/login', data);
  
  // The interceptor will handle non-200 codes,
  // so we just return the data on success
  return response.data;
}

export default function LoginPage() {
  const navigate = useNavigate(); // <-- 3. Get navigate function
  const { login } = useAuth(); // <-- 4. Get login from context

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
    onSuccess: (data: LoginResponse) => { // <-- 4. Use the new response type
      // 5. Pass the whole data object (access_token + refresh_token)
      login(data); 
      
      toast.success("Login Successful", {
        description: "You are now being redirected.",
      })
      
      navigate('/');
    },
    onError: (error: any) => { // <-- Handle Axios error object
      const message = error.response?.data?.message || error.message || "Login Failed";
      toast.error("Login Failed", {
        description: message,
      })
    },
  })

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