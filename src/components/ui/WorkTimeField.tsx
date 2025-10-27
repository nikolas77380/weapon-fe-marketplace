"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface WorkTimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  showNonWorkingCheckbox?: boolean;
}

const WorkTimeField: React.FC<WorkTimeFieldProps> = ({
  label,
  value,
  onChange,
  className = "",
  showNonWorkingCheckbox = true,
}) => {
  const t = useTranslations("Settings.workTime");
  const [isClosed, setIsClosed] = useState(
    value === "closed" && showNonWorkingCheckbox
  );
  const [startTime, setStartTime] = useState(
    value && value !== "closed" ? value.split("-")[0] || "09:00" : "09:00"
  );
  const [endTime, setEndTime] = useState(
    value && value !== "closed" ? value.split("-")[1] || "18:00" : "18:00"
  );

  const handleClosedChange = (checked: boolean) => {
    setIsClosed(checked);
    if (checked) {
      onChange("closed");
    } else {
      onChange(`${startTime}-${endTime}`);
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (!isClosed || !showNonWorkingCheckbox) {
      onChange(`${time}-${endTime}`);
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (!isClosed || !showNonWorkingCheckbox) {
      onChange(`${startTime}-${time}`);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      <div className="flex items-center gap-4">
        {/* Time inputs */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              disabled={isClosed}
              className={`w-24 h-10 text-sm border-gray-300 focus:border-gold-main focus:ring-gold-main disabled:bg-gray-100 disabled:text-gray-500 ${
                !isClosed ? "[&::-webkit-calendar-picker-indicator]:hidden" : ""
              }`}
            />
            {!isClosed && (
              <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            )}
          </div>

          <span className="text-gray-500">-</span>

          <div className="relative">
            <Input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              disabled={isClosed}
              className={`w-24 h-10 text-sm border-gray-300 focus:border-gold-main focus:ring-gold-main disabled:bg-gray-100 disabled:text-gray-500 ${
                !isClosed ? "[&::-webkit-calendar-picker-indicator]:hidden" : ""
              }`}
            />
            {!isClosed && (
              <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Closed checkbox - only show for weekends */}
        {showNonWorkingCheckbox && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`closed-${label}`}
              checked={isClosed}
              onCheckedChange={handleClosedChange}
              className="border-gray-300 focus:ring-gold-main focus:ring-offset-0 data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white"
            />
            <Label
              htmlFor={`closed-${label}`}
              className="text-sm text-gray-600 cursor-pointer"
            >
              {t("nonWorking")}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkTimeField;
