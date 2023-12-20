import React, { useEffect, useState } from "react";

const defaultCircleClass =
  "fixed transition-all ease-in-out duration-700 rounded-full blur-3xl";

/**
 * Backdrop to display cards. Could be changed to colours, gradient, image, etc.
 * This is extremely hacky. A better solution is needed.
 */

function Background() {
  const [dateKey, setDateKey] = useState(+new Date());

  const update = () => {
    return setInterval(() => {
      setDateKey(+new Date());
    }, 3000);
  };

  useEffect(() => {
    const inv = update();

    return () => {
      clearInterval(inv);
    };
  }, []);

  // To move the circles around within bounds
  const circleClass = () => {
    const numberCircles = 4;

    // The operator ~~ is a higher-performance equivalent of Math.floor()
    const randomPosition = () => ~~(Math.random() * numberCircles);
    const circleOffset = (position: number) => {
      switch (position) {
        case 0:
          return "sm:translate-x-48 translate-y-56 w-72 h-72";
        case 1:
          return "sm:translate-x-24 translate-y-24 w-96 h-96";
        case 2:
          return "sm:translate-x-96 translate-y-48 w-48 h-48";
        case 3:
          return "sm:translate-x-96 -translate-y-0 w-56 h-56";
      }
    };
    return circleOffset(randomPosition());
  };

  return (
    <div
      key={dateKey}
      className="absolute -z-10 top-1/2 -left-1/2 sm:left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-screen sm:w-[800px] h-[600px]"
    >
      <div className={`${circleClass()} ${defaultCircleClass} bg-indigo-600`} />
      <div className={`${circleClass()} ${defaultCircleClass} bg-green-50`} />
      <div className={`${circleClass()} ${defaultCircleClass} bg-green-800`} />
    </div>
  );
}

export default Background;
