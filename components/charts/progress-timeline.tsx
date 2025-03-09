"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  AreaSeries,
} from "lightweight-charts";

interface ProgressData {
  date: string;
  overallScore: number;
}

export const ProgressTimeline = () => {
  function generateProgressData(
    startDate: string = "2024-12-02",
    numWeeks: number = 50,
    startScore: number = 45,
    maxScore: number = 95
  ): ProgressData[] {
    const result: ProgressData[] = [];
    let currentScore = startScore;
    const currentDate = new Date(startDate);
    for (let i = 0; i < numWeeks; i++) {
      const dateString = currentDate.toISOString().split("T")[0];
      const increase = 0.5 + Math.random() * 2.5;
      const setback = Math.random() < 0.15 ? -(Math.random() * 2) : 0;
      currentScore += increase + setback;
      currentScore = Math.min(Math.round(currentScore), maxScore);
      result.push({
        date: dateString,
        overallScore: currentScore,
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return result;
  }

  const progressData: ProgressData[] = generateProgressData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create a new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#64748b",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#e2e8f0" },
        horzLines: { color: "#e2e8f0" },
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
      },
      timeScale: {
        borderColor: "#e2e8f0",
      },
    });

    // Store the chart reference
    chartRef.current = chart;

    // Create area series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#6366f1", // indigo
      topColor: "rgba(99, 102, 241, 0.4)",
      bottomColor: "rgba(99, 102, 241, 0.05)",
      lineWidth: 2,
      title: "Overall Progress",
    });

    // Set data
    areaSeries.setData(
      progressData.map((item) => ({
        time: item.date,
        value: item.overallScore,
      }))
    );

    // Adjust to container size
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="h-[150px] sm:h-[200px] w-full rounded-lg"
    />
  );
};
