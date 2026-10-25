import { useMemo, useState } from "react";
import { fmt, frobenius, lowRankApprox, svd2, type Mat } from "@/lib/linalg";
import { LabCard, Stat } from "./shared";

const W: Mat = [
  [2.4, 1.1],
  [0.8, 1.6],
];

function Heat2({ M, cap }: { M: Mat; cap: number }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {M.flatMap((row, i) =>
        row.map((v, j) => {
          const t = Math.max(0, Math.min(1, Math.abs(v) / cap));
          return (
            <div
              key={`${i}-${j}`}
              className="flex h-16 items-center justify-center rounded-md font-mono text-sm tabular-nums"
              style={{
                background: `color-mix(in oklab, var(--color-accent) ${Math.round(t * 72)}%, var(--color-secondary))`,
                color: t > 0.5 ? "var(--color-accent-foreground)" : "var(--color-foreground)",
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

export function LoraLab({ standalone = false }: { standalone?: boolean }) {
  const [r, setR] = useState(1);
  const svd = useMemo(() => svd2(W), []);
  const approx = useMemo(() => lowRankApprox(W, r), [r]);
  const err = frobenius(W.map((row, i) => row.map((v, j) => v - approx[i][j])));
  const full = 4096 * 4096;
  const lora = r * (4096 + 4096);

  return (
    <LabCard
      labId={standalone ? "lora" : undefined}
      title="低秩近似与 LoRA"
      hint="Eckart–Young：截断到前 r 个奇异值，是所有秩 ≤ r 矩阵里对 W 的最佳近似。LoRA 假设任务增量正好落在这个薄子空间。"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">原始 W</p>
          <Heat2 M={W} cap={2.6} />
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">秩 {r} 近似</p>
          <Heat2 M={approx} cap={2.6} />
        </div>
      </div>
      <label className="mt-5 flex h-11 items-center gap-3 text-sm">
        <span className="w-8 text-muted-foreground">r</span>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <span className="font-mono tabular-nums">{r}</span>
      </label>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="σ₁, σ₂" value={`${fmt(svd.S[0])} , ${fmt(svd.S[1])}`} />
        <Stat label="近似误差 ‖·‖F" value={fmt(err, 3)} />
        <Stat label="4096×4096 满量" value={full.toLocaleString()} />
        <Stat label={`LoRA r=${r || 1} 参数`} value={lora.toLocaleString()} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        右边 r=1 时只保留主方向，细节被抹掉；r=2 完全恢复。微调时冻结 W、只学 BA，参数量从 d² 降到 r(d+k)。
      </p>
    </LabCard>
  );
}
