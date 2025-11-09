// src/App.tsx
import { Outlet, Link } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg">
            User Registration System
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Login
            </Link>
            <Link to="/register" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* This will now be the theme-aware sonner toaster */}
      <Toaster />
    </div>
  )
}

export default App