// import { useEffect, useRef } from "react";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// export default function useInterval(callback, delay) {
//   const savedCallback = useRef();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }

// WITH CLEARING THE POLL
import { useEffect, useRef, useState } from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef();
  const [isIntervalCleared, setIsIntervalCleared] = useState(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null && !isIntervalCleared) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay, isIntervalCleared]);

  const clearInterval = () => {
    setIsIntervalCleared(true);
  };

  return clearInterval;
}
