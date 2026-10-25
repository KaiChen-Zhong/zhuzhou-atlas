import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { chapters, stages, totalMinutes } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const last = useProgress((s) => s.lastSlug);
  const completed = useProgress((s) => s.completed);
  const resume = last ? chapters.find((c) => c.slug === last) : null;
  const start = chapters[0];

  return (
    <AppShell sidebar={false}>
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-80" />
          <div className="relative mx-auto max-w-3xl px-5 py-16 sm:py-24">
            <p className="mb-4 text-xs font-medium tracking-[0.22em] text-accent uppercase">
              面向 AI 的矩阵论动线课
            </p>
            <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
              主轴
              <span className="mt-2 block text-2xl font-normal text-muted-foreground sm:text-3xl">
                从向量走到注意力
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              数据是向量，模型是矩阵，学习是微积分。十二章循序渐进，八个可动手实验，每学一个概念就把它在线性层、PCA、LoRA 和 Transformer 里认出来。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link
                  to="/chapter/$slug"
                  params={{ slug: resume?.slug ?? start.slug }}
                >
                  {resume ? `继续：${resume.title}` : "从地图开始"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/path">看完整动线</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              {chapters.length} 章 · {formatMinutes(totalMinutes)} · 进度保存在这台设备上
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-14">
          <p className="mb-8 text-xs tracking-[0.18em] text-muted-foreground uppercase">四段动线</p>
          <ol className="relative space-y-10">
            <div className="absolute top-2 bottom-2 left-[15px] w-px bg-border" />
            {stages.map((st) => {
              const cs = chapters.filter((c) => c.stage === st.id);
              const done = cs.filter((c) => completed[c.id]).length;
              return (
                <li key={st.id} className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-4">
                  <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-secondary font-mono text-[11px] text-accent">
                    {st.index}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h2 className="font-serif text-2xl font-semibold">{st.title}</h2>
                      <span className="text-xs text-muted-foreground">
                        {done}/{cs.length} 章
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{st.subtitle}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {cs.map((c) => (
                        <li key={c.id}>
                          <Link
                            to="/chapter/$slug"
                            params={{ slug: c.slug }}
                            className="inline-flex h-9 items-center rounded-full bg-secondary px-3 text-xs text-foreground/90 hover:bg-surface"
                          >
                            {c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid max-w-3xl gap-8 px-5 py-14 sm:grid-cols-3">
            {[
              { k: "循序渐进", v: "先几何，后公式。每章都能用手算一个 2×2。" },
              { k: "举一反三", v: "同一个内积，会在检索、注意力、线性层、Gram 里出现四次。" },
              { k: "对着模型看", v: "读完应能把一篇 Transformer 论文的第 3 节逐公式对上。" },
            ].map((item) => (
              <div key={item.k}>
                <h3 className="font-serif text-lg font-semibold">{item.k}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.v}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
