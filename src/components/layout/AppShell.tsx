import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { chapters, stages, totalMinutes } from "@/lib/curriculum";
import { chapterProgress, useProgress } from "@/lib/progress";
import { formatMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/path", label: "动线" },
  { to: "/labs", label: "实验" },
  { to: "/glossary", label: "词汇" },
  { to: "/exam", label: "总测验" },
];

export function AppShell({
  children,
  sidebar = true,
}: {
  children: ReactNode;
  sidebar?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const completed = useProgress((s) => s.completed);
  const { done, total, ratio } = chapterProgress(completed);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          {sidebar ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="打开目录">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>目录</SheetTitle>
                </SheetHeader>
                <NavList pathname={pathname} completed={completed} />
              </SheetContent>
            </Sheet>
          ) : null}
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight">主轴</span>
            <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Atlas</span>
          </Link>
          <div className="ml-auto hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "inline-flex h-11 items-center px-3 text-sm transition-[color] duration-150",
                  pathname === n.to || pathname.startsWith(n.to + "/")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex w-28 flex-col gap-1 sm:ml-3 sm:w-36">
            <div className="flex justify-between text-[10px] tracking-wide text-muted-foreground">
              <span>
                {done}/{total}
              </span>
              <span className="hidden sm:inline">{formatMinutes(totalMinutes)}</span>
            </div>
            <Progress value={ratio * 100} />
          </div>
        </div>
      </header>
      <div className={cn("mx-auto flex max-w-6xl", sidebar ? "lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]" : "")}>
        {sidebar ? (
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto border-r border-border p-4 lg:block">
            <NavList pathname={pathname} completed={completed} />
          </aside>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function NavList({
  pathname,
  completed,
}: {
  pathname: string;
  completed: Record<string, boolean>;
}) {
  return (
    <nav className="space-y-6">
      {stages.map((st) => (
        <div key={st.id}>
          <p className="mb-2 px-2 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {st.index} {st.title}
          </p>
          <ul className="space-y-0.5">
            {chapters
              .filter((c) => c.stage === st.id)
              .map((c) => {
                const href = `/chapter/${c.slug}`;
                const on = pathname === href;
                return (
                  <li key={c.id}>
                    <Link
                      to="/chapter/$slug"
                      params={{ slug: c.slug }}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-md px-2 text-sm transition-[background-color,color] duration-150",
                        on ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          completed[c.id] ? "bg-accent" : "bg-border",
                        )}
                      />
                      <span className="truncate">{c.title}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
      <div className="space-y-1 border-t border-border pt-4 sm:hidden">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="flex h-11 items-center px-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
