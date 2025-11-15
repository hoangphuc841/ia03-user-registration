import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon, OctagonXIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define the shape of the data from /auth/profile
interface ProfileData {
  email: string;
  sub: string;
}

// The function that useQuery will call
// It uses your central 'api' instance, so auth is automatic
async function fetchProfile(): Promise<ProfileData> {
  const { data } = await api.get('/auth/profile');
  return data;
}

export default function DashboardPage() {
  // Get user from context for a quicker initial display
  const { user } = useAuth();

  // Use React Query to fetch the profile data
  const { data, isLoading, isError, error } = useQuery<ProfileData, Error>({
    queryKey: ['profile'], // Unique key for this query
    queryFn: fetchProfile, // The function to run
  });

  // We use the user from context as a fallback while loading
  const displayEmail = data?.email || user?.email;

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Hello, {displayEmail}!</CardTitle>
          <CardDescription>
            This is your protected dashboard. This data is fetched from a
            protected API endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Live Profile Data</h3>
          {isLoading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Loading profile data...
            </div>
          )}
          {isError && (
            <div className="flex items-center text-destructive">
              <OctagonXIcon className="mr-2 size-4" />
              Could not load profile: {error.message}
            </div>
          )}
          {data && (
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Email:</strong> {data.email}</li>
              <li><strong>User ID:</strong> {data.sub}</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}