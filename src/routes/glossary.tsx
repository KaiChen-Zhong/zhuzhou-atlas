import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { glossary } from "@/content/glossary";
import { RichText } from "@/components/math/Katex";

export const Route = createFileRoute("/glossary")({ component: GlossaryPage });

function GlossaryPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return glossary;
    return glossary.filter(
      (t) =>
        t.term.toLowerCase().includes(s) ||
        t.en.toLowerCase().includes(s) ||
        t.body.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <AppShell sidebar={false}>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">词典</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">词汇表</h1>
        <p className="mt-3 text-muted-foreground">每个词配一句「它在 AI 里长什么样」。用来复习，不是用来第一次学。</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：SVD、秩、Hessian…"
          className="mt-8 h-11 w-full rounded-md bg-card px-3 text-sm shadow-[var(--shadow-border)] placeholder:text-muted-foreground"
        />
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
          {list.map((t) => (
            <li key={t.id} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="font-serif text-lg font-semibold">{t.term}</h2>
                <span className="font-mono text-xs text-muted-foreground">{t.en}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                <RichText text={t.body} />
              </p>
            </li>
          ))}
        </ul>
        {list.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">没有匹配的词。试试「奇异值」或 “rank”。</p>
        ) : null}
      </main>
    </AppShell>
  );
}
