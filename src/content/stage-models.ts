import type { ChapterContent } from "./types";

const r = String.raw;

export const calculusChapter: ChapterContent = {
  id: "calculus",
  takeaways: [
    "标量对矩阵的梯度与矩阵同形，才能做 SGD。",
    "正向 W，反向 Wᵀ；对权重是 δxᵀ。",
    "Softmax + 交叉熵的梯度幸运地等于 p − onehot。",
  ],
  blocks: [
    {
      t: "lead",
      text: "这是 AI 学习者相对数学系课程多出来的一章，也是最能立刻变现的一章。反向传播不是黑魔法，是矩阵微积分的链式法则。",
    },
    {
      t: "p",
      text: r`约定（分母布局）：$\partial L/\partial W$ 和 $W$ 同形。这样 SGD 才能写 $W\leftarrow W-\eta\,\partial L/\partial W$。`,
    },
    { t: "h2", text: "必须能手推的四条" },
    {
      t: "ol",
      items: [
        r`$L=\|x\|^2 \Rightarrow \partial L/\partial x=2x$`,
        r`$y=Wx$，$\partial L/\partial W=(\partial L/\partial y)\,x^\top$（外积）`,
        r`同上 $\partial L/\partial x=W^\top(\partial L/\partial y)$`,
        r`$L=\|Y-\hat Y\|_F^2 \Rightarrow \partial L/\partial\hat Y=2(\hat Y-Y)$`,
      ],
    },
    {
      t: "callout",
      kind: "calc",
      title: "一层线性 + MSE",
      body: r`$\hat y=Wx$，$L=\frac12\|\hat y-y\|^2$。则 $\delta=\hat y-y$，$\partial L/\partial W=\delta x^\top$，$\partial L/\partial x=W^\top\delta$。上游残差对权重成外积（谁激活、谁负责），对输入成 Wᵀ。Batch 时把所有样本的外积加起来。`,
    },
    { t: "lab", lab: "backprop" },
    { t: "h2", text: "分类头的幸运简化" },
    {
      t: "formula",
      tex: r`p=\mathrm{softmax}(z),\quad L=-\log p_y \;\Rightarrow\; \frac{\partial L}{\partial z}=p-e_y`,
    },
    {
      t: "p",
      text: "预测分布减去 one-hot。训练分类网络时，最后一层梯度永远是「我预测过了 / 我预测不够」。",
    },
    {
      t: "callout",
      kind: "ai",
      title: "自动求导在做什么",
      body: "每个 op 注册一条「δ 怎么往回乘」。我们从不把巨大的雅可比展开，只找与 δ 的简洁乘积。这叫反向模式自动微分，复杂度和正向同阶。",
    },
    {
      t: "p",
      text: r`速查：$\partial\,\mathrm{tr}(AB)/\partial A=B^\top$，$\partial\|A\|_F^2/\partial A=2A$，$\partial\log\det A/\partial A=A^{-\top}$（$A\succ 0$）。最后一条出现在高斯对数似然里。`,
    },
    {
      t: "quiz",
      id: "calc-q1",
      q: "一次 mini-batch 对线性层权重的梯度，几何上是什么？",
      options: [
        "每个样本残差与输入外积的平均 / 求和",
        "权重的逆",
        "输入的协方差",
        "只对偏置有贡献",
      ],
      answer: 0,
      explain: "∂L/∂W = δ Xᵀ（按你的形状约定）。每个样本一张秩 1 的票，投给「残差方向 ⊗ 输入方向」。",
    },
  ],
};

export const netsChapter: ChapterContent = {
  id: "nets",
  takeaways: [
    "MLP / CNN / RNN / Transformer 都是带结构的矩阵流水线。",
    "注意力是 Gram 式相似度，再对 value 做凸组合。",
    "结合律是高效注意力的金矿；softmax 卡在中间。",
  ],
  blocks: [
    {
      t: "lead",
      text: "现在把整座模型重新看成矩阵流水线。新架构很少发明新的代数，它们只是给乘法加上结构、稀疏、低秩或非线性的插入位置。",
    },
    { t: "h2", text: "MLP：分片线性" },
    {
      t: "formula",
      tex: r`h^{(\ell)}=\phi\big(W^{(\ell)}h^{(\ell-1)}+b^{(\ell)}\big)`,
    },
    {
      t: "p",
      text: "去掉 φ，整网塌成一个矩阵。ReLU 把半空间打成 0，把 ℝᵈ 剖成多面体区域，每个区域内网络是仿射的。所以 ReLU 网络是分片线性函数。",
    },
    {
      t: "p",
      text: "CNN = 权值共享的巨型稀疏矩阵（Toeplitz / 循环）。im2col 把卷积显式变成一次大矩阵乘。RNN = 同一矩阵的反复作用，ht 对 h0 的依赖里出现 Whᵗ，谱半径一偏离 1 就消失或爆炸。",
    },
    { t: "h2", text: "Transformer：矩阵论的集大成" },
    {
      t: "formula",
      tex: r`Q=XW_Q,\;K=XW_K,\;V=XW_V,\quad \mathrm{Attn}=\mathrm{softmax}\!\big(QK^\top/\sqrt{d_h}\big)V`,
    },
    {
      t: "table",
      columns: ["步骤", "矩阵含义"],
      rows: [
        ["XW_Q 等", "每个 token 线性投到 Q/K/V 空间"],
        [r`$QK^\top$`, "两两内积，Gram 式相似度，T×T"],
        [r`$/\sqrt{d_h}$`, "内积方差不随维度线性涨"],
        ["softmax 沿行", "每一行变成概率单纯形上的点"],
        ["乘 V", "用这些概率对 value 做凸组合"],
        ["多头再乘 WO", "直和若干子空间，再混合"],
        ["FFN", "token 内的通道混合：矩阵-非线性-矩阵"],
        ["残差 + LayerNorm", "I+ 与把向量拉回球面"],
      ],
    },
    { t: "lab", lab: "attention" },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三：结合律是真金白银",
      body: r`$Q(K^\top V)$ 是 $O(Td^2)$，$(QK^\top)V$ 是 $O(T^2 d)$。T≫d 时前者便宜得多，但 softmax 卡在中间，不能随便结合。线性注意力、Performer、SSM 都在绕过或近似这个 softmax。FlashAttention 不改数学，而是不把 T×T 矩阵写进 HBM，用分块矩阵乘在 SRAM 里完成同一套代数。`,
    },
    {
      t: "p",
      text: "因果 mask：softmax 之前把上三角打成 −∞，强制下三角——自回归的线性代数实现。KV cache：已算的 K、V 行被存住，新 token 只追加一行。Embedding 查表 = 稀疏矩阵乘。",
    },
    {
      t: "quiz",
      id: "nets-q1",
      q: "把注意力看成「自适应加权平均」，权重来自哪里？",
      options: [
        "固定的卷积核",
        "Q 与 K 的相似度经 softmax 归一化",
        "标签的 one-hot",
        "学习率",
      ],
      answer: 1,
      explain: "每一行 softmax(QKᵀ/√d) 是一组和为 1 的正权重，输出是 value 的凸组合。匹配越尖，越接近「只看一个 token」。",
    },
  ],
};

export const modernChapter: ChapterContent = {
  id: "modern",
  takeaways: [
    "LoRA、谱归一化、正交初始化，都是在管秩与谱。",
    "许多炼丹口诀的根是条件数和范数。",
    "einsum 是张量时代的矩阵乘方言。",
  ],
  blocks: [
    {
      t: "lead",
      text: "读到这里，现代技巧应当能被翻译回已经学过的三句话：列告诉基去哪；SVD 把机器拆成转-拉-转；学习是对这台机器做微积分。",
    },
    { t: "lab", lab: "lora" },
    { t: "h2", text: "数值线性代数：口诀的为什么" },
    {
      t: "ul",
      items: [
        r`矩阵范数：$\|A\|_2=\sigma_{\max}(A)$，$\|A\|_F=\sqrt{\sum\sigma_i^2}$。一层的放大倍数 ≤ σmax，深度 L 最坏可到 σmaxᴸ。`,
        "Xavier / He 初始化在控制每层 σ 的乘积靠近 1，让正向方差和反向梯度守恒。正交初始化更直接：奇异值全是 1。",
        "梯度裁剪：给 ‖∇L‖ 上限，防止某次 batch 上 σmax 太大把参数打飞。",
        "混合精度：FP16 动态范围窄。κ 大的矩阵容易 underflow。Loss scaling 是把小梯度抬进可表示区——还是在管尺度。",
      ],
    },
    { t: "h2", text: "概率里的矩阵" },
    {
      t: "p",
      text: r`协方差 $\Sigma=\mathbb{E}[(x-\mu)(x-\mu)^\top]$ 一定对称半正定。马氏距离先用 $\Sigma^{-1/2}$ 把椭圆拧成圆。多元高斯的等密度面就是这张椭圆——和 PCA 是同一张图。VAE 通常只估对角 Σ（各维独立的廉价假设），BatchNorm 也是这个假设。满协方差太贵（d²），深度学习几乎处处用对角近似去逼近一个对称正定矩阵。`,
    },
    { t: "h2", text: "从矩阵到张量" },
    {
      t: "code",
      caption: "先写指标，再写代码",
      code: `# Q,K: (B, H, T, D)  →  scores: (B, H, T, T)
scores = einsum('bhtd,bhsd->bhts', Q, K)

# x: (B, T, in),  W: (out, in)
y = einsum('bti,oi->bto', x, W)`,
    },
    {
      t: "p",
      text: "形状错误的 90% 来自静默转置和 batch 维位置。见到 Kronecker 积 A⊗B，想「分块地、独立地作用在两个空间上」。",
    },
    { t: "h2", text: "用一条主线把所有概念串起来" },
    {
      t: "steps",
      items: [
        { title: "词 → 向量", body: "查 embedding 矩阵 E。" },
        { title: "Q, K, V", body: "三个线性层。" },
        { title: "像不像", body: "QKᵀ 是内积 / Gram。" },
        { title: "权重", body: "softmax 把行投影到概率单纯形。" },
        { title: "取值", body: "乘 V，凸组合。" },
        { title: "多头 / 残差 / 归一化", body: "子空间直和、I+F、拉回球面。" },
        { title: "分类头与损失", body: "行内积投票；梯度 p − ey。" },
        { title: "反传与 Adam", body: "一路 Wᵀ 和外积；对角近似的 H⁻¹。" },
        { title: "微调 LoRA", body: "ΔW = BA，低秩。" },
      ],
    },
    {
      t: "callout",
      kind: "intuition",
      title: "只记三句",
      body: "1. 矩阵是线性机器，列告诉我们基向量去了哪里。2. 内积衡量对齐，SVD 把任意机器拆成转-拉-转，特征值是对称机器的主轴。3. 学习是对这台机器做微积分：正向 W，反向 Wᵀ，对权重是残差与输入的外积。之后论文里 90% 的新方法，都是在这三句话上加结构。",
    },
    {
      t: "quiz",
      id: "modern-q1",
      q: "谱归一化把 W 除以 σmax，直接控制的是什么？",
      options: [
        "秩",
        "这一层的 Lipschitz 常数 / 算子范数",
        "偏置",
        "词表大小",
      ],
      answer: 1,
      explain: "‖W‖2 = σmax(W)。除以它之后算子范数 ≤ 1，层不会把扰动无限放大。GAN 里这被用来稳定判别器。",
    },
  ],
};

export const modelChapters = [calculusChapter, netsChapter, modernChapter];
