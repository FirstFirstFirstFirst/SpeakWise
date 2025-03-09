"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  LineSeries,
} from "lightweight-charts";
interface PerformanceData {
  date: string;
  pronunciation: number;
  grammar: number;
  fluency: number;
  vocabulary: number;
}

export const PerformanceVisualization = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  function generatePerformanceData() {
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2025-03-10");

    // Initial scores
    let pronunciation = 25;
    let grammar = 30;
    let fluency = 20;
    let vocabulary = 22;

    // Target final scores
    const finalPronunciation = 78;
    const finalGrammar = 82;
    const finalFluency = 65;
    const finalVocabulary = 70;

    const data = [];
    const currentDate = new Date(startDate);

    // Function to add natural variation
    const addVariation = (value: number, max: number) => {
      // Smaller variation for lower values, larger for higher values
      const variationRange = Math.max(1, value * 0.06);
      const variation = (Math.random() * 2 - 1) * variationRange;

      return Math.min(max, Math.max(value * 0.97, value + variation));
    };

    // Calculate how much to increase each metric per step (on average)
    const totalDays: number =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const dataPoints = Math.ceil(totalDays / 7); // Weekly data points

    const pronounciationStep =
      (finalPronunciation - pronunciation) / dataPoints;
    const grammarStep = (finalGrammar - grammar) / dataPoints;
    const fluencyStep = (finalFluency - fluency) / dataPoints;
    const vocabularyStep = (finalVocabulary - vocabulary) / dataPoints;

    // Generate data for each week
    while (currentDate <= endDate) {
      // Add base improvement
      pronunciation +=
        pronounciationStep + Math.random() * pronounciationStep * 0.5;
      grammar += grammarStep + Math.random() * grammarStep * 0.5;
      fluency += fluencyStep + Math.random() * fluencyStep * 0.5;
      vocabulary += vocabularyStep + Math.random() * vocabularyStep * 0.5;

      // Add natural variations (occasional dips and jumps)
      pronunciation = addVariation(pronunciation, finalPronunciation);
      grammar = addVariation(grammar, finalGrammar);
      fluency = addVariation(fluency, finalFluency);
      vocabulary = addVariation(vocabulary, finalVocabulary);

      // Format date as YYYY-MM-DD
      const dateString = currentDate.toISOString().split("T")[0];

      // Add data point
      data.push({
        date: dateString,
        pronunciation: Math.round(pronunciation),
        grammar: Math.round(grammar),
        fluency: Math.round(fluency),
        vocabulary: Math.round(vocabulary),
      });

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Ensure the last data point matches the target scores
    if (data.length > 0) {
      const lastEntry = data[data.length - 1];
      if (lastEntry.date !== "2025-03-10") {
        data.push({
          date: "2025-03-10",
          pronunciation: finalPronunciation,
          grammar: finalGrammar,
          fluency: finalFluency,
          vocabulary: finalVocabulary,
        });
      } else {
        lastEntry.pronunciation = finalPronunciation;
        lastEntry.grammar = finalGrammar;
        lastEntry.fluency = finalFluency;
        lastEntry.vocabulary = finalVocabulary;
      }
    }

    return data;
  }

  // Replace your performanceData array with this:
  const performanceData: PerformanceData[] = generatePerformanceData();

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

    // Add series
    const pronunciationSeries = chart.addSeries(LineSeries, {
      color: "#0ea5e9", // sky blue
      lineWidth: 2,
      title: "Pronunciation",
    });

    const grammarSeries = chart.addSeries(LineSeries, {
      color: "#10b981", // emerald
      lineWidth: 2,
      title: "Grammar",
    });

    const fluencySeries = chart.addSeries(LineSeries, {
      color: "#f59e0b", // amber
      lineWidth: 2,
      title: "Fluency",
    });

    const vocabularySeries = chart.addSeries(LineSeries, {
      color: "#8b5cf6", // violet
      lineWidth: 2,
      title: "Vocabulary",
    });

    // Set data
    pronunciationSeries.setData(
      performanceData.map((item) => ({
        time: item.date,
        value: item.pronunciation,
      }))
    );

    grammarSeries.setData(
      performanceData.map((item) => ({
        time: item.date,
        value: item.grammar,
      }))
    );

    fluencySeries.setData(
      performanceData.map((item) => ({
        time: item.date,
        value: item.fluency,
      }))
    );

    vocabularySeries.setData(
      performanceData.map((item) => ({
        time: item.date,
        value: item.vocabulary,
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
      className="h-[150px] sm:h-[480px] w-full rounded-lg"
    />
  );
};
