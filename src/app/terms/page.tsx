import Link from "next/link";
import React from "react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 p-4 pt-8 font-sans transition-colors duration-300 sm:p-8 sm:pt-12 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-start gap-6 sm:gap-8 bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex w-full items-center justify-between mb-2">
          <Link
            href="/"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            &larr; ホームに戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-4 w-full">
          利用規約
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none w-full text-sm sm:text-base leading-relaxed">
          <p>
            この利用規約（以下、「本規約」といいます。）は、Lotto 7
            Analysis（以下、「本サービス」といいます。）の利用条件を定めるものです。本サービスをご利用になる皆様（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第1条（適用）
          </h2>
          <p>
            本規約は、ユーザーと本サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第2条（免責事項）
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              本サービスは過去の抽せんデータ等に基づき独自のアルゴリズムで予測や分析を提供するものであり、当せんを保証するものではありません。
            </li>
            <li>
              本サービスで提供される情報に基づいて宝くじを購入した結果、損害が発生した場合でも、本サービスは一切の責任を負いません。宝くじの購入はユーザー自身の判断と責任において行ってください。
            </li>
            <li>
              本サービスは、提供する情報の正確性、完全性、最新性について一切の保証を行いません。
            </li>
            <li>
              本サービスは、事前の通知なく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第3条（禁止事項）
          </h2>
          <p>
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              本サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
            </li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>
              本サービスの提供するデータを無断でスクレイピング・複製・二次利用する行為
            </li>
            <li>その他、本サービスが不適切と判断する行為</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第4条（利用規約の変更）
          </h2>
          <p>
            本サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第5条（準拠法・裁判管轄）
          </h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、本サービス運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>

          <p className="mt-8 text-right text-sm text-zinc-500">
            制定日：2026年3月3日
            <br />
            最終改定日：2026年3月3日
          </p>
        </div>
      </main>
    </div>
  );
}
