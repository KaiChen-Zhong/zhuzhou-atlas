import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LabById } from "@/components/labs";
import { Button } from "@/components/ui/button";
import { chapterBySlug, labById } from "@/lib/curriculum";

export const Route = createFileRoute("/lab/$slug")({
  loader: ({ params }) => {
    const lab = labById(params.slug);
    if (!lab) throw notFound();
    return { lab };
  },
  component: LabPage,
  notFoundComponent: () => (
    <AppShell sidebar={false}>
      <main className="px-5 py-16">
        <p className="text-muted-foreground">没有这个实验。</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/labs">全部实验</Link>
        </Button>
      </main>
    </AppShell>
  ),
});

function LabPage() {
  const { lab } = Route.useLoaderData();
  const chapter = chapterBySlug(lab.chapter);
  return (
    <AppShell sidebar={false}>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link to="/labs">
            <ArrowLeft className="size-4" />
            全部实验
          </Link>
        </Button>
        <LabById id={lab.id} standalone />
        {chapter ? (
          <p className="mt-6 text-sm text-muted-foreground">
            出自章节{" "}
            <Link
              to="/chapter/$slug"
              params={{ slug: chapter.slug }}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {chapter.title}
            </Link>
          </p>
        ) : null}
      </main>
    </AppShell>
  );
}
