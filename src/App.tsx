import { useEffect, useState } from "react";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "@/lib/dbconfig";
import { useIndexedDB } from "react-indexed-db-hook";
import OnboardingPage from "@/pages/OnboardingPage";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import Wrapped from "@/pages/Wrapped";
import Loading from "@/components/Loading";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

initDB(DBConfig);

function App() {
  const { add, getByID } = useIndexedDB("chatgpt-unwrapped");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const [isUnwrappedAlready, setIsUnwrappedAlready] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useLocalStorage<boolean>(
    "IS_MOBILE",
    false,
    true
  );

  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 768);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    getByID(1).then((data) => {
      if (
        // data.length != 0 &&
        data.categorised != undefined &&
        data.conversations != undefined &&
        data.conversations.length > 0
      ) {
        setIsUnwrappedAlready(true);
      } else {
        setIsUnwrappedAlready(false);
      }
    });
  }, [getByID]);

  const onGenerate = async (token: string) => {
    if (!token) {
      alert("Please enter your OpenAI session key");
      setIsAnalysing(false);
    }

    setKey(token);
    setIsAnalysing(true);
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_ENDPOINT}/get-wrapped`,
      {
        method: "POST",
        body: JSON.stringify({
          token: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    );
    if (response.status === 401) {
      alert(
        "Invalid OpenAI session key. Please follow instructions and try again."
      );
      setIsAnalysing(false);
      return;
    } else if (response.status === 500) {
      alert("Something went wrong. Please try again.");
      setIsAnalysing(false);
      return;
    }
    const data = await response.json();
    add({
      conversations: data.conversations,
      categorised: data.categorisedMap,
      userTitle: data.userTitle,
    }).then(
      () => {
        setIsUnwrappedAlready(true);
      },
      (error) => {
        console.log("ERROR: ", error);
        alert("Something went wrong. Please try again.");
      }
    );
  };

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col justify-center items-center p-8 lg:p-24 lg:pt-16 gap-20">
        <h1 className="text-5xl md:text-3xl bricolage text-transparent bg-clip-text font-medium bg-gradient-to-tl from-green-700 via-teal-900 to-indigo-600 text-center">
          ChatGPT UnWrapped 2023
        </h1>
        <h2 className="text-center">
          Please open in desktop to generate your ChatGPT Wrapped
        </h2>
      </div>
    );
  }

  return (
    // <KindeProvider
    //   clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
    //   domain={import.meta.env.VITE_KINDE_DOMAIN}
    //   redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
    //   logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
    // >
    <div className="flex min-h-screen flex-col justify-center items-center p-8 lg:p-24 lg:pt-16 gap-20">
      {isAnalysing ? (
        <>
          <h1 className="text-5xl relative md:text-7xl font-medium bricolage text-transparent bg-clip-text bg-gradient-to-tl from-green-700 via-teal-900 to-indigo-600 text-center">
            ChatGPT UnWrapped 2023
          </h1>
          <div className="blob"></div>
          <Loading />
          <div className="flex flex-col gap-5 items-center w-full">
            <p className="uppercase font-semibold">
              Please do not close this tab or the browser window while your
              ChatGPT UnWrapped 2023 is being generated
            </p>
            <p className="mt-5 uppercase font-semibold text-sm">
              It takes around 5 mins to fetch your conversation topics, and then
              prepare the analysis
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-5xl md:text-7xl font-medium bricolage text-transparent bg-clip-text bg-gradient-to-tl from-green-700 via-teal-900 to-indigo-600 text-center">
            ChatGPT UnWrapped 2023
          </h1>
          <div className="flex h-full flex-col items-center justify-between w-full gap-5">
            {!isUnwrappedAlready ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="relative w-[200px] inline-flex items-center justify-center px-6 py-8 overflow-hidden font-medium text-center text-black transition duration-300 ease-out border-2 border-b-4 border-black rounded-full shadow-md group">
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
                    <span className="absolute flex items-center justify-left text-lg ml-10 w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease gap-8">
                      {" "}
                      Get Started{" "}
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
                <DialogContent className="w-3/4 max-w-full p-10 h-full overflow-y-auto justify-center">
                  <OnboardingPage onSubmit={onGenerate} />
                </DialogContent>
              </Dialog>
            ) : (
              <Wrapped />
            )}
          </div>
        </>
      )}
    </div>
    // </KindeProvider>
  );
}

export default App;
