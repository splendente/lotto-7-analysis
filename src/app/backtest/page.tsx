"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import resultsData from "../../data/results.json";
import { predictNext } from "../../lib/predictor";

interface HistoryRecord {
  issue: string;
  actualMain: number[];
  actualBonus: number[];
  predicted: number[];
  matches: number[];
  bonusMatches: number[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 画面の初回描画をブロックしないよう非同期で処理を実行
    const timer = setTimeout(() => {
      const records: HistoryRecord[] = [];
      const maxHistory = 20;
      const allResults = resultsData.results;
      const n = allResults.length;

      // 直近の回号から遡って検証を実行
      for (let i = n - 1; i >= Math.max(0, n - maxHistory); i--) {
        if (i === 0) break; // 第1回は過去データがないためスキップ

        const currentDraw = allResults[i];
        // その回号より前のデータのみを予測に使用する（バックテスト）
        const pastDraws = allResults.slice(0, i);

        const prediction = predictNext(pastDraws);

        const actualMainNums = currentDraw.main_numbers.map((n) =>
          Number.parseInt(n, 10),
        );
        const actualBonusNums = currentDraw.bonus_numbers.map((n) =>
          Number.parseInt(n, 10),
        );

        const matches = prediction.numbers.filter((n) =>
          actualMainNums.includes(n),
        );
        const bonusMatches = prediction.numbers.filter((n) =>
          actualBonusNums.includes(n),
        );

        records.push({
          issue: currentDraw.issue,
          actualMain: actualMainNums,
          actualBonus: actualBonusNums,
          predicted: prediction.numbers,
          matches,
          bonusMatches,
        });
      }

      setHistory(records);
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const { totalMatches, totalPredicted, accuracy } = useMemo(() => {
    const totalPredicted = history.length * 7;
    const totalMatches = history.reduce(
      (sum, record) => sum + record.matches.length,
      0,
    );
    const accuracy =
      totalPredicted > 0 ? (totalMatches / totalPredicted) * 100 : 0;
    return { totalMatches, totalPredicted, accuracy };
  }, [history]);

  // 円グラフの計算
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 p-4 pt-8 font-sans transition-colors duration-300 sm:p-8 sm:pt-12 dark:bg-black">
        <main className="flex w-full max-w-2xl flex-col items-center gap-6 sm:gap-8">
          <div className="flex w-full items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              &larr; 戻る
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              検証結果
            </h2>
            <div className="w-12"></div>
          </div>

          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-500" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              過去のデータからバックテストを実行中...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-zinc-50 p-4 pt-8 font-sans transition-colors duration-300 sm:p-8 sm:pt-12 dark:bg-black w-full min-h-screen">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6 sm:gap-8">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            &larr; 戻る
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            検証結果
          </h2>
          <div className="w-12"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="max-w-lg px-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
            直近20回分の抽せんにおいて、その時点での過去データのみを用いて予測した場合に、実際に何個の番号が一致していたかを検証しています。
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            総合予測精度
          </h3>

          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg
              width="128"
              height="128"
              viewBox="0 0 100 100"
              className="-rotate-90 transform"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-zinc-100 dark:text-zinc-800"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-purple-600 transition-all duration-1000 ease-out dark:text-purple-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {accuracy.toFixed(1)}
                <span className="text-sm">%</span>
              </span>
            </div>
          </div>
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            全{totalPredicted}個の予測番号のうち、
            <br />
            <strong className="text-purple-600 dark:text-purple-400">
              {totalMatches}
            </strong>
            個が実際の本数字と一致しました。
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            ※完全にランダムに選んだ場合の理論上の平均一致率は約18.9%です。
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {history.map((record) => (
            <div
              key={record.issue}
              className="flex flex-col rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {record.issue}
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  一致:{" "}
                  <strong className="text-purple-600 dark:text-purple-400">
                    {record.matches.length}
                  </strong>{" "}
                  個
                  {record.bonusMatches.length > 0 && (
                    <span className="ml-1 text-xs text-zinc-500">
                      (+ボーナス{record.bonusMatches.length}個)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    AI予測番号
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.predicted.map((num) => {
                      const isMainMatch = record.matches.includes(num);
                      const isBonusMatch = record.bonusMatches.includes(num);
                      let badgeClass =
                        "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

                      if (isMainMatch) {
                        badgeClass =
                          "bg-purple-100 text-purple-700 ring-1 ring-purple-500 dark:bg-purple-900/30 dark:text-purple-300";
                      } else if (isBonusMatch) {
                        badgeClass =
                          "bg-amber-100 text-amber-700 ring-1 ring-amber-500 dark:bg-amber-900/30 dark:text-amber-300";
                      }

                      return (
                        <div
                          key={`pred-${num}`}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${badgeClass}`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    実際の結果
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.actualMain.map((num) => (
                      <div
                        key={`act-${num}`}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${record.matches.includes(num) ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"}`}
                      >
                        {num}
                      </div>
                    ))}
                    <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                    {record.actualBonus.map((num) => (
                      <div
                        key={`act-bonus-${num}`}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${record.bonusMatches.includes(num) ? "bg-amber-500 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 opacity-70"}`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
