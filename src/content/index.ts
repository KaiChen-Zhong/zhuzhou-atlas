import type { ChapterContent } from "./types";
import { mapChapter, matrixChapter, vectorChapter } from "./stage-see";
import { opsChapter, rankChapter, specialChapter } from "./stage-structure";
import { eigenChapter, quadraticChapter, svdChapter } from "./stage-decomp";
import { calculusChapter, modernChapter, netsChapter } from "./stage-models";

const all: ChapterContent[] = [
  mapChapter,
  vectorChapter,
  matrixChapter,
  opsChapter,
  specialChapter,
  rankChapter,
  eigenChapter,
  svdChapter,
  quadraticChapter,
  calculusChapter,
  netsChapter,
  modernChapter,
];

const byId = Object.fromEntries(all.map((c) => [c.id, c]));

export function contentById(id: string) {
  return byId[id];
}

export { all as allChapterContent };
