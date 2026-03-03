export interface DrawResult {
  issue: string;
  main_numbers: string[];
  bonus_numbers: string[];
}

export function calculateStats(results: DrawResult[], selectedNumber?: number) {
  const numbers = Array.from({ length: 37 }, (_, i) => i + 1);
  const reversedResults = [...results].reverse();

  const stats: Record<
    number,
    {
      freq: number;
      absence: number;
      consecutive: number;
      correlation: number;
      recentFreq: number;
      bonusRecent: number;
    }
  > = {};
  for (const n of numbers) {
    stats[n] = {
      freq: 0,
      absence: -1,
      consecutive: 0,
      correlation: 0,
      recentFreq: 0,
      bonusRecent: 0,
    };
  }

  const RECENT_WINDOW = 30;

  // Calculate frequency, recent frequency and absence
  reversedResults.forEach((result, index) => {
    const mainNums = result.main_numbers.map((nStr) =>
      Number.parseInt(nStr, 10),
    );
    const hasSelected =
      selectedNumber !== undefined && mainNums.includes(selectedNumber);

    for (const n of numbers) {
      if (mainNums.includes(n)) {
        stats[n].freq++;
        if (index < RECENT_WINDOW) {
          stats[n].recentFreq++;
        }
        if (stats[n].absence === -1) {
          stats[n].absence = index;
        }
        if (hasSelected && n !== selectedNumber) {
          stats[n].correlation++;
        }
      }
    }
  });

  // Calculate consecutive appearances and bonus promotion
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

    if (stats[n].absence === -1) {
      stats[n].absence = reversedResults.length;
    }

    // Check if it was a bonus number in the last 2 draws
    let bonusCount = 0;
    for (let i = 0; i < Math.min(2, reversedResults.length); i++) {
      const bonusNums = reversedResults[i].bonus_numbers.map((nStr) =>
        Number.parseInt(nStr, 10),
      );
      if (bonusNums.includes(n)) {
        bonusCount++;
      }
    }
    stats[n].bonusRecent = bonusCount;
  }

  return { numbers, reversedResults, stats };
}

export function predictNext(results: DrawResult[]): {
  numbers: number[];
  summary: string;
} {
  const { numbers, reversedResults, stats } = calculateStats(results);

  const maxFreq = Math.max(...numbers.map((n) => stats[n].freq), 1);
  const maxAbsence = Math.max(...numbers.map((n) => stats[n].absence), 1);
  const maxRecentFreq = Math.max(...numbers.map((n) => stats[n].recentFreq), 1);
  const maxConsecutive = Math.max(
    ...numbers.map((n) => stats[n].consecutive),
    1,
  );
  const maxBonus = Math.max(...numbers.map((n) => stats[n].bonusRecent), 1);

  const picked: { num: number; reason: string }[] = [];
  const remaining = [...numbers];

  // Optimized weights
  const freqWeight = 0.0;
  const absenceWeight = 2.0;
  const correlationWeight = 0.0;
  const recentWeight = 1.0;
  const consWeight = 2.0;
  const bonusWeight = 0.0;

  while (picked.length < 7) {
    const scores = remaining.map((num) => {
      const { freq, absence, recentFreq, consecutive, bonusRecent } =
        stats[num];

      const freqScore = maxFreq > 0 ? (freq / maxFreq) * freqWeight : 0;
      const absenceScore =
        maxAbsence > 0 ? (absence / maxAbsence) * absenceWeight : 0;
      const recentScore =
        maxRecentFreq > 0 ? (recentFreq / maxRecentFreq) * recentWeight : 0;
      const consScore =
        maxConsecutive > 0 ? (consecutive / maxConsecutive) * consWeight : 0;
      const bonusScore =
        maxBonus > 0 ? (bonusRecent / maxBonus) * bonusWeight : 0;

      let score =
        freqScore + absenceScore + recentScore + consScore + bonusScore;
      let correlationScore = 0;

      if (picked.length > 0) {
        let totalCorrelation = 0;
        let maxPossibleCorrelation = 1;

        for (const p of picked) {
          let occurrences = 0;
          for (const r of reversedResults) {
            const nums = r.main_numbers.map((n) => Number.parseInt(n, 10));
            if (nums.includes(num) && nums.includes(p.num)) occurrences++;
          }
          totalCorrelation += occurrences;
          maxPossibleCorrelation += stats[p.num].freq;
        }

        correlationScore =
          (totalCorrelation / maxPossibleCorrelation) * correlationWeight;
        score += correlationScore;
      }

      let mainReason = "統計バランス";
      // どのスコアが一番貢献したかで理由を決定（重み付け適用後で比較）
      const scoresArray = [
        { name: "直近トレンド", val: recentScore },
        { name: "長期待機", val: absenceScore },
        { name: "相性よし", val: correlationScore },
        { name: "高頻度", val: freqScore },
        { name: "ボーナス昇格", val: bonusScore },
      ];

      // 連続出現は特別扱い（勢いがあるため）
      if (stats[num].consecutive >= 2) {
        mainReason = "連続出現中";
      } else if (bonusScore > 0 && stats[num].bonusRecent > 0) {
        mainReason = "ボーナス昇格";
      } else {
        // スコアが一番高いものを理由にする
        scoresArray.sort((a, b) => b.val - a.val);
        if (scoresArray[0].val > 0.5) {
          mainReason = scoresArray[0].name;
        }
      }

      return { score: Math.max(score, 0.1), reason: mainReason };
    });

    let maxScoreIndex = 0;
    let maxScoreValue = -1;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i].score > maxScoreValue) {
        maxScoreValue = scores[i].score;
        maxScoreIndex = i;
      }
    }

    picked.push({
      num: remaining[maxScoreIndex],
      reason: scores[maxScoreIndex].reason,
    });
    remaining.splice(maxScoreIndex, 1);
  }

  const sortedPicked = picked.sort((a, b) => a.num - b.num);

  const groups: Record<string, number[]> = {};
  sortedPicked.forEach((p) => {
    if (!groups[p.reason]) groups[p.reason] = [];
    groups[p.reason].push(p.num);
  });

  const phrases: string[] = [];
  if (groups["連続出現中"])
    phrases.push(
      `直近で連続して当せん中の【${groups["連続出現中"].join(", ")}】`,
    );
  if (groups["ボーナス昇格"])
    phrases.push(
      `直近でボーナス数字から本数字への昇格が期待される【${groups["ボーナス昇格"].join(", ")}】`,
    );
  if (groups["直近トレンド"])
    phrases.push(
      `直近30回で出現頻度が高くトレンドに乗っている【${groups["直近トレンド"].join(", ")}】`,
    );
  if (groups["高頻度"])
    phrases.push(
      `過去の全当せんの中で出現回数が多い【${groups["高頻度"].join(", ")}】`,
    );
  if (groups["長期待機"])
    phrases.push(
      `最近長らく出ておらずそろそろ出そうな【${groups["長期待機"].join(", ")}】`,
    );
  if (groups["相性よし"])
    phrases.push(
      `選出された番号と過去一緒に出やすい【${groups["相性よし"].join(", ")}】`,
    );
  if (groups["統計バランス"])
    phrases.push(
      `他の指標と合わせて総合的なバランスが良い【${groups["統計バランス"].join(", ")}】`,
    );

  const summaryText =
    phrases.join("、") +
    "という観点から、次回最も当せん確率が高い組み合わせを予測しました。";

  return {
    numbers: sortedPicked.map((p) => p.num),
    summary: summaryText,
  };
}
