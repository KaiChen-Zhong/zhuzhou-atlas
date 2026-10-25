import { useMemo, useRef, useState } from "react";
import { dot, fmt, norm, scale } from "@/lib/linalg";
import {
  Arrow,
  fromPlane,
  GridLines,
  LabCard,
  PLANE,
  planeX,
  planeY,
  Stat,
} from "./shared";

export function VectorLab({ standalone = false }: { standalone?: boolean }) {
  const [u, setU] = useState<[number, number]>([2, 0.6]);
  const [v, setV] = useState<[number, number]>([0.8, 2]);
  const [drag, setDrag] = useState<"u" | "v" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const stats = useMemo(() => {
    const ip = dot(u, v);
    const nu = norm(u);
    const nv = norm(v);
    const cos = nu * nv < 1e-8 ? 0 : ip / (nu * nv);
    const projScale = nu < 1e-8 ? 0 : ip / (nu * nu);
    const proj = scale(u, projScale) as [number, number];
    return { ip, nu, nv, cos, proj, theta: (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI };
  }, [u, v]);

  function clientToVec(e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg) return [0, 0] as [number, number];
    const r = svg.getBoundingClientRect();
    const p = fromPlane(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    const clamp = (x: number) => Math.max(-3, Math.min(3, x));
    return [clamp(p.x), clamp(p.y)] as [number, number];
  }

  return (
    <LabCard
      labId={standalone ? "vector" : undefined}
      title="向量、内积与投影"
      hint="拖动箭头末端。内积 = 长度 × 长度 × 余弦。对齐且够长，分数才大。"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${PLANE.size} ${PLANE.size}`}
          className="aspect-square w-full max-w-[420px] justify-self-center rounded-lg bg-background touch-none"
          onPointerMove={(e) => {
            if (!drag) return;
            const p = clientToVec(e);
            if (drag === "u") setU(p);
            else setV(p);
          }}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        >
          <GridLines />
          <line
            x1={planeX(stats.proj[0])}
            y1={planeY(stats.proj[1])}
            x2={planeX(v[0])}
            y2={planeY(v[1])}
            stroke="var(--color-muted-foreground)"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Arrow x={stats.proj[0]} y={stats.proj[1]} color="var(--color-muted-foreground)" dashed />
          <Arrow x={u[0]} y={u[1]} color="var(--color-accent)" />
          <Arrow x={v[0]} y={v[1]} color="var(--color-primary)" />
          <circle
            cx={planeX(u[0])}
            cy={planeY(u[1])}
            r={14}
            fill="var(--color-accent)"
            fillOpacity={0.15}
            stroke="var(--color-accent)"
            className="cursor-grab"
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              setDrag("u");
            }}
          />
          <circle
            cx={planeX(v[0])}
            cy={planeY(v[1])}
            r={14}
            fill="var(--color-primary)"
            fillOpacity={0.12}
            stroke="var(--color-primary)"
            className="cursor-grab"
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              setDrag("v");
            }}
          />
        </svg>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          <Stat label="u · v  内积" value={fmt(stats.ip)} />
          <Stat label="cos θ  余弦" value={fmt(stats.cos)} />
          <Stat label="θ  夹角" value={`${fmt(stats.theta, 0)}°`} />
          <Stat label="‖u‖, ‖v‖" value={`${fmt(stats.nu)} , ${fmt(stats.nv)}`} />
          <p className="col-span-2 text-xs leading-relaxed text-muted-foreground lg:col-span-1">
            青绿是 u，浅纸色是 v。虚线是 v 在 u 上的投影——线性层的一个神经元，问的就是「输入在权重方向上有多长」。
          </p>
        </div>
      </div>
    </LabCard>
  );
}
