// src/pages/Home.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to the App!</CardTitle>
          <CardDescription>
            This is the home page. Use the navigation above to log in or register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A simple user registration system</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
            <li>React Router DOM for routing</li>
            <li>shadcn/ui for components</li>
            <li>React Hook Form + Zod for validation</li>
            <li>React Query for API state</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}