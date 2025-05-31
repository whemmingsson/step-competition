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
import { CalendarIcon } from "lucide-react";
import { StepService } from "@/services/StepService";
import { useAuth } from "@/context/auth/useAuth";
import { PageContainer } from "@/components/PageContainer";

// Form validation schema
const formSchema = z.object({
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
  const { session } = useAuth();
  const { id: userId } = session?.user || {};
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      steps: 0,
      date: new Date(),
    },
  });

  async function onSubmit(data: FormValues) {
    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    console.log("Form data:", data);

    await StepService.recordSteps(data.steps, userId, data.date);
    toast("Steps registered successfully!");

    // Reset form
    form.reset({
      steps: 0,
      date: new Date(),
    });
  }

  return (
    <PageContainer>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register Your Daily Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
