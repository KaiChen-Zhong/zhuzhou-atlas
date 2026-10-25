import { useMemo, useState } from "react";
import { apply2, fmt, matMul, rotate, svd2, transpose, type Mat } from "@/lib/linalg";
import { Button } from "@/components/ui/button";
import { GridLines, LabCard, NumberField, PLANE, planeX, planeY, Stat } from "./shared";

function ellipsePoints(A: Mat) {
  const pts: string[] = [];
  for (let t = 0; t <= 72; t++) {
    const a = (t / 72) * Math.PI * 2;
    const [x, y] = apply2(A, Math.cos(a), Math.sin(a));
    pts.push(`${planeX(x)},${planeY(y)}`);
  }
  return pts.join(" ");
}

export function SvdLab({ standalone = false }: { standalone?: boolean }) {
  const [A, setA] = useState<Mat>([
    [2, 1],
    [0.2, 1.1],
  ]);
  const [stage, setStage] = useState(3);
  const { U, S, V } = useMemo(() => svd2(A), [A]);

  const Vt = transpose(V);
  const Sigma: Mat = [
    [S[0], 0],
    [0, S[1]],
  ];
  const stages: Mat[] = useMemo(() => {
    const s0 = rotate(0);
    const s1 = Vt;
    const s2 = matMul(Sigma, Vt);
    const s3 = matMul(U, matMul(Sigma, Vt));
    return [s0, s1, s2, s3];
  }, [U, S, V, Vt]);

  const M = stages[stage];
  const labels = ["输入：单位圆", "Vᵀ 旋转到主轴", "Σ 沿主轴拉伸", "U 转到输出空间"];

  return (
    <LabCard
      labId={standalone ? "svd" : undefined}
      title="SVD：转 · 拉 · 转"
      hint="任意矩阵都能拆成两次旋转（或反射）夹一次拉伸。丢掉小的奇异值，就是最佳低秩近似。"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <svg
          viewBox={`0 0 ${PLANE.size} ${PLANE.size}`}
          className="aspect-square w-full max-w-[420px] justify-self-center rounded-lg bg-background"
        >
          <GridLines />
          <polygon
            points={ellipsePoints(M)}
            fill="color-mix(in oklab, var(--color-accent) 14%, transparent)"
            stroke="var(--color-accent)"
            strokeWidth={1.6}
          />
        </svg>
        <div className="space-y-3">
          <NumberField label="a" value={A[0][0]} onChange={(v) => setA([ [v, A[0][1]], [A[1][0], A[1][1]] ])} />
          <NumberField label="b" value={A[0][1]} onChange={(v) => setA([ [A[0][0], v], [A[1][0], A[1][1]] ])} />
          <NumberField label="c" value={A[1][0]} onChange={(v) => setA([ [A[0][0], A[0][1]], [v, A[1][1]] ])} />
          <NumberField label="d" value={A[1][1]} onChange={(v) => setA([ [A[0][0], A[0][1]], [A[1][0], v] ])} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="σ₁" value={fmt(S[0])} />
            <Stat label="σ₂" value={fmt(S[1])} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {labels.map((lab, i) => (
          <Button
            key={lab}
            size="sm"
            variant={stage === i ? "default" : "outline"}
            onClick={() => setStage(i)}
          >
            {i + 1}. {lab}
          </Button>
        ))}
      </div>
    </LabCard>
  );
}
