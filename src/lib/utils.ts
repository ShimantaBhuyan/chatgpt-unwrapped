import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  getDayOfYear,
  getISOWeek,
  getMonth,
  format,
  startOfYear,
  addDays,
  setDayOfYear,
  startOfWeek,
  getDay,
} from "date-fns";
import {
  Conversation,
  DailyResponse,
  WeeklyResponse,
  MonthlyResponse,
  Week,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSeries(
  data: Conversation[],
  timeUnit: "day" | "week" | "month"
) {
  const timeSeries: (DailyResponse | WeeklyResponse | MonthlyResponse)[] = [];

  // Group conversations by day, week, or month
  const groupedConversations = data.reduce((acc, item) => {
    const create_time = new Date(item.create_time);
    const key =
      timeUnit === "day"
        ? getDayOfYear(create_time)
        : timeUnit === "week"
          ? getISOWeek(create_time)
          : getMonth(create_time);

    // @ts-expect-error: damn typescript!
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Populate the time series array based on the time unit
  for (
    let i = 1;
    i <= (timeUnit === "day" ? 365 : timeUnit === "week" ? 52 : 12);
    i++
  ) {
    const Conversations =
      // @ts-expect-error: damn typescript!
      groupedConversations[timeUnit === "month" ? i - 1 : i] || 0;
    const key =
      timeUnit === "day"
        ? `Day ${i}`
        : timeUnit === "week"
          ? `Week ${i}`
          : format(new Date(2023, i - 1, 1), "MMMM");

    if (timeUnit === "day") {
      timeSeries.push({ day: key, Conversations });
    } else if (timeUnit === "week") {
      timeSeries.push({ week: key, Conversations });
    } else {
      timeSeries.push({ month: key, Conversations });
    }
  }

  return timeSeries;
}

export function findMostActivePeriods(data: Conversation[]): {
  mostActiveDays: DailyResponse;
  mostActiveWeeks: WeeklyResponse;
  mostActiveMonths: MonthlyResponse;
} {
  // Group conversations by day, week, and month
  const groupedConversationsByDay: Record<string, number> = data.reduce(
    (acc, item) => {
      const create_time = new Date(item.create_time.toString());
      const key = `Day ${getDayOfYear(create_time)}`;

      //   @ts-expect-error: damn typescript!
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const groupedConversationsByWeek: Record<string, number> = data.reduce(
    (acc, item) => {
      const create_time = new Date(item.create_time.toString());
      const key = `Week ${getISOWeek(create_time)}`;
      //   @ts-expect-error: damn typescript!
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const groupedConversationsByMonth: Record<string, number> = data.reduce(
    (acc, item) => {
      const create_time = new Date(item.create_time.toString());
      const key = format(create_time, "MMMM");
      //   @ts-expect-error: damn typescript!
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  // Find the most active days, weeks, and months
  // const mostActiveDays: DailyResponse = Object.entries(
  //   groupedConversationsByDay
  // ).reduce(
  //   (max, [day, count]) =>
  //     count > max.Conversations ? { day, Conversations: count } : max,
  //   { day: "", Conversations: 0 }
  // );
  // Sort groupedConversationsByDay by the number of conversations in descending order and get the first entry
  const mostActiveDays: DailyResponse = Object.entries(
    groupedConversationsByDay
  ).reduce(
    (max: DailyResponse, [day, count]) =>
      count > max.Conversations ? { day, Conversations: count } : max,
    { day: "", Conversations: 0 }
  );
  const yearStart = startOfYear(new Date(2023, 2, 1));
  const dateOfYear = addDays(
    yearStart,
    parseInt(mostActiveDays.day.substring(4)) - 1
  );
  mostActiveDays.day = format(dateOfYear, "d MMM, yyyy");

  const mostActiveWeeks: WeeklyResponse = Object.entries(
    groupedConversationsByWeek
  ).reduce(
    (max, [week, count]) =>
      count > max.Conversations ? { week, Conversations: count } : max,
    { week: "", Conversations: 0 }
  );

  const mostActiveMonths: MonthlyResponse = Object.entries(
    groupedConversationsByMonth
  ).reduce(
    (max, [month, count]) =>
      count > max.Conversations ? { month, Conversations: count } : max,
    { month: "", Conversations: 0 }
  );

  return { mostActiveDays, mostActiveWeeks, mostActiveMonths };
}

export function convertToWeeks(
  data: { day: string; Conversations: number }[]
): Week[] {
  // Group data by weeks by starting date of each week
  const groupedByWeek = data.reduce(
    (acc, entry) => {
      const date = setDayOfYear(
        new Date(2023, 1, 1),
        parseInt(entry.day.substring(3))
      );
      const weekStartDate = format(startOfWeek(new Date(date)), "yyyy-MM-dd");
      if (!acc[weekStartDate]) {
        acc[weekStartDate] = { contributionDays: [] };
      }
      acc[weekStartDate].contributionDays.push({
        contributionCount: entry.Conversations,
        date: format(date, "yyyy-MM-dd"),
        weekday: getDay(new Date(date)),
      });
      return acc;
    },
    {} as Record<string, Week>
  );

  return Object.values(groupedByWeek);
}
