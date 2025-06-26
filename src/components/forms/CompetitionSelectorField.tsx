import type { Competition } from "@/types/Competition";
import { SetCompetitionBadge } from "../SetCompetitionBadge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

export interface CompetitionSelectorFieldProps {
  currentCompetition?: Competition;
  competitions: Competition[];
  competitionLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}
export const CompetitionSelectorField = ({
  currentCompetition,
  competitions,
  competitionLoading,
  control,
}: CompetitionSelectorFieldProps) => {
  const competition = currentCompetition;

  const mode = import.meta.env.VITE_COMPETITION_MODE;
  if (mode === "invite-only") {
    if (competition) {
      return (
        <FormField
          name="competitionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competition Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={competition?.name || ""}
                  className="bg-muted/40 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </FormControl>
              <FormDescription>
                This is the name of the competition you're participating in
              </FormDescription>
            </FormItem>
          )}
        />
      );
    }
    return (
      <p className="border-2 border-red-400 p-4 text-red-500">
        No competition found
      </p>
    );
  }

  return (
    <FormField
      disabled={competitionLoading}
      control={control}
      name="competition"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Select Competition <SetCompetitionBadge />
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl className="bg-white">
              <SelectTrigger>
                <SelectValue placeholder="Select a competition" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {competitions.map((competition) => {
                let isActive = false;
                if (!competition.startDate || !competition.endDate) {
                  isActive = false; // If no dates, assume inactive
                } else {
                  const now = new Date();
                  const start = new Date(competition.startDate);
                  const end = new Date(competition.endDate);
                  isActive = now >= start && now <= end;
                }
                return (
                  <SelectItem
                    className="bg-white"
                    key={competition.id}
                    value={competition.id}
                    disabled={!isActive}
                  >
                    {competition.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormDescription>
            Choose which competition to record steps for
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
