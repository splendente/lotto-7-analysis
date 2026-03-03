import Link from "next/link";
import React from "react";

export default function PrivacyPolicyPage() {
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
          プライバシーポリシー
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none w-full text-sm sm:text-base leading-relaxed">
          <p>
            Lotto 7
            Analysis（以下、「本サービス」といいます。）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第1条（個人情報の収集方法）
          </h2>
          <p>
            本サービスは、現状においてユーザーの氏名、住所、電話番号、メールアドレスなどの個人を特定できる情報を積極的に収集・保存する機能を有しておりません。
            ただし、本サービスの利用にあたって、アクセス解析ツール等により利用者の端末情報やIPアドレス、アクセスログ等が自動的に収集される場合があります。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第2条（アクセス解析ツールについて）
          </h2>
          <p>
            本サービスでは、利用状況の把握やサービス向上のために、アクセス解析ツール等を使用する場合があります。これらのツールはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            ユーザーはブラウザの設定によりCookieを無効にすることで、データの収集を拒否することが可能です。
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第3条（個人情報の利用目的）
          </h2>
          <p>
            本サービスが自動的に収集した情報等は、以下の目的の範囲内で利用します。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>本サービスの提供・運営のため</li>
            <li>
              ユーザーからの各種お問い合わせに回答するため（お問い合わせ機能が追加された場合）
            </li>
            <li>
              本サービスの利用状況を分析し、機能改善や新機能の開発に役立てるため
            </li>
            <li>不正利用やスパム行為の防止・対応のため</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第4条（個人情報の第三者提供）
          </h2>
          <p>
            本サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
            </li>
            <li>
              公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
            </li>
            <li>
              国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
            </li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
            第5条（プライバシーポリシーの変更）
          </h2>
          <p>
            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。変更後のプライバシーポリシーは、本サービス上に掲載したときから効力を生じるものとします。
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
