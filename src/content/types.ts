export type CalloutKind = "intuition" | "ai" | "transfer" | "warn" | "calc";

export type Block =
  | { t: "lead"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "formula"; tex: string }
  | { t: "callout"; kind: CalloutKind; title: string; body: string }
  | { t: "table"; caption?: string; columns: string[]; rows: string[][] }
  | { t: "code"; caption?: string; code: string }
  | { t: "lab"; lab: string }
  | { t: "quiz"; id: string; q: string; options: string[]; answer: number; explain: string }
  | { t: "steps"; items: { title: string; body: string }[] };

export type ChapterContent = {
  id: string;
  takeaways: string[];
  blocks: Block[];
};
