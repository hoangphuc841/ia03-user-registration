// src/App.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from '@/contexts/AuthContext' 
import { Button } from '@/components/ui/button' 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function App() {
  // Get auth state
  const { user, logout, isLoading, sessionExpired, clearSessionExpired } = useAuth();
  const navigate = useNavigate();

  function handleSessionExpired() {
    clearSessionExpired(); // Reset the state
    navigate('/login');    // Redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg">
            User Registration System
          </Link>
          <div className="flex gap-4 items-center">
            {/*  Main auth logic for navbar */}
            {isLoading ? (
              <div className="h-9 w-24 rounded-md animate-pulse bg-muted"></div>
            ) : user ? (
              // User is Logged In
              <>
                <Link to="/game" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Play Game
                </Link>
                <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  {user.email}
                </Link>
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
      <AlertDialog open={sessionExpired}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
            <AlertDialogDescription>
              Your session has expired. Please log in again to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSessionExpired}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default App