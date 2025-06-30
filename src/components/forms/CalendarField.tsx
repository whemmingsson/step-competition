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
import { useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import type { UpdateScheme } from "@/types/UpdateScheme";

interface CalendarFieldProps {
  label?: string; // Optional label for the calendar field
  description?: string; // Optional description for the calendar field
  defaultValueText?: string; // Default text to display in the calendar field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // Control object from react-hook-form
  modifiers: {
    highlighted: (date: Date) => boolean;
  };
  validFirstDay?: Date; // Optional valid first day for the calendar
  validLastDay?: Date; // Optional valid last day for the calendar
  setUpdateScheme?: (scheme: UpdateScheme) => void; // Optional function to set update scheme state
  getStepsForDate?: (date: Date) => number; // Optional function to get steps for a specific date
}

export const CalendarField = ({
  label,
  description,
  control,
  modifiers,
  validFirstDay,
  validLastDay,
  setUpdateScheme,
  getStepsForDate,
}: CalendarFieldProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [dateHasData, setDateHasData] = useState(false);
  const [dateSelectionMode, setDateSelectionMode] =
    useState<UpdateScheme>("new");

  const setScheme = (scheme: UpdateScheme) => {
    setUpdateScheme?.(scheme);
    setDateSelectionMode(scheme);
  };

  // Update your date selection handler
  const onSelect = (
    date: Date | undefined,
    field: ControllerRenderProps<FieldValues, "date">
  ) => {
    //setSelectedDay(day);
    field.onChange(date); // Update the form field value with the selected date
    setSelectedDay(date);

    // Check if the day has data using modifiers
    if (!date) {
      setDateHasData(false);
      setScheme("new");
      return;
    }

    const hasData = modifiers.highlighted?.(date) ?? false;
    setDateHasData(hasData);
    if (hasData) {
      setScheme("overwrite");
    } else {
      setScheme("new");
    }
  };
  return (
    <div>
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
                  //onSelect={field.onChange}
                  onSelect={(value: Date | undefined) => onSelect(value, field)}
                  disabled={(date) =>
                    date > new Date() ||
                    date < new Date("1900-01-01") ||
                    date < (validFirstDay ?? new Date("1900-01-01")) ||
                    date > (validLastDay ?? new Date())
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
      {dateHasData && (
        <div className="mt-4 p-3 border rounded-md bg-yellow-50 border-amber-200">
          <div className="text-sm font-medium mb-2">
            This date already has data (
            {selectedDay ? getStepsForDate?.(selectedDay) + " steps" : ""}).
            What would you like to do?
          </div>
          <RadioGroup
            value={dateSelectionMode}
            onValueChange={(value) => {
              setScheme(value as UpdateScheme);
            }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overwrite" id="overwrite" />
              <Label htmlFor="overwrite" className="font-normal">
                Overwrite existing data
                <p className="text-xs text-muted-foreground mt-0.5">
                  Replace the previously recorded steps for this date
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add" className="font-normal">
                Add to existing data
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add these steps to your current total for this date
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};
