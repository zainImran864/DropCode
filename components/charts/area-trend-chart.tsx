"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/types/database";

interface Props {
  data: ChartPoint[];
  color?: string;
}

/** Reusable smooth area chart for a time/label series. */
export function AreaTrendChart({ data, color = "#6366f1" }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="currentColor"
          className="text-zinc-400"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={40}
          stroke="currentColor"
          className="text-zinc-400"
        />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.2 }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid rgb(228 228 231)",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#areaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
