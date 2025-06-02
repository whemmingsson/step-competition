import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface UserHistoryCardProps {
  steps: { id: number; date: string; steps: number }[];
  totalSteps: number;
  loading: boolean;
  error: string | null;
  handleDeleteClick: (record: { id: number }) => void;
}

export const UserHistoryCard = ({
  steps,
  totalSteps,
  loading,
  error,
  handleDeleteClick,
}: UserHistoryCardProps) => {
  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
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
                  <TableHead></TableHead>
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
                    <TableCell className="text-right">
                      {" "}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(record)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};
