import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth/useAuth";
import { StepService } from "@/services/StepService";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/PageContainer";
import { UserService } from "@/services/UserService";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepRecord {
  id: number;
  user_id: string;
  steps: number;
  date: string;
  created_at: string;
}

export default function UserPage() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [steps, setSteps] = useState<StepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Display name state
  const [displayName, setDisplayName] = useState("");
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUserSteps() {
      if (!userId) return;

      setLoading(true);
      try {
        const result = await StepService.getUserSteps(userId);

        if (result.success && result.data) {
          setSteps(result.data as StepRecord[]);
        } else {
          setError(result.error || "Failed to load step data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSteps();
  }, [userId, session]);

  // Fetch current display name
  useEffect(() => {
    async function fetchDisplayName() {
      if (!userId) return;

      setDisplayNameLoading(true);
      try {
        const result = await UserService.getDisplayName(userId);

        if (result.success && result.displayName) {
          setDisplayName(result.displayName);
        }
      } catch (err) {
        console.error("Error loading display name:", err);
      } finally {
        setDisplayNameLoading(false);
      }
    }

    fetchDisplayName();
  }, [userId]);

  // Handle display name update
  const handleUpdateDisplayName = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to update your display name");
      return;
    }

    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const result = await UserService.setDisplayName(userId, displayName);

      if (result.success) {
        toast.success("Display name updated successfully!");
      } else {
        toast.error(`Failed to update display name: ${result.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while updating your display name");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate total steps
  const totalSteps = steps.reduce((sum, record) => sum + record.steps, 0);

  return (
    <PageContainer>
      {/* Display name card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Profile</CardTitle>
          <CardDescription>
            Set your display name for the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateDisplayName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your preferred display name"
                disabled={displayNameLoading || isSaving}
              />
            </div>
            <Button
              type="submit"
              disabled={displayNameLoading || isSaving || !displayName.trim()}
            >
              {isSaving ? "Saving..." : "Save Display Name"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Your Step History
          </CardTitle>
          <CardDescription className="text-center">
            Track your progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No step data available. Start recording your steps!
            </div>
          ) : (
            <>
              <div className="text-lg font-medium mb-4 text-center">
                Total Steps: {totalSteps.toLocaleString()}
              </div>
              <Table>
                <TableCaption>A history of your recorded steps</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Steps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.date), "PPP")}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {record.steps.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
