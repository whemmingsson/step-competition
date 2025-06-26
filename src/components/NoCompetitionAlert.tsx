import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const NoCompetitionAlert = () => {
  return (
    <Alert
      variant="default"
      className="mb-2 bg-red-800 text-white border-white/10"
    >
      <AlertTriangle />
      <AlertTitle>No Competition Selected</AlertTitle>
      <AlertDescription className="text-white">
        To use this app you must be part of a competition. If you haven't been
        invited to a competition, please contact the competition organizer or
        administrator.
      </AlertDescription>
    </Alert>
  );
};
