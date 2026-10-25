import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Blocks, Takeaways } from "@/components/lesson/Blocks";
import { Button } from "@/components/ui/button";
import { contentById } from "@/content";
import { chapterBySlug, neighbors, stageOf } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/chapter/$slug")({
  loader: ({ params }) => {
    const meta = chapterBySlug(params.slug);
    if (!meta) throw notFound();
    const content = contentById(meta.id);
    if (!content) throw notFound();
    return { meta, content };
  },
  component: ChapterPage,
  notFoundComponent: () => (
    <AppShell>
      <main className="px-5 py-16">
        <p className="text-muted-foreground">这一章不存在。</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/path">回到动线</Link>
        </Button>
      </main>
    </AppShell>
  ),
});

function ChapterPage() {
  const { meta, content } = Route.useLoaderData();
  const { prev, next, index } = neighbors(meta.slug);
  const stage = stageOf(meta.stage);
  const mark = useProgress((s) => s.markChapter);
  const setLast = useProgress((s) => s.setLast);
  const done = useProgress((s) => s.completed[meta.id]);

  useEffect(() => {
    setLast(meta.slug);
  }, [meta.slug, setLast]);

  return (
    <AppShell>
      <article className="px-4 py-8 sm:px-8 sm:py-10">
        <header className="mx-auto max-w-2xl">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">
            {stage.index} {stage.title} · {String(index + 1).padStart(2, "0")} / 12
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {meta.brief} · {meta.minutes} 分钟
          </p>
          <div className="mt-6">
            <Takeaways items={content.takeaways} />
          </div>
        </header>
        <div className="mx-auto mt-10 max-w-2xl">
          <Blocks blocks={content.blocks} />
        </div>
        <footer className="mx-auto mt-12 max-w-2xl border-t border-border pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant={done ? "secondary" : "accent"}
              onClick={() => mark(meta.id)}
              className="sm:mr-auto"
            >
              <Check className="size-4" />
              {done ? "已完成" : "标记本章完成"}
            </Button>
            {prev ? (
              <Button asChild variant="outline">
                <Link to="/chapter/$slug" params={{ slug: prev.slug }}>
                  <ArrowLeft className="size-4" />
                  {prev.title}
                </Link>
              </Button>
            ) : null}
            {next ? (
              <Button asChild>
                <Link to="/chapter/$slug" params={{ slug: next.slug }}>
                  {next.title}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/exam">
                  去总测验
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </footer>
      </article>
    </AppShell>
  );
}
