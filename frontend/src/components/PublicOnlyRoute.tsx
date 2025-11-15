// src/components/PublicOnlyRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2Icon } from 'lucide-react';

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a centered loader while auth state is being checked
    return (
      <div className="flex justify-center items-center pt-32">
        <Loader2Icon className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // redirect them from login/register if logged in
    return <Navigate to="/" replace />;
  }

  // show the child component if not logged in (Login or Register page)
  return <>{children}</>;
}