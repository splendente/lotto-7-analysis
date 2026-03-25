import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ],
  });
  const page = await browser.newPage();

  await page.goto(
    "https://www.mizuhobank.co.jp/takarakuji/check/loto/loto7/index.html",
    {
      waitUntil: "networkidle2",
    },
  );

  // Wait for the table to be populated
  await page.waitForSelector(".js-lottery-issue-pc", { visible: true });

  const result = await page.evaluate(() => {
    const issueText = document
      .querySelector(".js-lottery-issue-pc")
      ?.textContent?.trim();
    if (!issueText) return null;

    // "第667回ロト７" -> "第667回"
    const issueMatch = issueText.match(/第\d+回/);
    const issue = issueMatch ? issueMatch[0] : null;

    // Find the row for main numbers
    const mainNumbersRow = Array.from(
      document.querySelectorAll(".section__table-row"),
    ).find((row) => {
      const th = row.querySelector("th");
      return th?.textContent.includes("本数字");
    });

    // Find the row for bonus numbers
    const bonusNumbersRow = Array.from(
      document.querySelectorAll(".section__table-row"),
    ).find((row) => {
      const th = row.querySelector("th");
      return th?.textContent.includes("ボーナス数字");
    });

    const mainNumbers = Array.from(mainNumbersRow.querySelectorAll("td"))
      .map((td) => td.textContent.trim())
      .filter((text) => text !== "");

    const bonusNumbers = Array.from(bonusNumbersRow.querySelectorAll("td"))
      .map((td) => td.textContent.trim().replace(/[()（）]/g, ""))
      .filter((text) => text !== "");

    return {
      issue,
      main_numbers: mainNumbers,
      bonus_numbers: bonusNumbers,
    };
  });

  await browser.close();

  if (!result || !result.issue) {
    console.error("Failed to scrape the data.");
    process.exit(1);
  }

  console.log("Scraped result:", result);

  // Read current results
  const resultsPath = path.resolve("src/data/results.json");
  const data = JSON.parse(await fs.readFile(resultsPath, "utf8"));

  // Check if issue already exists
  const exists = data.results.some((r) => r.issue === result.issue);
  if (exists) {
    console.log(
      `Issue ${result.issue} already exists in results.json. No update needed.`,
    );
    return;
  }

  // Append new result
  data.results.push(result);

  // Save updated results
  await fs.writeFile(resultsPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Successfully added ${result.issue} to results.json.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
