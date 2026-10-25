# 主轴 Atlas

面向 AI 的矩阵论动线课。数据是向量，模型是矩阵，学习是微积分。从内积走到注意力，每学一个概念，就在线性层、PCA、LoRA 和 Transformer 里再认一次。

## 怎么走

四段、十二章，按顺序读。每章的节奏是：要点 → 直觉 → 公式 → 手算 → AI 现身 → 举一反三 → 实验或自测。

| 段 | 章节 |
| --- | --- |
| 看见 | 地图、向量、矩阵是机器 |
| 结构 | 运算与形状、特殊矩阵、秩与最小二乘 |
| 分解 | 特征值、SVD、二次型 |
| 模型 | 矩阵微积分、从 MLP 到注意力、现代技巧 |

八个实验可以单独打开：向量与内积、线性变换、矩阵乘法、特征值、SVD、反向传播、三词注意力、低秩近似。词汇表和文末十问自测用来收口。进度存在浏览器本地，不需要账号。

## 本地运行

需要 Node.js 22。

```bash
npm install
npm run dev
```

开发服务默认在 `http://127.0.0.1:8080`。

```bash
npm run typecheck
npm run build
```

## 技术栈

React 19、TanStack Start、Tailwind CSS v4、KaTeX、Zustand。交互实验是平面 SVG，不依赖额外的图形库。

## 目录

```text
src/content/     十二章正文、词汇、总测验
src/components/  课文渲染与八个实验
src/routes/      首页、动线、章节、实验、词汇、测验
src/lib/         课程索引、小型线性代数、本地进度
```
