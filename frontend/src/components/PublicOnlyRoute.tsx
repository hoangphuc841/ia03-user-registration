// src/components/PublicOnlyRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // User is logged in, redirect them from login/register
    return <Navigate to="/" replace />;
  }

  // User is not logged in, show the child component (Login or Register page)
  return <>{children}</>;
}