"use client";

import { useState } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import resultsData from "../data/results.json";

type ViewMode = "heatmap" | "cold" | "consecutive" | "correlation";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const numbers = Array.from({ length: 37 }, (_, i) => i + 1);

  // We need to process results from newest to oldest for absence and consecutive calculations
  const reversedResults = [...resultsData.results].reverse();

  // --- Calculate Statistics ---
  const stats: Record<
    number,
    { freq: number; absence: number; consecutive: number; correlation: number }
  > = {};
  for (const n of numbers) {
    stats[n] = { freq: 0, absence: -1, consecutive: 0, correlation: 0 };
  }

  // Calculate frequency and absence
  reversedResults.forEach((result, index) => {
    const mainNums = result.main_numbers.map((nStr) =>
      Number.parseInt(nStr, 10),
    );
    const hasSelected = mainNums.includes(selectedNumber);

    for (const n of numbers) {
      if (mainNums.includes(n)) {
        stats[n].freq++;
        if (stats[n].absence === -1) {
          stats[n].absence = index;
        }
        if (hasSelected && n !== selectedNumber) {
          stats[n].correlation++;
        }
      }
    }
  });

  // Calculate consecutive appearances
  for (const n of numbers) {
    let consecutiveCount = 0;
    for (const result of reversedResults) {
      const mainNums = result.main_numbers.map((nStr) =>
        Number.parseInt(nStr, 10),
      );
      if (mainNums.includes(n)) {
        consecutiveCount++;
      } else {
        break;
      }
    }
    stats[n].consecutive = consecutiveCount;

    // For numbers that never appeared, set absence to max possible
    if (stats[n].absence === -1) {
      stats[n].absence = reversedResults.length;
    }
  }

  const maxFreq = Math.max(...numbers.map((n) => stats[n].freq), 1);
  const maxAbsence = Math.max(...numbers.map((n) => stats[n].absence), 1);
  const maxCorrelation = Math.max(
    ...numbers.map((n) => stats[n].correlation),
    1,
  );

  // --- Render Helpers ---
  const getPanelData = (num: number) => {
    const { freq, absence, consecutive, correlation } = stats[num];

    if (viewMode === "heatmap") {
      let className =
        "bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800";
      if (freq > 0) {
        const ratio = freq / maxFreq;
        if (ratio > 0.8)
          className =
            "bg-rose-600 text-white border-rose-700 dark:bg-rose-500 dark:border-rose-600 font-bold";
        else if (ratio > 0.6)
          className =
            "bg-rose-500 text-white border-rose-600 dark:bg-rose-600 dark:border-rose-700 font-bold";
        else if (ratio > 0.4)
          className =
            "bg-rose-400 text-rose-50 border-rose-500 dark:bg-rose-700 dark:border-rose-800 dark:text-rose-100";
        else if (ratio > 0.2)
          className =
            "bg-rose-300 text-rose-900 border-rose-400 dark:bg-rose-800 dark:border-rose-900 dark:text-rose-200";
        else
          className =
            "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300";
      }
      return { className, label: freq > 0 ? `${freq}回` : "" };
    }

    if (viewMode === "cold") {
      let className =
        "bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800";
      if (absence > 0) {
        const ratio = absence / maxAbsence;
        if (ratio > 0.8)
          className =
            "bg-blue-600 text-white border-blue-700 dark:bg-blue-500 dark:border-blue-600 font-bold";
        else if (ratio > 0.6)
          className =
            "bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 font-bold";
        else if (ratio > 0.4)
          className =
            "bg-blue-400 text-blue-50 border-blue-500 dark:bg-blue-700 dark:border-blue-800 dark:text-blue-100";
        else if (ratio > 0.2)
          className =
            "bg-blue-300 text-blue-900 border-blue-400 dark:bg-blue-800 dark:border-blue-900 dark:text-blue-200";
        else
          className =
            "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300";
      }
      return {
        className,
        label: absence === 0 ? "直近" : `${absence}空き`,
      };
    }

    if (viewMode === "consecutive") {
      let className =
        "bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800";
      if (consecutive >= 3)
        className =
          "bg-amber-600 text-white border-amber-700 dark:bg-amber-500 dark:border-amber-600 font-bold";
      else if (consecutive === 2)
        className =
          "bg-amber-400 text-amber-950 border-amber-500 dark:bg-amber-600 dark:border-amber-700 dark:text-amber-50 font-bold";
      else if (consecutive === 1)
        className =
          "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900 dark:border-amber-800 dark:text-amber-200";

      return {
        className,
        label: consecutive > 0 ? `${consecutive}連続` : "",
      };
    }

    if (viewMode === "correlation") {
      let className =
        "bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800";
      if (num === selectedNumber) {
        className =
          "bg-purple-600 text-white border-purple-700 dark:bg-purple-500 dark:border-purple-600 font-bold ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-black";
        return { className, label: "基準" };
      }
      if (correlation > 0) {
        const ratio = correlation / maxCorrelation;
        if (ratio > 0.8)
          className =
            "bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-500 dark:border-emerald-600 font-bold";
        else if (ratio > 0.6)
          className =
            "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 font-bold";
        else if (ratio > 0.4)
          className =
            "bg-emerald-400 text-emerald-50 border-emerald-500 dark:bg-emerald-700 dark:border-emerald-800 dark:text-emerald-100";
        else if (ratio > 0.2)
          className =
            "bg-emerald-300 text-emerald-900 border-emerald-400 dark:bg-emerald-800 dark:border-emerald-900 dark:text-emerald-200";
        else
          className =
            "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300";
      }
      return { className, label: correlation > 0 ? `${correlation}回` : "" };
    }

    return { className: "", label: "" };
  };

  const titles = {
    heatmap: "ヒートマップ",
    cold: "コールドナンバー",
    consecutive: "連続出現番号",
    correlation: "相関性",
  };

  const descriptions = {
    heatmap:
      "過去の抽せん結果における出現頻度を色の濃さで表しています。色が濃いほどよく出ている番号です。",
    cold: "各番号が最後に当選してからの空き回数を色の濃さで表しています。色が濃いほど長い間出ていない（そろそろ出そうな）番号です。",
    consecutive:
      "直近の抽せんで連続して当選している回数を色の濃さで表しています。色が濃いほど現在連続して出現している番号です。",
    correlation:
      "選択した基準番号（紫枠）と一緒に当選しやすい番号を色の濃さで表しています。色が濃いほど同時に出やすい番号です。",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans transition-colors duration-300 sm:p-8 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6 sm:gap-8">
        <div className="relative flex w-full flex-col items-center text-center">
          <div className="absolute right-0 -top-2 sm:top-0">
            <ThemeToggle />
          </div>
          <h1 className="mb-2 pr-12 text-2xl font-bold tracking-tight text-zinc-900 sm:pr-0 sm:text-3xl dark:text-zinc-50">
            {titles[viewMode]}
          </h1>
          <p className="mb-4 max-w-lg px-2 text-sm text-zinc-600 dark:text-zinc-400 text-left sm:text-center">
            {descriptions[viewMode]}
          </p>

          <div className="mb-2 flex max-w-full gap-1 overflow-x-auto rounded-lg bg-zinc-200 p-1 sm:gap-2 dark:bg-zinc-800 scrollbar-hide">
            <button
              type="button"
              onClick={() => setViewMode("heatmap")}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                viewMode === "heatmap"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              ヒートマップ
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cold")}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                viewMode === "cold"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              コールド
            </button>
            <button
              type="button"
              onClick={() => setViewMode("consecutive")}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                viewMode === "consecutive"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              連続出現
            </button>
            <button
              type="button"
              onClick={() => setViewMode("correlation")}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                viewMode === "correlation"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              相関性
            </button>
          </div>

          <p className="text-[10px] text-zinc-500 sm:text-sm dark:text-zinc-400">
            集計対象: {resultsData.results.length}回分 （
            {resultsData.results[resultsData.results.length - 1].issue} 〜{" "}
            {resultsData.results[0].issue}）
          </p>
          <p className="mt-1 text-[10px] font-medium text-purple-600 sm:text-xs dark:text-purple-400">
            番号をクリックすると、その番号と一緒に出やすい番号を表示します
          </p>
        </div>

        <div className="grid w-full max-w-md grid-cols-5 gap-2 sm:gap-4">
          {numbers.map((num) => {
            const { className, label } = getPanelData(num);
            return (
              <button
                type="button"
                key={num}
                onClick={() => {
                  setViewMode("correlation");
                  setSelectedNumber(num);
                }}
                className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-lg border shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer ${className}`}
              >
                <span className="text-lg sm:text-xl">{num}</span>
                {label && (
                  <span className="absolute bottom-0.5 right-1 whitespace-nowrap text-[8px] opacity-80 sm:bottom-1 sm:right-1.5 sm:text-[10px]">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex h-8 flex-col items-center">
          {viewMode === "heatmap" && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>低頻度</span>
              <div className="flex h-4 w-32 rounded bg-gradient-to-r from-rose-100 to-rose-600 dark:from-rose-950 dark:to-rose-500" />
              <span>高頻度</span>
            </div>
          )}
          {viewMode === "cold" && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>直近出現</span>
              <div className="flex h-4 w-32 rounded bg-gradient-to-r from-blue-100 to-blue-600 dark:from-blue-950 dark:to-blue-500" />
              <span>長期待機</span>
            </div>
          )}
          {viewMode === "consecutive" && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>単発</span>
              <div className="flex h-4 w-32 rounded bg-gradient-to-r from-amber-100 to-amber-600 dark:from-amber-900 dark:to-amber-500" />
              <span>連続</span>
            </div>
          )}
          {viewMode === "correlation" && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>低相関</span>
              <div className="flex h-4 w-32 rounded bg-gradient-to-r from-emerald-100 to-emerald-600 dark:from-emerald-950 dark:to-emerald-500" />
              <span>高相関</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
