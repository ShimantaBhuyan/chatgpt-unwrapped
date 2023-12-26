import Counter from "@/components/Counter";
import {
  Conversation,
  DailyResponse,
  MonthlyResponse,
  WeeklyResponse,
} from "@/lib/constants";
import { findMostActivePeriods } from "@/lib/utils";
import { Card, Grid, Text } from "@tremor/react";
import { useEffect, useState } from "react";

export const ConversationsCountOverview = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  const [insights, setInsights] = useState<{
    mostActiveDays: DailyResponse;
    mostActiveWeeks: WeeklyResponse;
    mostActiveMonths: MonthlyResponse;
  }>();

  useEffect(() => {
    const insights = findMostActivePeriods(conversations);
    setInsights(insights);
  }, [conversations]);

  // const categories = [
  //   {
  //     title: "Most Active Day",
  //     metric: insights.mostActiveDays.Conversations,
  //     date: insights.mostActiveDays.day,
  //   },
  //   {
  //     title: "Most Active Week",
  //     metric: insights.mostActiveWeeks.Conversations,
  //     date: insights.mostActiveWeeks.week,
  //   },
  //   {
  //     title: "Most Active Month",
  //     metric: insights.mostActiveMonths.Conversations,
  //     date: insights.mostActiveMonths.month,
  //   },
  // ];

  const [categories, setCategories] = useState([
    {
      title: "Most Active Day",
      metric: insights?.mostActiveDays.Conversations,
      date: insights?.mostActiveDays.day,
    },
    {
      title: "Most Active Week",
      metric: insights?.mostActiveWeeks.Conversations,
      date: insights?.mostActiveWeeks.week,
    },
    {
      title: "Most Active Month",
      metric: insights?.mostActiveMonths.Conversations,
      date: insights?.mostActiveMonths.month,
    },
  ]);

  useEffect(() => {
    if (insights) {
      setCategories([
        {
          title: "Most Active Day",
          metric: insights.mostActiveDays.Conversations,
          date: insights.mostActiveDays.day,
        },
        {
          title: "Most Active Week",
          metric: insights.mostActiveWeeks.Conversations,
          date: insights.mostActiveWeeks.week,
        },
        {
          title: "Most Active Month",
          metric: insights.mostActiveMonths.Conversations,
          date: insights.mostActiveMonths.month,
        },
      ]);
    }
  }, [insights]);

  return (
    <div className="w-full flex flex-col gap-5">
      <h2 className="lg:text-xl">
        When You Chatted the Most: breakdown by day, week and month
      </h2>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {categories.map((item) => (
          <Card
            key={item.title}
            className="space-y-5"
            decoration="bottom"
            decorationColor="emerald"
          >
            <Text className="text-lg text-black">{item.title}</Text>
            <div className="flex gap-2 items-end">
              {/* <Metric>{item.metric}</Metric> */}
              <Counter
                value={item.metric ?? 0}
                classes="text-3xl font-medium"
              />
              <p className="text-sm text-gray-500">convos</p>
            </div>
            <Text>{item.date}</Text>
          </Card>
        ))}
      </Grid>
    </div>
  );
};
