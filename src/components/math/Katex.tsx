import katex from "katex";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export function Katex({
  tex,
  block = false,
  className,
}: {
  tex: string;
  block?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(tex, {
    displayMode: block,
    throwOnError: false,
    strict: "ignore",
    output: "html",
  });
  const Tag = block ? "div" : "span";
  return (
    <Tag
      className={cn(block ? "my-4 overflow-x-auto py-1" : "inline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const SPLIT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;

export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(SPLIT).filter((p) => p !== "");
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <Katex key={i} tex={part.slice(2, -2).trim()} block />;
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          return <Katex key={i} tex={part.slice(1, -1)} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
}
