import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Week } from "@/lib/constants";
// import Hide from "./hide";

// Format a date as Mmm dd, yyyy
const formatDate = (date: string): string => {
  const dateString = new Date(date).toDateString();
  const parts = dateString.split(" ").slice(1, 3);

  // If date starts with 0 drop it eg. Jan 4 -> Jan 4
  if (parts[1] && parts[1][0] == "0") {
    parts[1] = parts[1][1];
  }

  const formattedDate = parts.join(" ");
  return formattedDate;
};

// Calculate and format date of most conversations
const getMaxDate = (conversations: number[]) => {
  const max = Math.max(...conversations);
  const maxDayIndex = conversations.findIndex((x) => x == max);
  const maxDate = formatDate(new Date(2022, 0, maxDayIndex).toDateString());
  const maxDatePosition =
    maxDayIndex > 240 ? "left-2/3" : maxDayIndex > 120 ? "left-1/3" : "left-0";

  return { max, maxDate, maxDatePosition };
};

/**
 * Graph of chat since Jan 1
 */
function Heatmap({ conversationHistory }: { conversationHistory: Week[] }) {
  const conversations: number[] = [];
  const colors: Record<number, string> = {};

  // Creating local variable to simplify calling in .map()
  const weeks = conversationHistory;

  // Get array of contribution counts
  weeks.map((week) => {
    week.contributionDays.map((day) =>
      conversations.push(day.contributionCount)
    );
  });

  // Get max contribution value and its date
  const { max /* , maxDate */ } = getMaxDate(conversations);

  // Get array of unique contribution values (ascending)
  const unique = conversations.filter((x, i, a) => a.indexOf(x) === i).sort();

  // Divide each value with max and round to nearest quarter
  unique.map((value) => {
    const normalized = value / max;
    const rounded = Math.ceil(normalized / 0.25) * 0.25;

    // Assign color for each case
    if (value === max) colors[value] = "bg-yellow-500/90";
    else if (rounded === 0) colors[value] = "bg-gray-300";
    else if (rounded === 0.25) colors[value] = "bg-indigo-300/90";
    else if (rounded === 0.5) colors[value] = "bg-indigo-500/90";
    else if (rounded === 0.75) colors[value] = "bg-indigo-700/90";
    else if (rounded === 1) colors[value] = "bg-indigo-900/90";
  });

  return (
    <div className="p-5 w-full flex flex-col items-start group relative self-center">
      <div className="grid gap-0.5 heatmap w-full self-center">
        {/* Placeholders to account for the year starting on a Saturday */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-300" content="" />
        ))}
        {/* Weeks */}
        {weeks.map(
          (week: {
            contributionDays: {
              contributionCount: string | number;
              date: string;
            }[];
          }) =>
            week.contributionDays.map(
              (
                day: { contributionCount: string | number; date: string },
                j: React.Key | null | undefined
              ) => (
                // <Tooltip
                //   key={j}
                //   content={`${day.contributionCount} conversations on ${formatDate(
                //     day.date
                //   )}`}
                // >
                //   <div
                //     key={j}
                //     className={`h-3 w-3 ${
                //       colors[day.contributionCount]
                //     } hover:scale-[2]`}
                //   />
                // </Tooltip>

                <TooltipProvider key={j}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-3 w-3 ${
                          colors[day.contributionCount as number]
                        } hover:scale-[2]`}
                        content=""
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {day.contributionCount} chats on {formatDate(day.date)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )
        )}
      </div>
    </div>
  );
}

export default Heatmap;
