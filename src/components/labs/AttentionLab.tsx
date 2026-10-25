import { useMemo, useState } from "react";
import { fmt, matMul, softmax, transpose, type Mat } from "@/lib/linalg";
import { LabCard, PresetRow } from "./shared";
import { cn } from "@/lib/utils";

const TOKENS = ["它", "猫", "坐"];
const D = Math.sqrt(2);

const PRESETS: Record<string, { Q: Mat; K: Mat; V: Mat }> = {
  ident: {
    Q: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    K: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    V: [
      [1, 0],
      [0, 2],
      [3, 1],
    ],
  },
  focus: {
    Q: [
      [2, 0],
      [2, 0.1],
      [0, 2],
    ],
    K: [
      [2, 0],
      [2, 0],
      [0, 2],
    ],
    V: [
      [4, 0],
      [0, 1],
      [1, 4],
    ],
  },
  mix: {
    Q: [
      [0.2, 0.2],
      [0.2, 0.2],
      [0.2, 0.2],
    ],
    K: [
      [0.2, 0.2],
      [0.2, 0.2],
      [0.2, 0.2],
    ],
    V: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
};

function Heat({ M, cap }: { M: Mat; cap: number }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {M.flatMap((row, i) =>
        row.map((v, j) => {
          const t = Math.max(0, Math.min(1, v / cap));
          return (
            <div
              key={`${i}-${j}`}
              className="flex h-11 items-center justify-center rounded-sm font-mono text-[11px] tabular-nums"
              style={{
                background: `color-mix(in oklab, var(--color-accent) ${Math.round(t * 70)}%, var(--color-secondary))`,
                color: t > 0.55 ? "var(--color-accent-foreground)" : "var(--color-foreground)",
              }}
            >
              {fmt(v)}
            </div>
          );
        }),
      )}
    </div>
  );
}

export function AttentionLab({ standalone = false }: { standalone?: boolean }) {
  const [preset, setPreset] = useState("focus");
  const data = PRESETS[preset];
  const { scores, weights, out } = useMemo(() => {
    const scores = matMul(data.Q, transpose(data.K)).map((row) => row.map((v) => v / D));
    const weights = scores.map((row) => softmax(row));
    const out = matMul(weights, data.V);
    return { scores, weights, out };
  }, [data]);

  return (
    <LabCard
      labId={standalone ? "attention" : undefined}
      title="三词注意力"
      hint="softmax(QKᵀ / √d) V。每一行是一个 token 对其它 token 的权重，输出是 value 的凸组合。"
    >
      <div className="mb-4">
        <PresetRow
          current={preset}
          onPick={setPreset}
          items={[
            { id: "focus", label: "尖匹配" },
            { id: "ident", label: "近对角" },
            { id: "mix", label: "均匀混合" },
          ]}
        />
      </div>
      <div className="mb-3 flex gap-2 text-xs text-muted-foreground">
        {TOKENS.map((t) => (
          <span key={t} className="rounded-full bg-secondary px-2 py-1 font-mono">
            {t}
          </span>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">分数 QKᵀ / √d</p>
          <Heat M={scores} cap={3} />
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">softmax 权重（行和为 1）</p>
          <Heat M={weights} cap={1} />
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">输出 = 权重 × V</p>
          <div className="grid gap-1">
            {out.map((row, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-11 items-center justify-between rounded-sm bg-secondary px-3 font-mono text-xs tabular-nums",
                )}
              >
                <span className="text-muted-foreground">{TOKENS[i]}</span>
                <span>
                  ({fmt(row[0])}, {fmt(row[1])})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LabCard>
  );
}
