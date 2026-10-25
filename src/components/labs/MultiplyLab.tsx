import { useMemo, useState } from "react";
import { fmt, matMul, type Mat } from "@/lib/linalg";
import { Button } from "@/components/ui/button";
import { LabCard, MatrixGrid } from "./shared";
import { cn } from "@/lib/utils";

export function MultiplyLab({ standalone = false }: { standalone?: boolean }) {
  const [A, setA] = useState<Mat>([
    [1, 2],
    [0, 1],
  ]);
  const [B, setB] = useState<Mat>([
    [2, 0],
    [1, 3],
  ]);
  const [cell, setCell] = useState(0);
  const C = useMemo(() => matMul(A, B), [A, B]);
  const i = Math.floor(cell / 2);
  const j = cell % 2;
  const terms = A[i].map((a, k) => ({ a, b: B[k][j], p: a * B[k][j] }));

  return (
    <LabCard
      labId={standalone ? "multiply" : undefined}
      title="行乘列"
      hint="矩阵乘法没有交换律。点选输出格子，看它如何由 A 的一行和 B 的一列点出来。"
    >
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">A</p>
          <MatrixGrid value={A} onChange={setA} />
        </div>
        <div className="self-center font-serif text-xl text-muted-foreground">×</div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">B</p>
          <MatrixGrid value={B} onChange={setB} />
        </div>
        <div className="self-center font-serif text-xl text-muted-foreground">=</div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">AB</p>
          <div className="grid grid-cols-2 gap-1.5">
            {C.flatMap((row, r) =>
              row.map((v, c) => {
                const idx = r * 2 + c;
                const on = idx === cell;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCell(idx)}
                    className={cn(
                      "h-11 w-14 rounded-sm font-mono text-sm tabular-nums shadow-[var(--shadow-border)]",
                      on ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground",
                    )}
                  >
                    {fmt(v)}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-sm leading-relaxed text-foreground">
        C<sub>{i + 1}{j + 1}</sub> ={" "}
        {terms.map((t, k) => (
          <span key={k}>
            {k ? " + " : ""}
            <span className="text-accent">{fmt(t.a)}</span>×
            <span>{fmt(t.b)}</span>
          </span>
        ))}{" "}
        = {fmt(C[i][j])}
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setCell((cell + 3) % 4)}>
          上一格
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setCell((cell + 1) % 4)}>
          下一格
        </Button>
      </div>
    </LabCard>
  );
}
