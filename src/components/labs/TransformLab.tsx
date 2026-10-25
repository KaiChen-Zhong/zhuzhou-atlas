import { useMemo, useState } from "react";
import { apply2, det2, fmt, type Mat } from "@/lib/linalg";
import { GridLines, LabCard, NumberField, PLANE, planeX, planeY, PresetRow, Stat } from "./shared";

const PRESETS: Record<string, Mat> = {
  id: [
    [1, 0],
    [0, 1],
  ],
  scale: [
    [2, 0],
    [0, 0.6],
  ],
  shear: [
    [1, 1.2],
    [0, 1],
  ],
  rot: [
    [0.7, -0.7],
    [0.7, 0.7],
  ],
  sing: [
    [1, 2],
    [0.5, 1],
  ],
};

function Parallelogram({ A, fill, stroke }: { A: Mat; fill: string; stroke: string }) {
  const pts = [
    apply2(A, 0, 0),
    apply2(A, 1, 0),
    apply2(A, 1, 1),
    apply2(A, 0, 1),
  ]
    .map(([x, y]) => `${planeX(x)},${planeY(y)}`)
    .join(" ");
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

export function TransformLab({ standalone = false }: { standalone?: boolean }) {
  const [preset, setPreset] = useState("shear");
  const [A, setA] = useState<Mat>(PRESETS.shear);

  const det = det2(A);
  const e1 = apply2(A, 1, 0);
  const e2 = apply2(A, 0, 1);

  const warped = useMemo(() => {
    const pts: [number, number, number, number][] = [];
    for (let i = -3; i <= 3; i++) {
      const a = apply2(A, i, -3);
      const b = apply2(A, i, 3);
      pts.push([a[0], a[1], b[0], b[1]]);
      const c = apply2(A, -3, i);
      const d = apply2(A, 3, i);
      pts.push([c[0], c[1], d[0], d[1]]);
    }
    return pts;
  }, [A]);

  function pick(id: string) {
    setPreset(id);
    setA(PRESETS[id].map((r) => r.slice()));
  }

  function setCell(i: number, j: number, v: number) {
    const next = A.map((r) => r.slice());
    next[i][j] = v;
    setA(next);
    setPreset("custom");
  }

  return (
    <LabCard
      labId={standalone ? "transform" : undefined}
      title="矩阵是一台线性机器"
      hint="改四个数字，看单位正方形变成怎样的平行四边形。列 = 基向量被打到哪里。"
    >
      <div className="mb-4">
        <PresetRow
          current={preset}
          onPick={pick}
          items={[
            { id: "id", label: "单位" },
            { id: "scale", label: "缩放" },
            { id: "shear", label: "切变" },
            { id: "rot", label: "旋转" },
            { id: "sing", label: "奇异" },
          ]}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <svg
          viewBox={`0 0 ${PLANE.size} ${PLANE.size}`}
          className="aspect-square w-full max-w-[420px] justify-self-center rounded-lg bg-background"
        >
          <GridLines />
          {warped.map((p, i) => (
            <line
              key={i}
              x1={planeX(p[0])}
              y1={planeY(p[1])}
              x2={planeX(p[2])}
              y2={planeY(p[3])}
              stroke="var(--color-accent)"
              strokeOpacity={0.28}
              strokeWidth={0.8}
            />
          ))}
          <Parallelogram A={[[1, 0], [0, 1]]} fill="transparent" stroke="var(--color-muted-foreground)" />
          <Parallelogram A={A} fill="color-mix(in oklab, var(--color-accent) 18%, transparent)" stroke="var(--color-accent)" />
          <line x1={planeX(0)} y1={planeY(0)} x2={planeX(e1[0])} y2={planeY(e1[1])} stroke="var(--color-primary)" strokeWidth={2} />
          <line x1={planeX(0)} y1={planeY(0)} x2={planeX(e2[0])} y2={planeY(e2[1])} stroke="var(--color-accent)" strokeWidth={2} />
        </svg>
        <div className="space-y-3">
          <NumberField label="a" value={A[0][0]} onChange={(v) => setCell(0, 0, v)} />
          <NumberField label="b" value={A[0][1]} onChange={(v) => setCell(0, 1, v)} />
          <NumberField label="c" value={A[1][0]} onChange={(v) => setCell(1, 0, v)} />
          <NumberField label="d" value={A[1][1]} onChange={(v) => setCell(1, 1, v)} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="det W  面积比" value={fmt(det)} />
            <Stat label="列 1 → W e₁" value={`${fmt(e1[0])}, ${fmt(e1[1])}`} />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {Math.abs(det) < 1e-3
              ? "行列式 ≈ 0：空间被压扁，信息有丢失，矩阵不可逆。这就是奇异。"
              : det < 0
                ? "行列式为负：还含一次反射，朝向翻转。"
                : "行列式是体积缩放。全连接层每一层都在这样重新铺坐标。"}
          </p>
        </div>
      </div>
    </LabCard>
  );
}
