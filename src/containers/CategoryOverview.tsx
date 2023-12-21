import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarList,
  Bold,
  Card,
  Flex,
  Text,
  //   Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

export const CategoryOverview = () => {
  const { getAll } = useIndexedDB("chatgpt-unwrapped");
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);

  const [top5Data, setTop5Data] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    getAll().then((data) => {
      const groupedConversations = data[data.length - 1]?.categorised;

      const categories = Object.keys(groupedConversations);
      const sortedData = categories
        .map((category) => {
          return {
            name: category,
            value: groupedConversations[category].length,
          };
        })
        .sort((a, b) => b.value - a.value);
      // set top 5 only
      setTop5Data(sortedData.slice(0, 5));
      setData(sortedData);
    });
    // const groupedConversations = TEST_CATEGORISED_TITLES;
  }, [getAll]);

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
            <BarList
              data={top5Data}
              className="mt-2"
              color={"#46796233"}
              showAnimation
            />
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
            <BarList
              data={data}
              className="mt-2 overflow-auto max-h-96 pr-3"
              color={"#46796233"}
              showAnimation
            />
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
