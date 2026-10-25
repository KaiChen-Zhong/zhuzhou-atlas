import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { examQuestions } from "@/content/exam";
import { Quiz } from "@/components/lesson/Quiz";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/exam")({ component: ExamPage });

function ExamPage() {
  const quiz = useProgress((s) => s.quiz);
  const reset = useProgress((s) => s.reset);
  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of examQuestions) {
      if (quiz[q.id] !== undefined) {
        answered += 1;
        if (quiz[q.id]) correct += 1;
      }
    }
    return { answered, correct, total: examQuestions.length };
  }, [quiz]);

  return (
    <AppShell sidebar={false}>
      <main className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">过关</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">十问自测</h1>
        <p className="mt-3 text-muted-foreground">
          能不看笔记答这些，矩阵论对 AI 就算过关。答完对照解释，回头去对应章节补洞。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground">
            {stats.correct} / {stats.total} 正确
          </span>
          <span>已答 {stats.answered}</span>
          <Button variant="ghost" size="sm" onClick={() => reset()}>
            清空本地进度
          </Button>
        </div>
        <div className="mt-8 space-y-6">
          {examQuestions.map((q, i) => (
            <div key={q.id}>
              <p className="mb-2 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <Quiz id={q.id} q={q.q} options={q.options} answer={q.answer} explain={q.explain} />
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
