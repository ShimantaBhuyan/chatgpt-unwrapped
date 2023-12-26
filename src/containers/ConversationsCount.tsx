import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, Title, LineChart } from "@tremor/react";
import { useState, useEffect } from "react";
import Heatmap from "./Heatmap";
import {
  Conversation,
  DailyResponse,
  MonthlyResponse,
  WeeklyResponse,
} from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import { convertToWeeks, generateTimeSeries } from "@/lib/utils";

export const ConversationsCount = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  const [dailyGroups, setDailyGroups] = useState<DailyResponse[]>([]);
  const [weeklyGroups, setWeeklyGroups] = useState<WeeklyResponse[]>([]);
  const [monthlyGroups, setMonthlyGroups] = useState<MonthlyResponse[]>([]);
  const [isMobile] = useLocalStorage<boolean>("IS_MOBILE", undefined, true);

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

    setDailyGroups(dailyGroups);
    setWeeklyGroups(weeklyGroups);
    setMonthlyGroups(monthlyGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Tabs defaultValue="month" className="w-full">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-xl">Your ChatGPT conversations in Motion</h2>
          <TabsList>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="day">Daily</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="day" className="w-full flex justify-center">
          {!isMobile ? (
            <Card className="w-full flex flex-col gap-5 justify-center max-w-[75%]">
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
        showAnimation
      />
    </Card>
  );
};
