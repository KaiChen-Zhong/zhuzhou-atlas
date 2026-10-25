import type { ChapterContent } from "./types";

const r = String.raw;

export const opsChapter: ChapterContent = {
  id: "ops",
  takeaways: [
    "形状纪律：中间维必须咬合。",
    "转置把内积搬家：正向 W，反向 Wᵀ。",
    "外积是最瘦的矩阵，LoRA 和反传梯度都是它。",
  ],
  blocks: [
    {
      t: "lead",
      text: "矩阵运算看起来像算术，真正要命的是形状。中间维对不上，整个模型就是在说一种语法错误的语言。",
    },
    { t: "h2", text: "乘法：行乘列" },
    {
      t: "formula",
      tex: r`(A_{m\times k})(B_{k\times n})=C_{m\times n},\qquad C_{ij}=\sum_t A_{it}B_{tj}`,
    },
    { t: "lab", lab: "multiply" },
    {
      t: "table",
      caption: "常见形状（约定会变，但纪律不变）",
      columns: ["对象", "常见形状"],
      rows: [
        ["一个样本", "(d,) 或 (1, d)"],
        ["batch", "(B, d)"],
        ["nn.Linear(in, out) 的权重", "(out, in)"],
        ["图像 batch", "(B, C, H, W)"],
        ["Transformer token", "(B, T, d)"],
        ["多头注意力", "(B, H, T, dh)"],
      ],
    },
    { t: "h2", text: "转置：内积搬家" },
    {
      t: "formula",
      tex: r`(AB)^\top=B^\top A^\top,\qquad \langle W\mathbf{x},\mathbf{y}\rangle=\langle\mathbf{x},W^\top\mathbf{y}\rangle`,
    },
    {
      t: "p",
      text: r`第二式是反传的许可证：正向 $h=Wx$，反向 $\partial L/\partial x=W^\top(\partial L/\partial h)$。你在 autograd 里见到的 x.grad = W.T @ h.grad，就是这一个恒等式。`,
    },
    { t: "h2", text: "Hadamard 积、广播、外积" },
    {
      t: "ul",
      items: [
        r`Hadamard $A\odot B$：逐元素，形状必须相同。门控、mask、Dropout、ReLU 的局部梯度 $I[x>0]\odot\delta$。`,
        r`广播：$Wx+b$ 里 b 对 batch 维复制。数学上像 $b\mathbf{1}^\top$。`,
        r`外积 $uv^\top$：秩一定 ≤ 1。任何矩阵都是若干外积之和——这就是 SVD 的离散版。`,
      ],
    },
    {
      t: "callout",
      kind: "ai",
      title: "LoRA 的全部数学",
      body: r`不更新 $W$，而更新两个瘦矩阵：$W'=W+BA$，其中 $B\in\mathbb{R}^{d\times r}$，$A\in\mathbb{R}^{r\times k}$，$r\ll d$。$BA$ 最多秩 r，参数量从 $dk$ 降到 $r(d+k)$。`,
    },
    {
      t: "quiz",
      id: "ops-q1",
      q: "反向传播对权重的梯度 δxᵀ 是哪种运算？",
      options: ["矩阵逆", "逐元素乘", "外积（秩 1 更新）", "卷积"],
      answer: 2,
      explain: "每个样本贡献一个秩 1 的更新：残差方向 ⊗ 输入方向。「谁激活、谁负责」。",
    },
  ],
};

export const specialChapter: ChapterContent = {
  id: "special",
  takeaways: [
    "把特殊矩阵当成有性格的角色，而不是定义列表。",
    "残差是 I+F；正交保长度；对称可对角化。",
    "卷积、因果 mask、图消息，都是带结构的矩阵乘。",
  ],
  blocks: [
    { t: "lead", text: "论文里反复出场的不是「任意矩阵」，而是几个性格鲜明的家族。认得出它们，读模型会快一倍。" },
    {
      t: "table",
      columns: ["角色", "性格", "AI 里的脸"],
      rows: [
        ["单位 I", "什么都不做", "残差 x+F(x)=(I+F)x"],
        ["对角", "只缩放、不混合", "LayerNorm 的 γ、温度、特征缩放"],
        ["正交 QᵀQ=I", "保长度与夹角", "初始化、谱归一化的理想"],
        ["对称 A=Aᵀ", "一定能正交对角化", "协方差、Gram、Hessian"],
        ["正定", "二次型恒正", "协方差、严格凸损失"],
        ["稀疏 / 三角 / Toeplitz", "有结构，不必存 n² 个数", "图、因果 mask、卷积"],
      ],
    },
    {
      t: "callout",
      kind: "intuition",
      title: "残差为什么能训很深",
      body: "默认做恒等，学习只学修正。深层的复合变换从「一长串任意矩阵」变成「一长串靠近 I 的矩阵」，谱不容易飞掉。",
    },
    {
      t: "p",
      text: r`正交：$Q\mathbf{x}$ 不改变长度。深层若每层接近正交，信号尺度稳定。对称：实对称矩阵 $A=Q\Lambda Q^\top$，这是 PCA 的数学许可证。正定：所有特征值 $>0$，椭圆是碗而不是马鞍。`,
    },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三：结构就是加速器",
      body: "一维卷积是 Toeplitz 矩阵乘，所以能用 FFT；因果注意力是「softmax 前把上三角打成 −∞」，强制下三角；图神经网络是用邻接（稀疏）去混合邻居。结构让我们不必存满矩阵。",
    },
    {
      t: "quiz",
      id: "special-q1",
      q: "正交和正定是一回事吗？",
      options: [
        "是，都要求对称",
        "不是。正交保长度；正定要求二次型恒正。单位矩阵两者都是",
        "正定一定正交",
        "正交一定正定",
      ],
      answer: 1,
      explain: "旋转矩阵正交但不定（特征值在单位圆上）。协方差正定但一般不正交。不要把两个家族混成一个词。",
    },
  ],
};

export const rankChapter: ChapterContent = {
  id: "rank",
  takeaways: [
    "秩是有效信息维度；零空间是被扔掉的方向。",
    "线性回归是正交投影；伪逆在欠定时给最小范数解。",
    "现代网络几乎总是欠定的，谁被选中由正则和隐式偏置决定。",
  ],
  blocks: [
    {
      t: "lead",
      text: "矩阵有多少个独立的方向，决定它能表达多少事。秩把「看起来很大」和「真正有信息」分开。",
    },
    { t: "h2", text: "列空间、零空间、秩" },
    {
      t: "ul",
      items: [
        "列空间 Col(A)：A 能达到的所有输出。线性层的表达范围。",
        "零空间 Nul(A)：被压成 0 的输入。这些方向上的信号丢失。",
        r`秩-零化度：$\mathrm{rank}(A)+\dim\mathrm{Nul}(A)=n$。`,
      ],
    },
    {
      t: "callout",
      kind: "calc",
      title: "手算",
      body: r`$\begin{pmatrix}1&2&3\\2&4&6\end{pmatrix}$ 第二行是第一行的 2 倍，秩为 1。所有列躺在同一条线上，信息只有一维。`,
    },
    { t: "h2", text: "线性方程组的三种命运" },
    {
      t: "table",
      columns: ["情况", "几何", "AI"],
      rows: [
        ["唯一解", "b 在列空间，满秩方阵", "刚好拟合"],
        ["无解", "b 不在列空间", "过约束，只能最小二乘"],
        ["无穷解", "有非平凡零空间", "欠定、过参数，解不唯一"],
      ],
    },
    {
      t: "p",
      text: "现代深度学习几乎总是欠定（参数比数据多）。「哪个解」由初始化、正则、SGD 的隐式偏置决定——这是过参数化理论的入口。",
    },
    { t: "h2", text: "最小二乘 = 正交投影" },
    {
      t: "formula",
      tex: r`\min_w\|Xw-y\|_2^2 \;\Rightarrow\; X^\top X\,w=X^\top y \;\Rightarrow\; \hat w=(X^\top X)^{-1}X^\top y=X^{+}y`,
    },
    {
      t: "p",
      text: "几何只有一句：把 y 正交投影到 X 的列空间，再在这个子空间里解方程。残差垂直于每一个特征——模型已经把特征能解释的部分吃干。",
    },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三",
      body: "普通线性回归就是这个投影。岭回归把 XᵀX 换成 XᵀX+λI，保证正定并压小权重。欠定时伪逆给最小范数解；从 0 附近出发的 SGD 也有「偏向最小范数」的隐式正则。某些注意力论文把 softmax attention 读成自适应的核回归。",
    },
    {
      t: "callout",
      kind: "ai",
      title: "低秩 = 假设真正的自由度很少",
      body: "PCA / 截断 SVD 丢掉小奇异值；推荐系统把兴趣写成用户矩阵 × 物品矩阵；LoRA 假设新任务只需转一个小子空间；每个注意力头在 dh=d/H 的低维里做匹配。预训练的 W 往往满秩（要当通用提取器），任务增量 ΔW 却常常低秩。",
    },
    {
      t: "quiz",
      id: "rank-q1",
      q: "过参数网络有无穷多个能拟合训练数据的解。实践中我们通常得到哪一类？",
      options: [
        "范数最大的解",
        "随机的任意解，没有偏好",
        "偏向小范数、由初始化与优化路径选择的解",
        "唯一的全局最优",
      ],
      answer: 2,
      explain: "欠定系统需要额外准则。权重衰减显式要小范数；SGD 从原点附近走过来，也常偏向更简单的解。",
    },
  ],
};

export const structureChapters = [opsChapter, specialChapter, rankChapter];
