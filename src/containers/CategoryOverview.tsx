import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TEST_CATEGORISED_TITLES } from "@/lib/constants";
import {
  BarList,
  Bold,
  Card,
  Flex,
  Text,
  //   Title,
} from "@tremor/react";
import { useEffect, useState } from "react";

export const CategoryOverview = () => {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);

  const [top5Data, setTop5Data] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    // TODO: make api call to get categories OR get fromearlier api call response
    // remove conversations with topic "New chat" : not needed if filtered when sending titles itself
    const groupedConversations = TEST_CATEGORISED_TITLES;

    const categories = Object.keys(groupedConversations);
    const sortedData = categories
      .map((category) => {
        return {
          name: category,
          // @ts-expect-error: damn typescript!
          value: groupedConversations[category].length,
        };
      })
      .sort((a, b) => b.value - a.value);
    // set top 5 only
    setTop5Data(sortedData.slice(0, 5));
    setData(sortedData);
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* <h2 className="lg:text-xl">
        Unveiling your interests: Your Top 5 Chat Categories
      </h2> */}

      <Tabs defaultValue="top" className="w-full">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-xl">
            Unveiling your interests: Your Top Chat Categories
          </h2>
          <TabsList>
            <TabsTrigger value="top">Top 5</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="top">
          <Card className="w-full">
            {/* <Title>Trending Topics: What You Discussed Most on ChatGPT</Title> */}
            <Flex className="mt-4">
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Visits</Bold>
              </Text>
            </Flex>
            <BarList data={top5Data} className="mt-2" />
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card className="w-full">
            {/* <Title>Trending Topics: What You Discussed Most on ChatGPT</Title> */}
            <Flex className="mt-4">
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text className="mr-5">
                <Bold>Visits</Bold>
              </Text>
            </Flex>
            <BarList data={data} className="mt-2 overflow-auto max-h-96 pr-3" />
          </Card>
        </TabsContent>
      </Tabs>

      {/* <Card className="w-full">
        <Flex className="mt-4">
          <Text>
            <Bold>Source</Bold>
          </Text>
          <Text>
            <Bold>Visits</Bold>
          </Text>
        </Flex>
        <BarList data={data} className="mt-2" />
      </Card> */}
    </div>
  );
};
