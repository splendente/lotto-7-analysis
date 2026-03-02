import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-6 mt-auto">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 px-4 text-center sm:px-8">
        <div className="flex items-center gap-2 opacity-80">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
            <span className="text-[10px] font-bold">7</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Lotto 7 Analysis
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          &copy; {currentYear} Lotto 7 Analysis. All rights reserved.
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-md mt-1">
          ※ 当サイトの分析・予測結果は当せんを保証するものではありません。宝くじの購入は自己責任でお願いいたします。
        </p>
      </div>
    </footer>
  );
}
