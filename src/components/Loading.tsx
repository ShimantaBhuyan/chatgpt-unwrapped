import { useState, useEffect } from "react";

const messages = [
  "Your chat data is morphing into insights... the transformation is getting started!",
  "We're consulting the chat oracles for the answers you seek... just a moment!",
  "Don't worry, be analyzing! Your ChatGPT wrapped will be here soon. ",
  "A portal to your ChatGPT soul is opening... prepare to be surprised!",
  "Building a time machine to revisit all your ChatGPT moments...",
  "Taking your ChatGPT history on a journey through the data wormhole… buckle up!",
  "Slapping the side of a server somewhere",
  "Rendering TailwindUI components...",
  "Brewing a potent chat analysis potion… expect an info explosion!",
  "We've just discovered a new species of chat creature… and it looks like you!",
  //   "Finishing up",
];

function Loading() {
  const [message, setMessage] = useState(0);

  const update = () => {
    return setInterval(() => {
      setMessage((i) => (i + 1) % messages.length);
    }, 3000);
  };

  // Update the loading message every 0-3 s
  useEffect(() => {
    const inv = update();

    return () => {
      clearInterval(inv);
    };
  }, []);

  return (
    <div className="text-xl font-medium text-gray-800 animate-pulse justify-self-end bg-clip-text">
      {messages[message]}
    </div>
  );
}

export default Loading;
