import type { Block, CalloutKind } from "@/content/types";
import { RichText, Katex } from "@/components/math/Katex";
import { LabById } from "@/components/labs";
import { Quiz } from "./Quiz";
import { cn } from "@/lib/utils";

const calloutLabel: Record<CalloutKind, string> = {
  intuition: "直觉",
  ai: "AI 现身",
  transfer: "举一反三",
  warn: "易错",
  calc: "手算",
};

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "lead":
      return (
        <p className="font-serif text-xl leading-relaxed text-foreground/90">
          <RichText text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2 className="pt-4 font-serif text-2xl font-semibold tracking-tight">
          <RichText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-serif text-lg font-semibold tracking-tight">
          <RichText text={block.text} />
        </h3>
      );
    case "p":
      return (
        <p className="text-base leading-[1.85] text-foreground/90">
          <RichText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 text-base leading-relaxed text-foreground/90">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3">
              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
              <span>
                <RichText text={it} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2 text-base leading-relaxed">
          {block.items.map((it, i) => (
            <li key={it} className="flex gap-3">
              <span className="w-5 shrink-0 font-mono text-sm text-muted-foreground">{i + 1}.</span>
              <span>
                <RichText text={it} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "formula":
      return (
        <div className="overflow-x-auto rounded-lg bg-card px-4 py-3 shadow-[var(--shadow-border)]">
          <Katex tex={block.tex} block />
        </div>
      );
    case "callout":
      return (
        <aside className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
          <p className="mb-1.5 text-xs font-medium tracking-[0.14em] text-accent uppercase">
            {calloutLabel[block.kind]} · {block.title}
          </p>
          <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
            <RichText text={block.body} />
          </p>
        </aside>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl shadow-[var(--shadow-border)]">
          {block.caption ? (
            <p className="px-4 pt-3 text-xs text-muted-foreground">{block.caption}</p>
          ) : null}
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {block.columns.map((c) => (
                  <th key={c} className="px-4 py-2.5 font-medium">
                    <RichText text={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/70 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 align-top leading-relaxed">
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return (
        <figure>
          {block.caption ? (
            <figcaption className="mb-2 text-xs text-muted-foreground">{block.caption}</figcaption>
          ) : null}
          <pre className="overflow-x-auto rounded-lg bg-card p-4 font-mono text-xs leading-relaxed text-foreground shadow-[var(--shadow-border)] sm:text-sm">
            {block.code}
          </pre>
        </figure>
      );
    case "lab":
      return <LabById id={block.lab} />;
    case "quiz":
      return (
        <Quiz
          id={block.id}
          q={block.q}
          options={block.options}
          answer={block.answer}
          explain={block.explain}
        />
      );
    case "steps":
      return (
        <ol className="space-y-4">
          {block.items.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <RichText text={s.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export function Takeaways({ items }: { items: string[] }) {
  return (
    <div className={cn("rounded-xl bg-secondary/60 p-4 sm:p-5")}>
      <p className="mb-2 text-xs font-medium tracking-[0.14em] text-accent uppercase">本章要点</p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm leading-relaxed">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
            <span>
              <RichText text={it} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
