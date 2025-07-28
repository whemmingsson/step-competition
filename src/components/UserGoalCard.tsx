import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const goalFormSchema = z.object({
  goalType: z.enum(["steps", "meters"]),
  goalValue: z
    .number({ required_error: "Goal value is required" })
    .positive("Goal must be a positive number"),
  stepLength: z
    .number()
    .positive("Step length must be a positive number")
    .optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export const UserGoalCard = () => {
  const [isSaving, setIsSaving] = useState(false);
  // Goal form setup
  const goalForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalType: "steps",
      goalValue: undefined,
      stepLength: 0.75, // Default step length in meters, source: https://www.healthline.com/health/stride-length#average-step-and-stride-length
    },
  });

  const goalType = goalForm.watch("goalType");

  // Handle goal form submission
  const handleGoalSubmit = async (data: GoalFormValues) => {
    setIsSaving(true);
    try {
      console.log("Goal form data:", data);
      toast.success("Goal updated successfully!");
    } catch (error) {
      toast.error("An error occurred while updating your goal");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex gap-x-2">
          Your competition goal
        </CardTitle>
        <CardDescription>
          Set your goal for the current competition in either steps or meters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...goalForm}>
          <form
            onSubmit={goalForm.handleSubmit(handleGoalSubmit)}
            className="space-y-6"
          >
            {/* Goal Type Toggle */}
            <FormField
              control={goalForm.control}
              name="goalType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Goal Type</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === "meters"}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(checked ? "meters" : "steps")
                          }
                        />
                        <Label className="text-sm">
                          {field.value === "steps" ? "Steps" : "Meters"}
                        </Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose whether to set your goal in steps or meters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goal Value */}
            <FormField
              control={goalForm.control}
              name="goalValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Goal ({goalType === "steps" ? "steps" : "meters"})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter your competition goal in ${goalType}`}
                      className="bg-white"
                      {...field}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Set your competition {goalType} goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step Length Field (only shown when meters is selected) */}
            {goalType === "meters" && (
              <FormField
                control={goalForm.control}
                name="stepLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Step Length (meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter your step length in meters"
                        className="bg-white"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps convert your meter goal to steps. Average adult
                      step length is 0.7-0.8 meters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Goal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
