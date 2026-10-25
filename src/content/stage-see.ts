import type { ChapterContent } from "./types";

const r = String.raw;

export const mapChapter: ChapterContent = {
  id: "map",
  takeaways: [
    "数据是向量，模型是矩阵，学习是在矩阵空间里做微积分。",
    "先建立几何图景，再记公式；公式是图景的速记。",
    "同一套线性代数会在线性层、注意力、PCA、LoRA 里反复出现。",
  ],
  blocks: [
    {
      t: "lead",
      text: "矩阵论在数学系是线性代数加算子理论。对做 AI 的人，可以压成一句：数据是向量，模型是矩阵再加一点非线性，学习是在矩阵空间里做微积分。",
    },
    {
      t: "p",
      text: r`把这句话拆开，就是这门动线课。你不需要先成为证明机器。你需要的是：以后看到 $Wx$、$\mathrm{softmax}(QK^\top)V$、LoRA、PCA、Hessian 时，脑子里是同一张图。`,
    },
    { t: "h2", text: "一张对照表" },
    {
      t: "table",
      columns: ["你在 AI 里见到的", "背后的矩阵论"],
      rows: [
        ["一张图、一句话、一个 hidden state", "向量"],
        ["Linear / Dense / nn.Linear", r`$y=Wx+b$`],
        ["相似度、attention score", "内积"],
        ["PCA、降维、推荐系统", "特征值 / SVD"],
        ["LoRA、低秩适配", "秩"],
        ["损失曲面、Adam、二阶优化", "二次型、Hessian、正定"],
        ["反向传播", "矩阵微积分"],
        ["Transformer", "分块矩阵乘 + softmax"],
        ["协方差、VAE、高斯", "对称正定矩阵"],
        ["梯度爆炸、正交初始化", "谱半径、条件数、范数"],
      ],
    },
    { t: "h2", text: "学到什么程度" },
    {
      t: "steps",
      items: [
        { title: "必须", body: "向量、内积、范数、矩阵乘、转置、形状纪律。没有这些，代码里的 (B, T, d) 会对不上。" },
        { title: "高频", body: "秩、伪逆、最小二乘、特征值、SVD、正定。论文里的压缩、降维、微调都落在这里。" },
        { title: "能动手", body: "矩阵微积分（反传）、条件数与初始化、注意力公式。这是改模型的视力。" },
        { title: "可跳过", body: "Jordan 标准型、Cayley–Hamilton、抽象公理化。知道存在即可，不是训练网络的主线。" },
      ],
    },
    {
      t: "callout",
      kind: "intuition",
      title: "怎么走这条动线",
      body: "每一章都按同一节奏：直觉 → 定义 → 手算 → AI 现身 → 举一反三 → 实验或测验。不要跳过实验。拖一下向量、改四个矩阵元，几何会自己进脑子。",
    },
    {
      t: "quiz",
      id: "map-q1",
      q: "下面哪一句最准确地概括「矩阵论对 AI 学习者」的用途？",
      options: [
        "用来证明神经网络一定收敛",
        "给数据、模型与学习过程一套统一的几何语言",
        "替代微积分",
        "只对推荐系统有用",
      ],
      answer: 1,
      explain: "矩阵论不是另一门考试科目，而是把 embedding、线性层、注意力、PCA、反传收进同一套图景的语言。",
    },
  ],
};

export const vectorChapter: ChapterContent = {
  id: "vector",
  takeaways: [
    "向量同时是一列数和空间中的箭头。",
    "内积 = 对齐程度 × 双方长度；余弦把长度除掉。",
    "词向量、像素、梯度、残差，都是同一种对象。",
  ],
  blocks: [
    {
      t: "lead",
      text: "AI 里几乎一切对象都是向量：像素拉直、词的 embedding、网络的 hidden state、损失函数的梯度。先学会看向量，后面的矩阵才有意义。",
    },
    { t: "h2", text: "一列数，也是一个点" },
    {
      t: "formula",
      tex: r`\mathbf{x}=\begin{pmatrix}x_1\\x_2\\\vdots\\x_n\end{pmatrix}\in\mathbb{R}^n`,
    },
    {
      t: "p",
      text: "两种读法同时成立：坐标读法（n 个数字）和几何读法（从原点出发的箭头）。第一种在代码里更常见，第二种让夹角、投影、主方向变得可想象。",
    },
    {
      t: "callout",
      kind: "warn",
      title: "行还是列",
      body: r`数学默认列向量。PyTorch 里一个样本常常是一行，一个 batch 是 $X\in\mathbb{R}^{B\times d}$。论文写 $W\mathbf{x}$，代码里经常是 x @ W.T。形状对不上时，先问：我把向量当行还是当列？`,
    },
    { t: "h2", text: "四个贯穿全程的例子" },
    {
      t: "ul",
      items: [
        r`图像：MNIST 的 $28\times 28$ 拉直后是 $\mathbb{R}^{784}$ 里的一个点。100 张图叠起来就是矩阵。`,
        r`词向量：cat 被映到 $\mathbb{R}^{300}$ 里的一点。king − man + woman ≈ queen，说明这个空间里加法有语义。`,
        r`梯度：$\nabla_\theta L$ 指向让损失上升最快的方向。SGD 沿它的反方向走。`,
        "残差：ResNet 的 x + F(x) 是向量加法——不要替换表示，而在原表示上叠一个修正。",
      ],
    },
    { t: "h2", text: "内积：像不像" },
    {
      t: "formula",
      tex: r`\langle\mathbf{u},\mathbf{v}\rangle=\mathbf{u}^\top\mathbf{v}=\|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta`,
    },
    {
      t: "p",
      text: r`三个信息缠在一起：两边的长度，以及夹角。把长度除掉，就得到余弦相似度 $\cos\theta$。`,
    },
    {
      t: "callout",
      kind: "calc",
      title: "手算",
      body: r`令 $u=(1,0)^\top$，$v=(1,1)^\top$。则 $u^\top v=1$，$\|u\|=1$，$\|v\|=\sqrt{2}$，$\cos\theta=1/\sqrt{2}\approx 0.707$，夹角 $45^\circ$：有点像，但不完全同向。`,
    },
    { t: "lab", lab: "vector" },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三：同一个内积的四张面孔",
      body: "检索里 query 与 document 的余弦；注意力里 qᵀk（再除 √d）；线性层一个神经元 wᵀx + b，就是输入在权重方向上的投影；核方法的 Gram 矩阵 Gij = xiᵀxj。看到点积，立刻翻译成：对齐程度 × 双方长度。",
    },
    { t: "h2", text: "范数：大小、约束、正则" },
    {
      t: "table",
      columns: ["范数", "AI 里干什么"],
      rows: [
        [r`$L_2=\sqrt{\sum x_i^2}$`, "距离、权重衰减、LayerNorm"],
        [r`$L_1=\sum |x_i|$`, "稀疏、Lasso"],
        [r`$L_\infty=\max |x_i|$`, "对抗扰动的预算"],
      ],
    },
    {
      t: "p",
      text: r`权重衰减 $L+\frac{\lambda}{2}\|\theta\|_2^2$ 的几何：把参数往原点拉，限制模型用太大的数字做决定。LayerNorm 则是把向量拉到某个范数球面上，让后续线性层看到稳定的尺度。`,
    },
    {
      t: "quiz",
      id: "vector-q1",
      q: "两个很长但不对齐的向量，内积会怎样？",
      options: [
        "一定很大，因为长度大",
        "不一定——夹角接近 90° 时内积接近 0",
        "一定为负",
        "等于余弦相似度",
      ],
      answer: 1,
      explain: "内积同时吃长度和夹角。这正是注意力要除 √d、检索常用余弦的原因：先把长度的干扰拿掉，或把尺度管住。",
    },
  ],
};

export const matrixChapter: ChapterContent = {
  id: "matrix",
  takeaways: [
    "矩阵是线性机器：列告诉你基向量去了哪里。",
    "行内积读法 = 一个线性神经元。",
    "没有非线性，多层线性会塌成一层。",
  ],
  blocks: [
    {
      t: "lead",
      text: "W 吃掉一个 n 维向量，吐出一个 m 维向量。线性是指它尊重加法和数乘——没有平移（平移靠偏置），没有弯曲（弯曲靠 ReLU、softmax、attention）。",
    },
    {
      t: "formula",
      tex: r`\mathbf{y}=W\mathbf{x},\qquad W(a\mathbf{x}+b\mathbf{z})=a\,W\mathbf{x}+b\,W\mathbf{z}`,
    },
    {
      t: "p",
      text: "所以神经网络 = 线性变换与非线性的交替堆叠。矩阵负责重新混合坐标，非线性负责让空间折叠，从而能做复杂分类。",
    },
    { t: "h2", text: "两种读法，请练到反射" },
    {
      t: "p",
      text: r`列组合（几何）：$W\mathbf{x}=x_1 w_{:1}+\cdots+x_n w_{:n}$。输入的每个分量，是沿对应列方向走多远。列就是「第 j 个标准基被打到哪里」。`,
    },
    {
      t: "p",
      text: r`行内积（神经元）：$y_i=w_{i:}^\top\mathbf{x}$。第 i 个输出 = 第 i 行与输入的内积。这就是一个线性神经元在问：输入和我像不像？`,
    },
    {
      t: "callout",
      kind: "ai",
      title: "AI 现身",
      body: "隐藏层 4 维、输出 3 类的分类头：W 是 3×4，三行是三个类别探测器。Embedding lookup 是「用 one-hot 去组合列」——查表等于稀疏的矩阵乘。",
    },
    { t: "lab", lab: "transform" },
    { t: "h2", text: "复合就是相乘，顺序不能乱" },
    {
      t: "formula",
      tex: r`(AB)\mathbf{x}=A(B\mathbf{x})\qquad\text{一般 }AB\neq BA`,
    },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三",
      body: "两层 MLP 的线性部分是 W2 W1 x。若没有中间 ReLU，多层线性塌成一层——这就是非线性必不可少的代数原因。CNN 的连续卷积、LoRA 插在哪一层，都是在「复合」的缝隙里做文章。",
    },
    {
      t: "quiz",
      id: "matrix-q1",
      q: "为什么「很深的线性网络」表达能力和一层一样？",
      options: [
        "深度会过拟合所以等价",
        "矩阵乘的复合仍是矩阵乘，许多线性映射合成一个线性映射",
        "权重会变成正交",
        "反向传播会把它们抵消",
      ],
      answer: 1,
      explain: "线性映射组成群（可逆时）或至少对复合封闭。要打破这层天花板，必须插入非线性。",
    },
  ],
};

export const seeChapters = [mapChapter, vectorChapter, matrixChapter];
