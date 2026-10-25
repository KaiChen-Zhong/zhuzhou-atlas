import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { labs } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/labs")({ component: LabsPage });

function LabsPage() {
  const done = useProgress((s) => s.labs);
  return (
    <AppShell sidebar={false}>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">动手</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">八个实验</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          拖向量、改矩阵、走一步梯度。几何进脑子之后，公式只是速记。
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {labs.map((lab, i) => (
            <li key={lab.id}>
              <Link
                to="/lab/$slug"
                params={{ slug: lab.id }}
                className={cn(
                  "flex h-full min-h-28 flex-col rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 hover:shadow-[var(--shadow-border-hover)] hover:bg-surface",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("size-1.5 rounded-full", done[lab.id] ? "bg-accent" : "bg-border")} />
                </div>
                <h2 className="mt-3 font-serif text-xl font-semibold">{lab.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{lab.brief}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </AppShell>
  );
}
