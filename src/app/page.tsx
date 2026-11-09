
"use client";

import { useEffect, useRef, useState } from "react";
import { menus } from "./data/menu";
import BudgetDialog from "./components/budgetDialog";

export default function Home() {
  const [randomNumbers, setRandomNumbers] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<typeof menus>([]);

  const [budget, setBudget] = useState<number | null>(null);
  const [isStopped, setIsStopped] = useState(true);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(true);

  // 直近の4桁を保持
  const lastDigits = useRef("");

  // 追加済みのメニュー番号
  const foundNumbers = useRef(new Set<string>());

  const totalPrice = selectedMenus.reduce(
    (total, menu) => total + menu.price,
    0
  );

  const isHighlighted = (index: number) => {
    return selectedMenus.some((menu) => {
      let start = randomNumbers.indexOf(menu.number);

      while (start !== -1) {
        if (index >= start && index < start + menu.number.length) {
          return true;
        }

        start = randomNumbers.indexOf(menu.number, start + 1);
      }

      return false;
    });
  };
  const handleReset = () => {
    setRandomNumbers("");
    setSelectedMenus([]);

    lastDigits.current = "";
    foundNumbers.current.clear();

    setIsStopped(false);
  };

  const handleBack = () => {
    setIsStopped(true);
    setIsBudgetDialogOpen(true);
  };

  const handleBudgetConfirm = (value: number) => {
    // 抽選結果をリセット
    setRandomNumbers("");
    setSelectedMenus([]);

    // 直近4桁と追加済み番号もリセット
    lastDigits.current = "";
    foundNumbers.current.clear();

    // 新しい予算を設定
    setBudget(value);

    // ダイアログを閉じる
    setIsBudgetDialogOpen(false);

    // 抽選を再開
    setIsStopped(false);
  };

  useEffect(() => {
    if (isStopped || isBudgetDialogOpen || budget === null) return;

    const timer = setInterval(() => {
      const digit = String(Math.floor(Math.random() * 10));

      const nextDigits = (lastDigits.current + digit).slice(-4);
      lastDigits.current = nextDigits;

      setRandomNumbers((prev) => prev + digit);

      if (nextDigits.length === 4) {
        const menu = menus.find(
          (item) => item.number === nextDigits
        );

        if (menu && !foundNumbers.current.has(menu.number)) {
          foundNumbers.current.add(menu.number);
          setSelectedMenus((prev) => [...prev, menu]);
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isStopped, isBudgetDialogOpen, budget]);

  useEffect(() => {
    if (budget !== null && totalPrice >= budget) {
      setIsStopped(true);
    }
  }, [totalPrice, budget]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-background">

      {/* ヘッダー */}
      <header className="w-full shrink-0 py-6 text-center bg-primary">
        <p className="text-white font-bold text-lg">
          ランダム注文サイゼリヤ
        </p>
      </header>

      <main className="w-full flex-1 min-h-0 flex flex-col gap-3 px-4 py-4">

        {/* 予算・金額カード */}
        <section className="shrink-0 p-3 bg-surface border border-border rounded-xl">

          <div className="flex justify-between items-center">
            <p>予算：{budget?.toLocaleString() ?? "-"}円</p>
            <p>現在の金額：{totalPrice.toLocaleString()}円</p>
          </div>

          <hr className="my-3 border-border" />

          {/* ランダム数字 */}
          <div className="max-h-32 overflow-y-auto break-all">
            <p className="leading-relaxed tracking-wider">
              {randomNumbers.split("").map((digit, index) => (
                <span
                  key={index}
                  className={isHighlighted(index) ? "text-accent font-bold" : ""}
                >
                  {digit}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* メニュー一覧 */}
        <section className="flex-1 min-h-0 overflow-y-auto p-3 bg-menu-area border border-border rounded-xl">

          <div className="flex justify-between items-center mb-3">
            <p className="font-bold">
              注文メニュー
            </p>
            <p className="text-sm text-muted">
              {selectedMenus.length}品
            </p>
          </div>

          {selectedMenus.map((menu) => (
            <article
              key={menu.number}
              className="flex justify-between items-center rounded-lg border border-border bg-menu-card p-4 mb-2"
            >
              <div className="flex-1">
                <p className="font-bold text-muted">
                  {menu.number}
                </p>
                <p className="text-sm">
                  {menu.name}
                </p>
              </div>

              <p className="whitespace-nowrap font-medium">
                {menu.price.toLocaleString()}円
              </p>
            </article>
          ))}

          {selectedMenus.length === 0 && (
            <p className="text-center text-muted text-sm py-8">
              メニューが追加されるまでお待ちください
            </p>
          )}
        </section>

        {/* ボタン */}
        <div className="shrink-0 flex flex-col gap-2">

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold border border-primary active:opacity-80"
          >
            やりなおす
          </button>

          <button
            onClick={handleBack}
            className="w-full py-3 rounded-xl bg-surface text-text border border-border font-medium"
          >
            もどる
          </button>

        </div>

        <BudgetDialog
          isOpen={isBudgetDialogOpen}
          onConfirm={handleBudgetConfirm}
        />

      </main>
    </div>
  );
}
