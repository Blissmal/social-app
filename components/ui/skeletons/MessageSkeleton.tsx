import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-2 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          {idx % 2 === 0 && (
            <Skeleton className="w-10 h-10 rounded-full" />
          )}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-16 w-[200px] rounded-lg" />
          </div>
          {idx % 2 !== 0 && (
            <Skeleton className="w-10 h-10 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
