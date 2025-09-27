"use client";

import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// adjust your import path

interface Segment {
  value: number;
  color: string;
}

function SegmetedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <TooltipProvider>
      <div className="flex h-3 overflow-hidden rounded">
        {segments.map((seg, idx) => {
          const pct = (total === 0 && idx === 1 ? 1 : seg.value / total) * 100 + "%";
          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <div className={seg.color} style={{ width: pct }} />
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-sm">{seg.value}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export { SegmetedBar };
