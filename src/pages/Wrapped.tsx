// import { LOCAL_STORAGE_KEY } from "@/lib/constants";
// import useLocalStorage from "@/lib/use-local-storage";

import { useEffect, useState } from "react";
import { parseISO, getYear } from "date-fns";
import {
  CONVERSATIONS /* LOCAL_STORAGE_KEY */,
  //   TEST_CATEGORISED_TITLES,
} from "@/lib/constants";
// import useLocalStorage from "@/lib/use-local-storage";
import { ConversationsCount } from "@/containers/ConversationsCount";
import { ConversationsCountOverview } from "@/containers/ConversationsCountOverview";
import { CategoryOverview } from "@/containers/CategoryOverview";

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

const Wrapped = () => {
  //   const [key, _] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [conversations, setConversations] = useState<Conversation[]>(
    CONVERSATIONS.items
  );
  //   const [categorisedConversations, setCategorisedConversations] = useState<
  //     Array<Record<string, string>>
  //   >([]);

  useEffect(() => {
    const filteredData = conversations.filter((item) => {
      // Use the getYear method from date-fns to get the year from the create_time property
      const year = getYear(parseISO(item.create_time));
      // Check if the year is 2023
      return year === 2023;
    });

    setConversations(filteredData);

    // // TODO: make api call to get categories OR get fromearlier api call response
    // const groupedConversations = TEST_CATEGORISED_TITLES;

    // const categories = Object.keys(groupedConversations);
    // console.log({ categories });

    // console.log({ groupedConversations });

    // setCategorisedConversations(
    //   JSON.parse(JSON.stringify(TEST_CATEGORISED_TITLES))
    // );
  }, []);

  return (
    <div className="flex flex-col w-full max-w-3xl lg:max-w-full gap-20">
      <CategoryOverview />
      <ConversationsCountOverview conversations={conversations} />
      <ConversationsCount conversations={conversations} />
    </div>
  );
};

export default Wrapped;
