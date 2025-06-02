import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarIcon, Users } from "lucide-react";
import { StepService } from "@/services/StepService";
import { useAuth } from "@/context/auth/useAuth";
import { PageContainer } from "@/components/PageContainer";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompetitionService } from "@/services/CompetitionService";
import { TeamService } from "@/services/TeamService";
import { SetCompetitionBadge } from "@/components/SetCompetitionBadge";

// Form validation schema with competition field
const formSchema = z.object({
  competition: z.string({
    required_error: "Please select a competition",
  }),
  steps: z
    .number({ required_error: "Number of steps is required" })
    .positive("Steps must be a positive number")
    .int("Steps must be a whole number"),
  date: z
    .date({
      required_error: "Date is required",
    })
    .refine((date) => date <= new Date(), {
      message: "Date cannot be in the future",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterStepsPage() {
  const [competitionLoading, setCompetitionLoading] = useState(false);
  const [competitions, setCompetitions] = useState<
    { id: string; name: string }[]
  >([]);
  const [userTeam, setUserTeam] = useState<{ id: string; name: string } | null>(
    null
  );
  const [teamLoading, setTeamLoading] = useState(false);

  const { session } = useAuth();
  const { id: userId } = session?.user || {};
  // Get saved competition from localStorage on component mount
  const savedCompetition =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedCompetition") ||
        (competitions[0] && competitions[0].id)
      : competitions[0].id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition: savedCompetition,
      steps: 0,
      date: new Date(),
    },
  });

  // Watch for competition changes to save to localStorage
  const selectedCompetition = form.watch("competition");

  useEffect(() => {
    if (selectedCompetition) {
      localStorage.setItem("selectedCompetition", selectedCompetition);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    async function fetchCompetitions() {
      if (!userId) return;

      setCompetitionLoading(true);
      try {
        const result = await CompetitionService.getCompetitions();

        if (result.success && result) {
          setCompetitions(
            (result.data ?? []).map((competition) => ({
              id: String(competition.id),
              name: competition.name ?? "Unnamed Competition",
            }))
          );
        }
      } catch (err) {
        console.error("Error loading display name:", err);
      } finally {
        setCompetitionLoading(false);
      }
    }

    fetchCompetitions();
  }, [userId]);

  // Fetch user's team information
  useEffect(() => {
    async function fetchUserTeam() {
      if (!userId) return;

      setTeamLoading(true);
      try {
        const result = await TeamService.getTeamByUserId();

        if (result.success && result.data) {
          setUserTeam({
            id: String(result.data.id),
            name: result.data.name || "Unnamed Team",
          });
        }
      } catch (err) {
        console.error("Error loading user team:", err);
      } finally {
        setTeamLoading(false);
      }
    }

    fetchUserTeam();
  }, [userId]);

  async function onSubmit(data: FormValues) {
    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    const result = await StepService.recordSteps(data.steps, userId, data.date);
    if (!result.success) {
      toast.error(result.error || "Failed to register steps");
      return;
    }

    toast(`${data.steps} steps registered successfully! 🎉`);

    // Reset form
    form.reset({
      steps: 0,
      date: new Date(),
      competition: savedCompetition, // Reset to saved competition
    });
  }

  return (
    <PageContainer>
      <Card className="w-full" style={{ background: "#ffffffee" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register Your Daily Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Competition Select Field */}
              <FormField
                disabled={competitionLoading}
                control={form.control}
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
                        {competitions.map((competition) => (
                          <SelectItem
                            className="bg-white"
                            key={competition.id}
                            value={competition.id}
                          >
                            {competition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose which competition to record steps for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Steps</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your step count"
                        className="bg-white"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the total number of steps for this day
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the date for your step count
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team display section - outside of form validation */}
              <div className="pt-4 mt-4 border-t ">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Contributing to Team
                  </label>
                  <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm border rounded-md bg-white">
                    <Users className="h-4 w-4 opacity-70" />
                    {teamLoading ? (
                      <span className="text-muted-foreground">
                        Loading team information...
                      </span>
                    ) : userTeam ? (
                      <span>{userTeam.name}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        Not part of a team
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your steps also contribute to your team's total
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Register Steps
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
