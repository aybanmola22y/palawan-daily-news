"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function DateTimePicker({ date, onChange, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Sync state with props
  React.useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const updatedDate = new Date(newDate);
      if (selectedDate) {
        updatedDate.setHours(selectedDate.getHours());
        updatedDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(updatedDate);
      onChange?.(updatedDate);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    if (type === "hours") {
      newDate.setHours(parseInt(value));
    } else if (type === "minutes") {
      newDate.setMinutes(parseInt(value));
    }
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-9 border-gray-200",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {selectedDate ? (
            <span className="text-gray-900">{format(selectedDate, "PPP p")}</span>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col md:flex-row shadow-xl border-gray-200" align="start">
        <div className="p-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="rounded-md border-0"
          />
        </div>
        <div className="flex flex-col border-t md:border-t-0 md:border-l border-gray-100 p-4 gap-4 bg-gray-50/50">
           <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pick Time</span>
           </div>
           <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Hour</label>
                <Select
                  value={selectedDate ? String(selectedDate.getHours()) : undefined}
                  onValueChange={(v) => handleTimeChange("hours", v)}
                >
                  <SelectTrigger className="w-[75px] h-8 text-xs bg-white">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={String(i)} className="text-xs">
                        {String(i).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Minute</label>
                <Select
                  value={selectedDate ? String(selectedDate.getMinutes()) : undefined}
                  onValueChange={(v) => handleTimeChange("minutes", v)}
                >
                  <SelectTrigger className="w-[75px] h-8 text-xs bg-white">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={String(i)} className="text-xs">
                        {String(i).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
           </div>
           <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center italic">
                {selectedDate ? format(selectedDate, "h:mm a") : "--:--"}
              </p>
           </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
