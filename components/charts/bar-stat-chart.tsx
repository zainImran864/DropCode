"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/types/database";

interface Props {
  data: ChartPoint[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

/** Reusable categorical bar chart. */
export function BarStatChart({ data, colors = DEFAULT_COLORS }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
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
          cursor={{ fill: "currentColor", fillOpacity: 0.05 }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid rgb(228 228 231)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
