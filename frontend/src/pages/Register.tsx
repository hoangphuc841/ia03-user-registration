// src/pages/Register.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
// 1. Change the import from useToast to toast
import { toast } from "sonner"

// 1. Define Validation Schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

// Define the API call function
async function registerUser(data: z.infer<typeof formSchema>) {
  // Simulate a POST request
  console.log("Sending data to /user/register", data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a random success/error
      if (Math.random() > 0.2) {
        resolve({ success: true, message: "User registered successfully!" })
      } else {
        reject(new Error("An error occurred. Please try again."))
      }
    }, 1500)
  })
}


export default function RegisterPage() {
  // 2. Remove the useToast() hook

  // 2. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 3. Set up React Query Mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: any) => {
      // 3. Update the success toast call
      toast.success("Success!", {
        description: data.message,
      })
      form.reset()
    },
    onError: (error) => {
      // 4. Update the error toast call (variant: "destructive" becomes toast.error)
      toast.error("Error!", {
        description: error.message,
      })
    },
  })

  // 4. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started.
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
                    <FormDescription>
                      Must be at least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}