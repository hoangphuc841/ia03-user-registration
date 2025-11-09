// src/App.tsx
import { Outlet, Link } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from '@/contexts/AuthContext' // <-- 1. Import useAuth
import { Button } from '@/components/ui/button' // <-- 2. Import Button

function App() {
  // 3. Get auth state
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg">
            User Registration System
          </Link>
          <div className="flex gap-4 items-center">
            {/* 4. Main auth logic for navbar */}
            {isLoading ? (
              <div className="h-9 w-24 rounded-md animate-pulse bg-muted"></div>
            ) : user ? (
              // User is Logged In
              <>
                <span className="text-sm font-medium text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              // User is Logged Out
              <>
                <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Toaster />
    </div>
  )
}

export default App