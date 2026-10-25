import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";

export function LabCard({
  title,
  hint,
  labId,
  children,
  className,
}: {
  title: string;
  hint?: string;
  labId?: string;
  children: ReactNode;
  className?: string;
}) {
  const markLab = useProgress((s) => s.markLab);
  useEffect(() => {
    if (labId) markLab(labId);
  }, [labId, markLab]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
        className,
      )}
    >
      <header className="mb-4 flex flex-col gap-1">
        <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">实验</p>
        <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-secondary px-3 py-2">
      <div className="text-[11px] tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-sm tabular-nums text-foreground">{value}</div>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = 0.1,
  min = -4,
  max = 4,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2">
      <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full accent-accent"
      />
      <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums">{value.toFixed(1)}</span>
    </label>
  );
}

export function MatrixGrid({
  value,
  onChange,
  labels,
}: {
  value: number[][];
  onChange?: (next: number[][]) => void;
  labels?: string[];
}) {
  return (
    <div className="inline-flex items-center gap-2">
      {labels?.[0] ? <span className="font-serif text-lg text-muted-foreground">{labels[0]}</span> : null}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${value[0]?.length ?? 1}, minmax(3.25rem, 1fr))` }}
      >
        {value.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              inputMode="decimal"
              step={0.1}
              value={Number.isFinite(cell) ? cell : 0}
              disabled={!onChange}
              onChange={(e) => {
                if (!onChange) return;
                const next = value.map((r) => r.slice());
                next[i][j] = Number(e.target.value);
                onChange(next);
              }}
              className="h-11 w-14 rounded-sm bg-secondary text-center font-mono text-sm tabular-nums text-foreground shadow-[var(--shadow-border)] disabled:opacity-70"
            />
          )),
        )}
      </div>
      {labels?.[1] ? <span className="font-serif text-lg text-muted-foreground">{labels[1]}</span> : null}
    </div>
  );
}

export function PresetRow({
  items,
  current,
  onPick,
}: {
  items: { id: string; label: string }[];
  current: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPick(p.id)}
          className={cn(
            "h-9 min-h-9 rounded-full px-3 text-xs font-medium transition-[background-color,color] duration-150",
            current === p.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export const PLANE = { min: -3.2, max: 3.2, size: 320 };

export function planeX(x: number, w = PLANE.size) {
  const { min, max } = PLANE;
  return ((x - min) / (max - min)) * w;
}
export function planeY(y: number, h = PLANE.size) {
  const { min, max } = PLANE;
  return ((max - y) / (max - min)) * h;
}
export function fromPlane(px: number, py: number, w = PLANE.size, h = PLANE.size) {
  const { min, max } = PLANE;
  return {
    x: min + (px / w) * (max - min),
    y: max - (py / h) * (max - min),
  };
}

export function GridLines() {
  const ticks: number[] = [];
  for (let i = -3; i <= 3; i++) ticks.push(i);
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={planeX(t)}
            y1={planeY(-3.2)}
            x2={planeX(t)}
            y2={planeY(3.2)}
            stroke="currentColor"
            className="text-foreground/10"
            strokeWidth={t === 0 ? 1.4 : 0.6}
          />
          <line
            x1={planeX(-3.2)}
            y1={planeY(t)}
            x2={planeX(3.2)}
            y2={planeY(t)}
            stroke="currentColor"
            className="text-foreground/10"
            strokeWidth={t === 0 ? 1.4 : 0.6}
          />
        </g>
      ))}
    </g>
  );
}

export function Arrow({
  x,
  y,
  color,
  dashed,
}: {
  x: number;
  y: number;
  color: string;
  dashed?: boolean;
}) {
  const x1 = planeX(0);
  const y1 = planeY(0);
  const x2 = planeX(x);
  const y2 = planeY(y);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 4) return null;
  const ah = 8;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - Math.cos(angle) * 6}
        y2={y2 - Math.sin(angle) * 6}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon
        points={`0,0 -${ah},4 -${ah},-4`}
        fill={color}
        transform={`translate(${x2},${y2}) rotate(${(angle * 180) / Math.PI})`}
      />
    </g>
  );
}
