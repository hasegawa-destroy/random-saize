"use client";

import { useEffect, useRef, useState } from "react";
import { menus } from "./data/menu";

export default function Home() {
  const [randomNumbers, setRandomNumbers] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<typeof menus>([]);
  const [isStopped, setIsStopped] = useState(false);

  // 直近の4桁を保持
  const lastDigits = useRef("");

  // 追加済みのメニュー番号
  const foundNumbers = useRef(new Set<string>());

  const totalPrice = selectedMenus.reduce((total, menu) => total + menu.price, 0);

  const isHighlighted = (index: number) => {
    return selectedMenus.some((menu) => {
      let start = randomNumbers.indexOf(menu.number);

      while (start !== -1) {
        // 4桁の番号の範囲内か判定
        if (index >= start && index < start + menu.number.length) {
          return true;
        }

        // 次の出現位置を検索
        start = randomNumbers.indexOf(menu.number, start + 1);
      }

      return false;
    });
  };

  const handleReset = () => {
    // 表示をリセット
    setRandomNumbers("");
    setSelectedMenus([]);

    // 停止状態をリセット
    setIsStopped(false);

    // refもリセット
    lastDigits.current = "";
    foundNumbers.current.clear();
  };

  useEffect(() => {
    if (isStopped) return;

    const timer = setInterval(() => {
      const digit = String(Math.floor(Math.random() * 10));

      // 直近4桁だけを更新
      const nextDigits = (lastDigits.current + digit).slice(-4);
      lastDigits.current = nextDigits;

      setRandomNumbers((prev) => prev + digit);

      // 4桁そろったら照合
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
  }, [isStopped]);

  useEffect(() => {
    if (totalPrice >= 2000) {
      setIsStopped(true);
    }
  }, [totalPrice]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <div className="w-full shrink-0 py-6 border-b text-center">
        <p>ランダム注文サイゼリヤ</p>
      </div>

      <div className="w-full flex-1 min-h-0 flex flex-col gap-2 px-4 py-4">
        <div className="p-2 border rounded-xl">
          <div className="">
            <p>予算：{"2000"}円</p>
            <p>現在の金額：{totalPrice}円</p>
          </div>
          <hr className="my-2 border-gray-300" />
          <div className="max-h-32 overflow-y-auto break-all">
            <p>
              {randomNumbers.split("").map((digit, index) => (
                <span
                  key={index}
                  className={isHighlighted(index) ? "text-red-500" : ""}
                >
                  {digit}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-2 border rounded-xl">
          {selectedMenus.map((menu) => (
            <article
              key={menu.number}
              className="flex justify-between items-center rounded-sm border p-4 mb-2"
            >
              <div className="flex-1">
                <p className="font-bold">{menu.number}</p>
                <p className="text-sm">{menu.name}</p>
              </div>
              <p className="whitespace-nowrap">{menu.price}円</p>
            </article>
          ))}
        </div>

        <div className="shrink-0 flex flex-col justify-center gap-2">
          <button onClick={handleReset} className="py-2 rounded-2xl border">やりなおす</button>
          <button className="py-2 rounded-2xl border">もどる</button>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <p>予算内でランダムなメニューを注文</p>
      </div>

      <div className="w-full">
        <div className="flex justify-center">
          <p>予算：</p>
          <input
            type="number"
            className="ml-2 px-1 border text-right"
          />
          <p className="ml-1">円</p>
        </div>
        <div className="flex justify-center">
          <button className="px-24 py-2 rounded-2xl border">注文表作成</button>
        </div>
      </div> */}
    </div>
  );
}
