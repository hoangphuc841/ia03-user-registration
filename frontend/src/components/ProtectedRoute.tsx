import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2Icon } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a centered loader while auth state is being checked
    return (
      <div className="flex justify-center items-center pt-32">
        <Loader2Icon className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // User is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, show the child component (the game)
  return <>{children}</>;
}