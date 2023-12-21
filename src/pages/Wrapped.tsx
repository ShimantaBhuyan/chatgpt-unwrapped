import { useEffect, useState } from "react";
import { getYear } from "date-fns";
import { Conversation } from "@/lib/constants";
import { useIndexedDB } from "react-indexed-db-hook";
// import useLocalStorage from "@/lib/use-local-storage";
import { ConversationsCount } from "@/containers/ConversationsCount";
import { ConversationsCountOverview } from "@/containers/ConversationsCountOverview";
import { CategoryOverview } from "@/containers/CategoryOverview";
import Counter from "@/components/Counter";

const Wrapped = () => {
  const { getByID } = useIndexedDB("chatgpt-unwrapped");
  //   const [key, _] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [allConversationsCount, setAllConversationsCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userTitle, setUserTitle] = useState("");

  useEffect(() => {
    getByID(1).then((data) => {
      setAllConversationsCount(data.conversations.length);
      const filteredData = data.conversations.filter((item: Conversation) => {
        // Use the getYear method from date-fns to get the year from the create_time property
        const year = getYear(new Date(item.create_time));
        // Check if the year is 2023
        return year === 2023;
      });
      setConversations(filteredData);
      setUserTitle(data.userTitle);
    });
  }, [getByID]);

  return (
    <div className="flex flex-col w-full max-w-3xl lg:max-w-full gap-20">
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-2xl text-center font-semibold tracking-tight underline">
          {userTitle}
        </h2>
        {allConversationsCount != 0 ? (
          <h2 className="text-xl text-center">
            You had <Counter value={allConversationsCount} /> conversations in
            2023!
          </h2>
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
