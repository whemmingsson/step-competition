import { format } from "date-fns/format";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

interface CalendarFieldProps {
  label?: string; // Optional label for the calendar field
  description?: string; // Optional description for the calendar field
  defaultValueText?: string; // Default text to display in the calendar field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // Control object from react-hook-form
  modifiers: {
    highlighted: (date: Date) => boolean;
  };
}

export const CalendarField = ({
  label,
  description,
  control,
  modifiers,
}: CalendarFieldProps) => {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
                weekStartsOn={1} // Monday as the first day of the week
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                modifiers={modifiers}
                modifiersClassNames={{
                  highlighted: "calendar-day-highlighted",
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
