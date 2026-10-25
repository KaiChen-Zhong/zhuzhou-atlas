import { useMemo, useState } from "react";
import { apply2, eigen2, fmt, type Mat } from "@/lib/linalg";
import { Arrow, GridLines, LabCard, NumberField, PLANE, planeX, planeY, PresetRow, Stat } from "./shared";

const PRESETS: Record<string, Mat> = {
  stretch: [
    [2, 0.4],
    [0.4, 1],
  ],
  pca: [
    [2.2, 1.1],
    [1.1, 1.4],
  ],
  explode: [
    [1.6, 0],
    [0, 0.5],
  ],
  rot: [
    [0, -1],
    [1, 0],
  ],
};

export function EigenLab({ standalone = false }: { standalone?: boolean }) {
  const [preset, setPreset] = useState("pca");
  const [A, setA] = useState<Mat>(PRESETS.pca);

  const eig = useMemo(() => eigen2(A), [A]);

  const ellipse = useMemo(() => {
    const pts: string[] = [];
    for (let t = 0; t <= 64; t++) {
      const a = (t / 64) * Math.PI * 2;
      const [x, y] = apply2(A, Math.cos(a), Math.sin(a));
      pts.push(`${planeX(x)},${planeY(y)}`);
    }
    return pts.join(" ");
  }, [A]);

  function setCell(i: number, j: number, v: number) {
    const next = A.map((r) => r.slice());
    next[i][j] = v;
    if (i !== j && preset === "pca") next[j][i] = v;
    setA(next);
    setPreset("custom");
  }

  return (
    <LabCard
      labId={standalone ? "eigen" : undefined}
      title="主轴：特征值与特征向量"
      hint="特征向量是「变换后方向不变」的轴。对称矩阵（如协方差）的两根轴互相垂直。"
    >
      <div className="mb-4">
        <PresetRow
          current={preset}
          onPick={(id) => {
            setPreset(id);
            setA(PRESETS[id].map((r) => r.slice()));
          }}
          items={[
            { id: "pca", label: "协方差型" },
            { id: "stretch", label: "拉伸" },
            { id: "explode", label: "对角缩放" },
            { id: "rot", label: "纯旋转" },
          ]}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <svg
          viewBox={`0 0 ${PLANE.size} ${PLANE.size}`}
          className="aspect-square w-full max-w-[420px] justify-self-center rounded-lg bg-background"
        >
          <GridLines />
          <circle cx={planeX(0)} cy={planeY(0)} r={PLANE.size / (3.2 * 2)} fill="none" stroke="var(--color-muted-foreground)" strokeDasharray="3 3" />
          <polygon points={ellipse} fill="color-mix(in oklab, var(--color-accent) 12%, transparent)" stroke="var(--color-accent)" strokeWidth={1.4} />
          {!eig.complex ? (
            <>
              <Arrow x={eig.vectors[0][0] * eig.values[0]} y={eig.vectors[0][1] * eig.values[0]} color="var(--color-primary)" />
              <Arrow x={eig.vectors[1][0] * eig.values[1]} y={eig.vectors[1][1] * eig.values[1]} color="var(--color-accent)" />
            </>
          ) : null}
        </svg>
        <div className="space-y-3">
          <NumberField label="a" value={A[0][0]} onChange={(v) => setCell(0, 0, v)} />
          <NumberField label="b" value={A[0][1]} onChange={(v) => setCell(0, 1, v)} />
          <NumberField label="c" value={A[1][0]} onChange={(v) => setCell(1, 0, v)} />
          <NumberField label="d" value={A[1][1]} onChange={(v) => setCell(1, 1, v)} />
          {eig.complex ? (
            <p className="text-sm text-muted-foreground">纯旋转没有实特征向量：每个向量都被转走。特征值是复数。</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Stat label="λ₁" value={fmt(eig.values[0])} />
              <Stat label="λ₂" value={fmt(eig.values[1])} />
            </div>
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">
            单位圆被映成椭圆。长轴方向就是第一主成分——数据最散开的方向。RNN 里若谱半径大于 1，反复相乘就会爆炸。
          </p>
        </div>
      </div>
    </LabCard>
  );
}
