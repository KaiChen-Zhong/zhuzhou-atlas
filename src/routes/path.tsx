import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { chapters, stages } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/path")({ component: PathPage });

function PathPage() {
  const completed = useProgress((s) => s.completed);
  const labsDone = useProgress((s) => s.labs);

  return (
    <AppShell sidebar={false}>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">学习动线</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">按这条路走完</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          不要跳章。每一章的实验和自测是为后面铺路的：没有内积，注意力只是符号；没有 SVD，LoRA 只是口诀。
        </p>
        <div className="mt-12 space-y-12">
          {stages.map((st) => (
            <section key={st.id}>
              <header className="mb-5 flex items-baseline gap-3">
                <span className="font-mono text-sm text-accent">{st.index}</span>
                <h2 className="font-serif text-2xl font-semibold">{st.title}</h2>
                <span className="text-sm text-muted-foreground">{st.subtitle}</span>
              </header>
              <ol className="divide-y divide-border overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
                {chapters
                  .filter((c) => c.stage === st.id)
                  .map((c, i) => (
                    <li key={c.id}>
                      <Link
                        to="/chapter/$slug"
                        params={{ slug: c.slug }}
                        className="flex min-h-16 items-center gap-4 px-4 py-3 transition-[background-color] duration-150 hover:bg-secondary"
                      >
                        <span className="w-6 font-mono text-xs text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            completed[c.id] ? "bg-accent" : "bg-border",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{c.title}</p>
                          <p className="truncate text-sm text-muted-foreground">{c.brief}</p>
                        </div>
                        <div className="hidden items-center gap-2 sm:flex">
                          {c.lab ? (
                            <Badge variant={labsDone[c.lab] ? "accent" : "default"}>
                              {labsDone[c.lab] ? "实验已做" : "含实验"}
                            </Badge>
                          ) : null}
                          <span className="text-xs tabular-nums text-muted-foreground">{c.minutes}′</span>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
