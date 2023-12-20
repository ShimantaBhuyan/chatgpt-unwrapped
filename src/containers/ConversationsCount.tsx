import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, Title, LineChart } from "@tremor/react";
import {
  parseISO,
  getDayOfYear,
  getISOWeek,
  getMonth,
  format,
  getDay,
  startOfWeek,
  setDayOfYear,
} from "date-fns";
import { useState, useEffect } from "react";
import Heatmap from "./Heatmap";
import { Week } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";

interface Conversation {
  id: string;
  title: string;
  create_time: string;
  update_time: string;
  mapping: unknown | null;
  current_node: unknown | null;
  conversation_template_id: unknown | null;
  gizmo_id: unknown | null;
  is_archived: boolean;
  workspace_id: unknown | null;
}

export const ConversationsCount = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  const [dailyGroups, setDailyGroups] = useState<DailyResponse[]>([]);
  const [weeklyGroups, setWeeklyGroups] = useState<WeeklyResponse[]>([]);
  const [monthlyGroups, setMonthlyGroups] = useState<MonthlyResponse[]>([]);
  const [isMobile] = useLocalStorage<boolean>("IS_MOBILE", undefined, true);
  console.log({ isMobile });

  type DailyResponse = { day: string; Conversations: number };
  type WeeklyResponse = { week: string; Conversations: number };
  type MonthlyResponse = { month: string; Conversations: number };

  // Define a function to generate time series based on the time unit
  function generateTimeSeries(
    data: Conversation[],
    timeUnit: "day" | "week" | "month"
  ) {
    const timeSeries: (DailyResponse | WeeklyResponse | MonthlyResponse)[] = [];

    // Group conversations by day, week, or month
    const groupedConversations = data.reduce((acc, item) => {
      const create_time = parseISO(item.create_time);
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

  useEffect(() => {
    // Example usage:
    const dailyGroups = generateTimeSeries(
      conversations,
      "day"
    ) as DailyResponse[];
    const weeklyGroups = generateTimeSeries(
      conversations,
      "week"
    ) as WeeklyResponse[];
    const monthlyGroups = generateTimeSeries(
      conversations,
      "month"
    ) as MonthlyResponse[];

    console.log({ dailyGroups, weeklyGroups, monthlyGroups });
    setDailyGroups(dailyGroups);
    setWeeklyGroups(weeklyGroups);
    setMonthlyGroups(monthlyGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function convertToWeeks(
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

    // Convert grouped data to an array of weeks
    console.log(groupedByWeek);
    return Object.values(groupedByWeek);
  }

  return (
    <div className="flex flex-col w-full">
      <Tabs defaultValue="month" className="w-full">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-xl">
            ChatGPT in Motion: Tracking Conversation Fluctuations
          </h2>
          <TabsList>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="day">Daily</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="day" className="w-full flex justify-center">
          {!isMobile ? (
            <Card className="w-full flex flex-col gap-5 justify-center">
              <Title>Your Conversations with ChatGPT by day</Title>

              <Heatmap conversationHistory={convertToWeeks(dailyGroups)} />
            </Card>
          ) : (
            <ConversationCountChart chartdata={dailyGroups} chartType="day" />
          )}
        </TabsContent>
        <TabsContent value="week">
          <ConversationCountChart chartdata={weeklyGroups} chartType="week" />
        </TabsContent>
        <TabsContent value="month">
          <ConversationCountChart chartdata={monthlyGroups} chartType="month" />
        </TabsContent>
      </Tabs>

      {/* <ConversationCountChart chartdata={dailyGroups} chartType="day" />
        <ConversationCountChart chartdata={weeklyGroups} chartType="week" />
        <ConversationCountChart chartdata={monthlyGroups} chartType="month" /> */}
    </div>
  );
};

const ConversationCountChart = ({
  chartdata,
  chartType,
}: {
  chartdata: unknown[];
  chartType: string;
}) => {
  //   const valueFormatter = (number: number) =>
  //     `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  const chartColor =
    chartType === "day" ? "emerald" : chartType === "week" ? "indigo" : "lime";

  return (
    <Card className="w-full">
      <Title>Your Conversations with ChatGPT by {chartType}</Title>
      <LineChart
        className="mt-6"
        data={chartdata}
        index={chartType}
        categories={["Conversations"]}
        colors={[chartColor]}
        // valueFormatter={valueFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};
