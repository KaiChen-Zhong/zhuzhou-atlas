export type StageId = "see" | "structure" | "decomp" | "models";

export type ChapterMeta = {
  id: string;
  slug: string;
  title: string;
  brief: string;
  minutes: number;
  stage: StageId;
  lab: string | null;
};

export type StageMeta = {
  id: StageId;
  index: string;
  title: string;
  subtitle: string;
};

export const stages: StageMeta[] = [
  { id: "see", index: "01", title: "看见", subtitle: "把数据和模型看成向量与变换" },
  { id: "structure", index: "02", title: "结构", subtitle: "形状、家族、秩与最小二乘" },
  { id: "decomp", index: "03", title: "分解", subtitle: "主轴、SVD 与损失曲面" },
  { id: "models", index: "04", title: "模型", subtitle: "反传、注意力与现代技巧" },
];

export const chapters: ChapterMeta[] = [
  { id: "map", slug: "map", title: "地图", brief: "为什么 AI 必须懂矩阵", minutes: 8, stage: "see", lab: null },
  { id: "vector", slug: "vector", title: "向量", brief: "AI 里几乎一切对象", minutes: 16, stage: "see", lab: "vector" },
  { id: "matrix", slug: "matrix", title: "矩阵是机器", brief: "线性变换的两种读法", minutes: 18, stage: "see", lab: "transform" },
  { id: "ops", slug: "ops", title: "运算与形状", brief: "乘法、转置、广播、外积", minutes: 14, stage: "structure", lab: "multiply" },
  { id: "special", slug: "special", title: "特殊矩阵", brief: "单位、对角、正交、正定", minutes: 12, stage: "structure", lab: null },
  { id: "rank", slug: "rank", title: "秩与最小二乘", brief: "信息维度、投影、线性回归", minutes: 16, stage: "structure", lab: null },
  { id: "eigen", slug: "eigen", title: "特征值", brief: "主轴、PCA、谱半径", minutes: 18, stage: "decomp", lab: "eigen" },
  { id: "svd", slug: "svd", title: "SVD", brief: "转-拉-转与低秩近似", minutes: 16, stage: "decomp", lab: "svd" },
  { id: "quadratic", slug: "quadratic", title: "二次型", brief: "Hessian、条件数、优化", minutes: 12, stage: "decomp", lab: null },
  { id: "calculus", slug: "calculus", title: "矩阵微积分", brief: "反向传播的母语", minutes: 20, stage: "models", lab: "backprop" },
  { id: "nets", slug: "nets", title: "从 MLP 到注意力", brief: "把整座模型看成矩阵流水线", minutes: 20, stage: "models", lab: "attention" },
  { id: "modern", slug: "modern", title: "现代技巧", brief: "LoRA、谱归一化、数值稳定", minutes: 14, stage: "models", lab: "lora" },
];

export const labs = [
  { id: "vector", title: "向量与内积", brief: "拖动两个向量，看夹角、投影与余弦", chapter: "vector" },
  { id: "transform", title: "线性变换", brief: "改 2×2 矩阵，看格子如何被拉扯", chapter: "matrix" },
  { id: "multiply", title: "矩阵乘法", brief: "逐步高亮「行乘列」", chapter: "ops" },
  { id: "eigen", title: "特征值", brief: "主轴如何伸缩，谱半径如何爆炸", chapter: "eigen" },
  { id: "svd", title: "SVD 三部曲", brief: "旋转、拉伸、再旋转", chapter: "svd" },
  { id: "backprop", title: "反向传播", brief: "一层线性 + MSE 的梯度从哪来", chapter: "calculus" },
  { id: "attention", title: "注意力", brief: "三词玩具 Transformer 的 QKᵀ", chapter: "nets" },
  { id: "lora", title: "低秩近似", brief: "截断 SVD 与 LoRA 的同一张图", chapter: "modern" },
] as const;

export type LabId = (typeof labs)[number]["id"];

export const totalMinutes = chapters.reduce((s, c) => s + c.minutes, 0);

export function chapterBySlug(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

export function labById(id: string) {
  return labs.find((l) => l.id === id);
}

export function stageOf(id: StageId) {
  return stages.find((s) => s.id === id)!;
}

export function chaptersInStage(id: StageId) {
  return chapters.filter((c) => c.stage === id);
}

export function neighbors(slug: string) {
  const i = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? chapters[i - 1] : null,
    next: i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : null,
    index: i,
  };
}
