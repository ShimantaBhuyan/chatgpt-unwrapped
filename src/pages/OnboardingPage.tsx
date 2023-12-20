import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Grid } from "@tremor/react";
import { useState } from "react";

const Step = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <div
    className={cn(
      "font-heading mt-6 scroll-m-20 text-xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
);

const Steps = ({ ...props }) => (
  <div
    className="[&>div]:step mb-8 ml-4 border-l pl-8 [counter-reset:step]"
    {...props}
  />
);

const InstallSteps = () => {
  return (
    <Steps>
      <Step>
        Go to{" "}
        <a
          className="underline text-blue-500"
          target="_blank"
          href="https://chat.openai.com/"
        >
          https://chat.openai.com/
        </a>
      </Step>
      <Step>Open Chrome Developer Tools</Step>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-center">Mac:</p>
          <pre className="my-2 text-center">
            <code className="bg-gray-100 p-2 rounded-md text-sm">
              cmd + option + i
            </code>
          </pre>
          <br></br>
          <p className="text-center">Windows:</p>
          <pre className="my-2 text-center">
            <code className="bg-gray-100 p-2 rounded-md text-sm">
              ctrl + shift + i
            </code>
          </pre>
        </div>
        <div className="flex justify-center items-center">
          <img
            src="/onboarding-inst-0.png"
            alt="Instructions"
            style={{ maxWidth: "15vw" }}
          />
        </div>
      </div>
      <Step>Click the Network Tab</Step>
      <img src="/onboarding-inst-1.png" alt="Instructions" />
      <Step>Click the Search Icon beside</Step>
      <img src="/onboarding-inst-2.png" alt="Instructions" />
      <Step className="text-red-500">
        Refresh Your Screen While On Network Tab
      </Step>
      <Step>Search &apos;sess&apos; and click green highlight</Step>
      <img src="/onboarding-inst-3.png" alt="Instructions" />
      <Step>Scroll and copy the session from the right side</Step>
      <img src="/onboarding-inst-4.png" alt="Instructions" />
      <Step>Paste the session token below</Step>
      <p>Only paste the token itself, remove the `Bearer` prefix</p>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          rYyW10fURtEce3rYSS6QGRMnLziKwrRdZeDt
        </code>
      </pre>
    </Steps>
  );
};

const OnboardingPage = () => {
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === LOCAL_STORAGE_KEY) {
      setKey(value);
      // OpenAI.setKey(value);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    if (!key) {
      alert("Please enter your OpenAI session key");
      setIsSubmitting(false);
    }

    // TODO: Get conversations from chatGPT and then get ChatGPT Wrapped data
    console.log("Preparing your ChatGPT Wrapped, please wait...");
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <div className={cn("flex flex-col w-full max-w-3xl space-y-4")}>
      <Grid numItems={1} className="gap-4 w-full">
        <Card>
          {/* <CardHeader>
              <CardTitle>OpenAI Session Token</CardTitle>
              <CardDescription>
               
              </CardDescription>
            </CardHeader> */}
          <CardHeader className="flex-row gap-4 items-center">
            {/* <OnboardingStep step={1} currentStep={step} /> */}
            <div className="flex flex-col justify-center gap-1.5">
              <CardTitle className="text-2xl">Instructions</CardTitle>
              <CardDescription>
                Paste your ChatGPT session token below to get started. We use
                your ChatGPT session token to call the ChatGPT API and create
                your dashboard. This does not cost you and we do not store your
                key on our servers.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <InstallSteps />
            </ScrollArea>
            <Card>
              <CardHeader className="flex-row gap-4 items-center">
                <CardTitle className="flex gap-2 flex-row items-center">
                  Token:
                </CardTitle>
                <Input
                  type="text"
                  name={LOCAL_STORAGE_KEY}
                  onChange={onChange}
                  required
                  value={key ?? ""}
                  className="my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
                  placeholder="5q293fh..."
                />
                <Button onClick={onSubmit} disabled={isSubmitting}>
                  Get your ChatGPT Wrapped!
                </Button>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default OnboardingPage;
