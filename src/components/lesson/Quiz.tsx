import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import { RichText } from "@/components/math/Katex";

export function Quiz({
  id,
  q,
  options,
  answer,
  explain,
}: {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
}) {
  const saved = useProgress((s) => s.quiz[id]);
  const mark = useProgress((s) => s.markQuiz);
  const [choice, setChoice] = useState<number | null>(saved === undefined ? null : answer);
  const [revealed, setRevealed] = useState(saved !== undefined);
  const picked = choice;
  const show = revealed && picked !== null;

  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <p className="mb-1 text-xs font-medium tracking-[0.14em] text-accent uppercase">自测</p>
      <h3 className="mb-4 font-serif text-lg font-semibold tracking-tight">
        <RichText text={q} />
      </h3>
      <div className="grid gap-2">
        {options.map((opt, i) => {
          const isCorrect = show && i === answer;
          const isWrong = show && i === picked && i !== answer;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (show) return;
                setChoice(i);
                setRevealed(true);
                mark(id, i === answer);
              }}
              className={cn(
                "flex min-h-11 items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-[background-color,box-shadow] duration-150",
                "shadow-[var(--shadow-border)] hover:bg-secondary",
                isCorrect && "bg-accent/15 shadow-none",
                isWrong && "bg-destructive/10 shadow-none",
              )}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px] text-muted-foreground">
                {show ? (
                  isCorrect ? (
                    <Check className="size-3 text-accent" />
                  ) : isWrong ? (
                    <X className="size-3 text-destructive" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="pt-px">
                <RichText text={opt} />
              </span>
            </button>
          );
        })}
      </div>
      {show ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{picked === answer ? "对。" : "先记下这个坑。"} </span>
          <RichText text={explain} />
        </p>
      ) : null}
    </section>
  );
}
