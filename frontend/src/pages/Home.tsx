import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext" // 1. Import useAuth

export default function HomePage() {
  const { user } = useAuth(); // 2. Get the user state

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          {/* 3. Dynamic Welcome Message */}
          <CardTitle>
            {user ? `Welcome back, ${user.email}!` : "Welcome to the App!"}
          </CardTitle>
          <CardDescription>
            {user
              ? "Check out your dashboard or play a game."
              : "This is the home page. Use the navigation above to log in or register."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A simple user registration system built with NestJS and React.</p>
          
          {/* 4. Conditionally show links */}
          {user ? (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">You can also:</h4>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/game">Play Game</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/profile">Check Profile</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="list-disc pl-5 mt-4 text-sm text-muted-foreground">
              <li>React Router DOM for routing</li>
              <li>shadcn/ui for components</li>
              <li>React Hook Form + Zod for validation</li>
              <li>React Query for API state</li>
              <li>And more..</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}