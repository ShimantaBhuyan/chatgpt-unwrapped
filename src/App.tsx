import OnboardingPage from "@/pages/OnboardingPage";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import Wrapped from "@/pages/Wrapped";
import Loading from "@/components/Loading";
import Background from "@/containers/Background";
import { useEffect, useState } from "react";

function App() {
  const [key] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [isAnalysing, setIsAnalysing] = useState(false);

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
    setIsAnalysing(true);
    const timeout = setTimeout(() => {
      setIsAnalysing(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-8 lg:p-24 lg:pt-16 gap-20">
      {/* <h1 className="text-xl lg:text-3xl font-medium">
        ChatGPT Wrapped - 2023
      </h1>
      <div className="flex h-full flex-col items-center justify-between w-full gap-5">
        {!key || key === "" ? <OnboardingPage /> : null}
        {key != undefined && key != "" ? <Wrapped /> : null}
      </div> */}
      {isAnalysing ? (
        <>
          <Background />
          <Loading />
        </>
      ) : (
        <>
          <h1 className="text-xl lg:text-4xl font-medium bricolage">
            ChatGPT Wrapped - 2023
          </h1>
          <div className="flex h-full flex-col items-center justify-between w-full gap-5">
            {!key || key === "" ? <OnboardingPage /> : null}
            {key != undefined && key != "" ? <Wrapped /> : null}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
