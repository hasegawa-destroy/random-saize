"use client";

import { useEffect, useRef, useState } from "react";
import { menus } from "./data/menu";

export default function Home() {
  const [randomNumbers, setRandomNumbers] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<typeof menus>([]);

  // 直近の4桁を保持
  const lastDigits = useRef("");

  // 追加済みのメニュー番号
  const foundNumbers = useRef(new Set<string>());

  useEffect(() => {
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
  }, []);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <div className="w-full shrink-0 py-6 border-b text-center">
        <p>ランダム注文サイゼリヤ</p>
      </div>

      <div className="w-full flex-1 min-h-0 flex flex-col gap-2 px-4 py-4">
        <div className="p-2 border rounded-xl">
          {/* <div className="">
            <p>予算：{"1000"}円</p>
            <p>現在の金額：{"200"}円</p>
          </div> */}
          <div className="max-h-32 overflow-y-auto break-all">
            <p>{randomNumbers}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-2 border rounded-xl">
          {selectedMenus.map((menu) => (
            <article
              key={menu.number}
              className="flex justify-between rounded-xl border p-4 mb-2"
            >
              <div>
                <p className="text-sm text-gray-500">{menu.number}</p>
                <p className="font-bold">{menu.name}</p>
              </div>
              <p>{menu.price}円</p>
            </article>
          ))}
        </div>

        <div className="shrink-0 flex flex-col justify-center gap-2">
          <button className="py-2 rounded-2xl border">やりなおす</button>
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
