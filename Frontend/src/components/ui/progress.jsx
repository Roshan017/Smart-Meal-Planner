import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = ({ className = "", value = 0, ...props }) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={`bg-primary/20 relative h-5 w-full overflow-hidden rounded-full ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full flex-1 rounded-3xl transition-transform duration-300"
        style={{
          transform: `translateX(-${100 - value}%)`,
          background: "linear-gradient(270deg, #4ade80, #22c55e, #4ade80)", // gradient shades of green
          backgroundSize: "200% 100%",
          animation: "progressFlow 1.5s linear infinite",
        }}
      />
    </ProgressPrimitive.Root>
  );
};

export { Progress };
