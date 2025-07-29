import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

function Progress({ className = "", value = 0, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={`bg-primary/20 relative h-2 w-full overflow-hidden rounded-full ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full flex-1 transition-transform"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
