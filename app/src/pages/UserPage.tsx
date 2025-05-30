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

interface StepRecord {
  id: number;
  uid: string;
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

  // Calculate total steps
  const totalSteps = steps.reduce((sum, record) => sum + record.steps, 0);

  return (
    <div className="container max-w-xl py-10 flex min-h-screen items-center justify-center">
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
    </div>
  );
}
