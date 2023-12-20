import Counter from "@/components/Counter";
import { Card, Grid, Text } from "@tremor/react";
import {
  parseISO,
  getDayOfYear,
  getISOWeek,
  format,
  startOfYear,
  addDays,
} from "date-fns";

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

const MostActiveCount = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  // Define types for most active insights
  type MostActiveDays = { day: string; Conversations: number };
  type MostActiveWeeks = { week: string; Conversations: number };
  type MostActiveMonths = { month: string; Conversations: number };

  // Define a function to find the most active days, weeks, and months
  function findMostActivePeriods(data: Conversation[]): {
    mostActiveDays: MostActiveDays;
    mostActiveWeeks: MostActiveWeeks;
    mostActiveMonths: MostActiveMonths;
  } {
    // Group conversations by day, week, and month
    const groupedConversationsByDay: Record<string, number> = data.reduce(
      (acc, item) => {
        const create_time = parseISO(item.create_time.toString());
        const key = `Day ${getDayOfYear(create_time)}`;

        //   @ts-expect-error: damn typescript!
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    const groupedConversationsByWeek: Record<string, number> = data.reduce(
      (acc, item) => {
        const create_time = parseISO(item.create_time.toString());
        const key = `Week ${getISOWeek(create_time)}`;
        //   @ts-expect-error: damn typescript!
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    const groupedConversationsByMonth: Record<string, number> = data.reduce(
      (acc, item) => {
        const create_time = parseISO(item.create_time.toString());
        const key = format(create_time, "MMMM");
        //   @ts-expect-error: damn typescript!
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    // Find the most active days, weeks, and months
    const mostActiveDays: MostActiveDays = Object.entries(
      groupedConversationsByDay
    ).reduce(
      (max, [day, count]) =>
        count > max.Conversations ? { day, Conversations: count } : max,
      { day: "", Conversations: 0 }
    );
    const yearStart = startOfYear(new Date(2023, 2, 1));
    const dateOfYear = addDays(
      yearStart,
      parseInt(mostActiveDays.day.substring(4)) - 1
    );
    mostActiveDays.day = format(dateOfYear, "d MMM, yyyy");

    const mostActiveWeeks: MostActiveWeeks = Object.entries(
      groupedConversationsByWeek
    ).reduce(
      (max, [week, count]) =>
        count > max.Conversations ? { week, Conversations: count } : max,
      { week: "", Conversations: 0 }
    );

    const mostActiveMonths: MostActiveMonths = Object.entries(
      groupedConversationsByMonth
    ).reduce(
      (max, [month, count]) =>
        count > max.Conversations ? { month, Conversations: count } : max,
      { month: "", Conversations: 0 }
    );

    return { mostActiveDays, mostActiveWeeks, mostActiveMonths };
  }

  const mostActiveInsights = findMostActivePeriods(conversations);

  return mostActiveInsights;
};

export const ConversationsCountOverview = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  const insights = MostActiveCount({ conversations });
  const categories = [
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
  ];
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
              <Counter value={item.metric} classes="text-3xl font-medium" />
              <p className="text-sm text-gray-500">convos</p>
            </div>
            <Text>{item.date}</Text>
          </Card>
        ))}
      </Grid>
    </div>
  );
};
