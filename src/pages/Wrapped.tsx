import { useEffect, useRef, useState } from "react";
import { getYear } from "date-fns";
import { toPng } from "html-to-image";
import {
  Conversation,
  DailyResponse,
  MonthlyResponse,
  WeeklyResponse,
} from "@/lib/constants";
import { useIndexedDB } from "react-indexed-db-hook";
// import useLocalStorage from "@/lib/use-local-storage";
import { ConversationsCount } from "@/containers/ConversationsCount";
import { ConversationsCountOverview } from "@/containers/ConversationsCountOverview";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CategoryOverview } from "@/containers/CategoryOverview";
import Counter from "@/components/Counter";
import Logo from "@/assets/logo.svg?react";
import {
  convertToWeeks,
  findMostActivePeriods,
  generateTimeSeries,
} from "@/lib/utils";
import Heatmap from "@/containers/Heatmap";

const Wrapped = () => {
  const { getByID } = useIndexedDB("chatgpt-unwrapped");
  //   const [key, _] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [allConversationsCount, setAllConversationsCount] = useState(0);
  const [allCategoriesCount, setAllCategoriesCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userTitle, setUserTitle] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  //   const [totalMinutesSpent, setTotalMinutesSpent] = useState(0);

  const [insights, setInsights] = useState<{
    mostActiveDays: DailyResponse;
    mostActiveWeeks: WeeklyResponse;
    mostActiveMonths: MonthlyResponse;
  }>();

  const [top5Data, setTop5Data] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    getByID(1).then((data) => {
      setAllConversationsCount(data.conversations.length);
      setAllCategoriesCount(Object.keys(data.categorised).length);
      //   const totalTimeSpent = calculateTotalMinutesSpent(data.conversations);
      //   setTotalMinutesSpent(totalTimeSpent);
      const filteredData = data.conversations.filter((item: Conversation) => {
        // Use the getYear method from date-fns to get the year from the create_time property
        const year = getYear(new Date(item.create_time));
        // Check if the year is 2023
        return year === 2023;
      });
      setConversations(filteredData);
      setUserTitle(data.userTitle);
      const insights = findMostActivePeriods(data.conversations);
      setInsights(insights);

      const groupedConversations = data.categorised;

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
    });
  }, [getByID]);

  //   LOGIC INCORRECT, TODO LATER
  //   const calculateTotalMinutesSpent = (conversations: Conversation[]) => {
  //     console.log({ conversations });
  //     let totalMinutesSpent = 0;
  //     conversations.forEach((conversation, index) => {
  //       const duration = differenceInMinutes(
  //         new Date(conversation.update_time),
  //         new Date(conversation.create_time)
  //       );
  //       console.log({ duration, topic: conversation.title, index });
  //       totalMinutesSpent += duration;
  //     });
  //     return totalMinutesSpent;
  //   };

  const getInsightData = (property: string) => {
    switch (property) {
      case "mostActiveDays":
        return {
          title: "Most Active Day",
          metric: insights?.mostActiveDays.Conversations,
          date: insights?.mostActiveDays.day,
        };
      case "mostActiveWeeks":
        return {
          title: "Most Active Week",
          metric: insights?.mostActiveWeeks.Conversations,
          date: insights?.mostActiveWeeks.week,
        };
      case "mostActiveMonths":
        return {
          title: "Most Active Month",
          metric: insights?.mostActiveMonths.Conversations,
          date: insights?.mostActiveMonths.month,
        };
      default:
        return {};
    }
  };

  const saveImage = async () => {
    if (wrapperRef.current) {
      toPng(wrapperRef.current)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(async (data: any) => {
          const a = document.createElement("a");
          a.href = data;
          a.download = `chatgptunwrapped-${new Date().toISOString()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl lg:max-w-full gap-20">
      <div className="absolute top-5 right-5 flex gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative w-[130px] inline-flex items-center justify-center px-2 py-3 overflow-hidden font-medium text-center text-black transition duration-300 ease-out border-2 border-b-4 border-black rounded-full shadow-md group">
              {" "}
              <span className="absolute inset-0 flex items-center text-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                {" "}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>{" "}
                </svg>{" "}
              </span>{" "}
              <span className="absolute flex items-center justify-left text-lg ml-10 w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease gap-5">
                {" "}
                Share{" "}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="#000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="relative invisible" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-3/4 max-w-full p-0 h-full overflow-y-auto justify-center items-center">
            <div
              className="min-w-[885px] min-h-[500px] w-[885px] h-[500px] rounded-lg px-5 py-8 flex flex-col gap-6 justify-between bg-gradient-to-r from-rose-100 to-teal-100 heatmap:*:bg-gray-100 pointer-events-none"
              ref={(el) => (wrapperRef.current = el)}
            >
              <h2 className="text-transparent bg-clip-text bg-gradient-to-tl from-green-700 via-teal-900 to-indigo-600 font-semibold text-2xl text-center">
                {userTitle.replaceAll('"', "")}
              </h2>

              <div className="grid grid-cols-2 gap-4 px-5 items-center">
                <div className="flex flex-col gap-2">
                  <p>My Top 5 categories are:</p>
                  <ul className="list-decimal list-inside text-sm">
                    {top5Data.map((item) => {
                      return (
                        <li key={item.name}>
                          {item.name} ({item.value} convos)
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <p>My most active day, week &amp; month</p>
                  {insights != undefined &&
                    Object.keys(insights).map((key) => {
                      return (
                        <div
                          key={key}
                          className="bg-gray-50 px-3 py-1 rounded-md flex items-center gap-2 justify-between"
                          // decoration="bottom"
                          // decorationColor="emerald"
                        >
                          <p className="text-sm text-black min-w-[125px]">
                            {getInsightData(key).title}
                          </p>
                          <div className="flex gap-2 items-center">
                            {/* <Metric>{item.metric}</Metric> */}
                            <p className="text-lg text-black">
                              {getInsightData(key).metric}
                            </p>
                            <p className="text-xs text-gray-500">convos</p>
                          </div>
                          <p className="text-sm min-w-[86px]">
                            {getInsightData(key).date}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <Heatmap
                conversationHistory={convertToWeeks(
                  generateTimeSeries(conversations, "day") as DailyResponse[]
                )}
              />

              <div className="flex flex-col gap-1.5 items-center justify-center">
                <div className="flex gap-1.5 items-center">
                  <Logo className="w-8 h-8" />
                  <h1 className="text-2xl font-medium bricolage text-transparent bg-clip-text bg-gradient-to-tl from-green-700 via-teal-900 to-indigo-600 text-center">
                    chatgptunwrapped.com
                  </h1>
                </div>
                <h2 className="text-xs text-black">
                  Over 30,000 conversations unwrapped!
                </h2>
              </div>
            </div>

            <div className="w-full flex justify-center gap-4">
              <button
                className="relative w-[150px] inline-flex items-center justify-center px-2 py-3 overflow-hidden font-medium text-center text-black transition duration-300 ease-out border-2 border-b-4 border-black rounded-full shadow-md group"
                onClick={saveImage}
              >
                {" "}
                <span className="absolute inset-0 flex items-center text-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                  {" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>{" "}
                  </svg>{" "}
                </span>{" "}
                <span className="absolute flex items-center justify-left text-lg ml-10 w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease gap-2">
                  {" "}
                  Download{" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="#000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="relative invisible" />
              </button>
              <button
                className="relative w-[200px] inline-flex items-center justify-center px-2 py-3 overflow-hidden font-medium text-center text-black transition duration-300 ease-out border-2 border-b-4 border-black rounded-full shadow-md group"
                onClick={() => {
                  window.location.href = `https://twitter.com/intent/tweet?text=I%20just%20got%20my%20%23ChatGPTUnwrapped2023%20!!%0ACheck%20out%20yours%20at%20the%20site%20from%20the%20image%20below!`;
                }}
              >
                {" "}
                <span className="absolute inset-0 flex items-center text-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                  {" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>{" "}
                  </svg>{" "}
                </span>{" "}
                <span className="absolute flex items-center justify-left text-lg ml-10 w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease gap-2.5">
                  {" "}
                  Share to Twitter{" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="#000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="relative invisible" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-2xl text-center font-semibold tracking-tight underline">
          {userTitle}
        </h2>
        {allConversationsCount != 0 ? (
          <>
            <h2 className="text-xl text-center">
              You had <Counter value={allConversationsCount} /> conversations
              spanning <Counter value={allCategoriesCount} /> categories in
              2023!
            </h2>
            {/* <h2 className="text-xl text-center">
              And spent <Counter value={totalMinutesSpent} /> minutes in total!
            </h2> */}
          </>
        ) : null}
      </div>
      <CategoryOverview />
      {conversations.length > 0 ? (
        <ConversationsCountOverview conversations={conversations} />
      ) : null}
      {conversations.length > 0 ? (
        <ConversationsCount conversations={conversations} />
      ) : null}
    </div>
  );
};

export default Wrapped;
