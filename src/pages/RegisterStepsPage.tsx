import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { StepService } from "@/services/StepService";
import { PageContainer } from "@/components/PageContainer";
import { useEffect, useMemo, useCallback, useState } from "react";

import { useCompetitions } from "@/hooks/useCompetitions";
import { useUser } from "@/context/user/UserContext";
import { useUserTeam } from "@/hooks/useUserTeam";
import { Link } from "react-router";
import { useUserSteps } from "@/hooks/useUserSteps";
import { CalendarField } from "@/components/forms/CalendarField";
import { useAuth } from "@/context/auth/useAuth";
import { CompetitionSelectorField } from "@/components/forms/CompetitionSelectorField";
import { useCurrentCompetition } from "@/hooks/useCurrentCompetition";
import type { UpdateScheme } from "@/types/UpdateScheme";

// Form validation schema with competition field
const formSchema = z.object({
  competition: z.string({
    required_error: "Please select a competition",
  }),
  steps: z
    .number({ required_error: "Number of steps is required" })
    .positive("Steps must be a positive number greater than zero")
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

export const RegisterStepsPage = () => {
  const { session } = useAuth();
  const { competitions, loading: competitionLoading } = useCompetitions();
  const { user } = useUser();
  const { steps } = useUserSteps(session?.user.id, false); // Fetch user steps to ensure user is loaded
  const { id: userId } = user || {};
  const { data: userTeam, loading: teamLoading } = useUserTeam();
  const { competition } = useCurrentCompetition();
  const [updateScheme, setUpdateScheme] = useState<UpdateScheme>("overwrite");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition: competition?.id || "",
      steps: undefined,
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
      competition: competition?.id ?? "", // Reset to saved competition
    });
  }

  const modifiers = useMemo(() => {
    const map: Record<string, number> = {};
    steps.forEach((step) => {
      const dateKey = format(step.date, "yyyy-MM-dd");
      map[dateKey] = step.steps;
    });
    return {
      highlighted: (date: Date) => format(date, "yyyy-MM-dd") in map,
    };
  }, [steps]);

  const validStartDate = useMemo(() => {
    if (!competition) return new Date();

    if (competition.startDate) return new Date(competition.startDate);
    return new Date("1900-01-01");
  }, [competition]);

  const validEndDate = useMemo(() => {
    if (!competition) return new Date();

    if (competition.endDate) return new Date(competition.endDate);
    return new Date("2100-01-01");
  }, [competition]);

  const getStepsForDate = useCallback(
    (date: Date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const step = steps.find((s) => format(s.date, "yyyy-MM-dd") === dateKey);
      return step ? step.steps : 0;
    },
    [steps]
  );

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
              <CompetitionSelectorField
                currentCompetition={competition}
                control={form.control}
                competitions={competitions}
                competitionLoading={competitionLoading}
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

              <CalendarField
                control={form.control}
                modifiers={modifiers}
                label="Date"
                description="Select the date for your step count"
                validFirstDay={validStartDate}
                validLastDay={validEndDate}
                setUpdateScheme={(v: UpdateScheme) => setUpdateScheme(v)}
                getStepsForDate={getStepsForDate}
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
                        Not part of a team -{" "}
                        <Link to="/team" className="font-bold hover:underline">
                          Click here to create or join one
                        </Link>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your steps also contribute to your team's total
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={competitionLoading || !competition}
              >
                Register Steps
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
