
"use client";

import { useEffect, useState } from "react";

type BudgetDialogProps = {
    isOpen: boolean;
    onConfirm: (budget: number) => void;
};

export default function BudgetDialog({
    isOpen,
    onConfirm,
}: BudgetDialogProps) {
    const [budget, setBudget] = useState("0");

    // ダイアログを開くたびに入力値をリセット
    useEffect(() => {
        if (isOpen) {
            setBudget("0");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = Number(budget);

        if (!Number.isFinite(value) || value <= 0) return;

        onConfirm(value);
    };

    // Hooksの後に条件判定する
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">

                <div className="mb-5 text-center">
                    <h2 className="text-xl font-bold text-primary">
                        予算設定
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        今回の注文予算を設定してください
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="budget"
                        className="mb-2 block text-sm font-medium"
                    >
                        予算
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            id="budget"
                            type="number"
                            min="1"
                            step="1"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full rounded-lg border border-border bg-white px-3 py-3 text-right text-xl font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="予算を入力..."
                            required
                            autoFocus
                        />
                        <span className="font-bold">円</span>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-xl bg-primary py-3 font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
                    >
                        スタート
                    </button>
                </form>

            </div>
        </div>
    );
}
