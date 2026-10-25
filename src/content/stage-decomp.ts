import type { ChapterContent } from "./types";

const r = String.raw;

export const eigenChapter: ChapterContent = {
  id: "eigen",
  takeaways: [
    "特征向量是变换后方向不变的轴，特征值是沿该轴的增益。",
    "实对称矩阵一定能正交对角化——PCA 的许可证。",
    "谱半径偏离 1，反复相乘就会消失或爆炸。",
  ],
  blocks: [
    {
      t: "lead",
      text: "一台线性机器最诚实的自我介绍，是指出哪些方向只被伸缩、不被扭转。那些方向就是特征向量。",
    },
    {
      t: "formula",
      tex: r`A\mathbf{v}=\lambda\mathbf{v},\quad\mathbf{v}\neq 0`,
    },
    {
      t: "callout",
      kind: "calc",
      title: "手算 2×2",
      body: r`$A=\begin{pmatrix}2&1\\0&3\end{pmatrix}$ 是三角阵，特征值就在对角线上：2 和 3。λ=2 时 v=(1,0)ᵀ，横轴被拉两倍。三角 / 对角之所以好用，是因为谱一目了然。`,
    },
    { t: "h2", text: "谱定理：对称就能对角化" },
    {
      t: "formula",
      tex: r`A=A^\top \;\Rightarrow\; A=Q\Lambda Q^\top=\sum_i\lambda_i q_i q_i^\top`,
    },
    {
      t: "p",
      text: "一组正交方向上的独立缩放。协方差、Hessian、拉普拉斯都享受这个定理。",
    },
    { t: "h2", text: "PCA：特征值在数据上的第一次胜利" },
    {
      t: "p",
      text: r`数据 $X$ 已中心化，协方差 $\Sigma=\frac1n X^\top X$。对单位向量 $u$，$u^\top\Sigma u$ 就是把数据投到 u 上的方差。最大值在 $\lambda_{\max}$ 处取得。`,
    },
    {
      t: "p",
      text: "找数据最散开的方向 = 找协方差的最大特征向量。降到 k 维：取前 k 个特征向量组成 P，Z = XP。",
    },
    { t: "lab", lab: "eigen" },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三",
      body: "白化：沿特征方向除以 √λ，让协方差变 I。BatchNorm 是它按坐标的廉价对角近似。PageRank 是主特征向量（稳态）。图拉普拉斯的小特征值是图上变化缓慢的方向，谱 GNN 在这组基上滤波。幂迭代 v←Av/‖Av‖ 就是在找 λmax。",
    },
    { t: "h2", text: "谱半径与训练稳定" },
    {
      t: "p",
      text: r`$\rho(A)=\max|\lambda_i|$。反复乘 $A^t$：|λ|>1 的方向爆炸，|λ|<1 的方向消失。RNN 的梯度消失 / 爆炸，就是雅可比的谱半径偏离 1。LSTM 的门、残差、正交初始化、谱归一化，全是在管这件事情。`,
    },
    {
      t: "quiz",
      id: "eigen-q1",
      q: "PCA 的第一主成分对应什么？",
      options: [
        "均值向量",
        "协方差矩阵最大特征值的特征向量",
        "最小奇异值方向",
        "标签的梯度",
      ],
      answer: 1,
      explain: "Rayleigh 商 uᵀΣu 在单位球上的最大值就是 λmax，方向就是第一主成分。",
    },
  ],
};

export const svdChapter: ChapterContent = {
  id: "svd",
  takeaways: [
    "任意矩阵 = 旋转 · 拉伸 · 旋转。",
    "截断 SVD 是最佳低秩近似（Eckart–Young）。",
    "伪逆、PCA、LoRA、谱归一化，都是 SVD 的方言。",
  ],
  blocks: [
    {
      t: "lead",
      text: "特征值要求方阵。数据矩阵 n×d、权重 dout×din 都不是方的。SVD 补上这个缺口，是 AI 里最重要的分解。",
    },
    {
      t: "formula",
      tex: r`A=U\Sigma V^\top`,
    },
    {
      t: "ul",
      items: [
        "U：左奇异向量，输出空间的正交标架",
        "V：右奇异向量，输入空间的标架",
        r`$\Sigma$：对角，奇异值 $\sigma_1\ge\sigma_2\ge\cdots\ge 0$`,
      ],
    },
    {
      t: "p",
      text: r`几何三步：Vᵀ 转到主轴 → Σ 各轴独立拉伸 → U 转到输出空间。奇异值是 $A^\top A$ 特征值的平方根。PCA 实际计算几乎总是对 X 做 SVD，而不是先形成协方差。`,
    },
    { t: "lab", lab: "svd" },
    { t: "h2", text: "Eckart–Young：最佳低秩近似" },
    {
      t: "formula",
      tex: r`A_k=\sum_{i=1}^k\sigma_i u_i v_i^\top,\qquad \|A-A_k\|_F^2=\sum_{i>k}\sigma_i^2`,
    },
    {
      t: "p",
      text: "这一个定理撑起图像压缩、潜在语义分析、推荐系统、主成分、LoRA 的「小 r 够不够」、剪枝时「哪几个方向能扔」。",
    },
    {
      t: "callout",
      kind: "ai",
      title: "伪逆的稳定公式",
      body: r`$A^{+}=V\Sigma^{+}U^\top$，其中 $\sigma_i^{+}=1/\sigma_i$（σ=0 则取 0）。小 σ 一取倒数就炸，所以岭回归 / 截断 SVD 用 $\sigma/(\sigma^2+\lambda)$ 或把小于阈值的 σ 当 0。`,
    },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三",
      body: "谱归一化只追 σmax(W)，用幂迭代估，然后 W←W/σmax，让 Lipschitz≤1。正交正则逼近奇异值都靠近 1。分析 Transformer 权重的有效秩随训练如何变化，用的也是这套语言。",
    },
    {
      t: "quiz",
      id: "svd-q1",
      q: "管「这一层放大多少」的是特征值还是奇异值？",
      options: [
        "一定是特征值",
        "奇异值（σmax = 算子范数）。非对称矩阵的特征值可以是复数，并不等于放大倍数",
        "行列式",
        "迹",
      ],
      answer: 1,
      explain: "‖A‖2 = σmax(A)。旋转的特征值在复平面单位圆上，但奇异值全是 1——保长度。",
    },
  ],
};

export const quadraticChapter: ChapterContent = {
  id: "quadratic",
  takeaways: [
    "二次型在特征坐标里是 Σ λi zi²，椭圆、峡谷或马鞍一目了然。",
    "Hessian 是损失的局部二次型；条件数描述它有多扁。",
    "Adam 本质是用对角矩阵去近似 H⁻¹。",
  ],
  blocks: [
    {
      t: "lead",
      text: "优化不在「点」上发生，而在损失曲面上发生。局部看来，曲面就是一个二次型，由 Hessian 决定。",
    },
    {
      t: "formula",
      tex: r`f(x)=x^\top A x=\sum_i\lambda_i z_i^2`,
    },
    {
      t: "p",
      text: r`损失 $L(\theta+\Delta)\approx L+\nabla L^\top\Delta+\frac12\Delta^\top H\Delta$。H 的谱决定你站在碗里、峡谷里，还是马鞍上。`,
    },
    {
      t: "table",
      columns: ["Hessian 谱", "曲面", "对训练"],
      rows: [
        ["全正，条件数小", "圆碗", "GD 很快"],
        ["全正，条件数大", "细长峡谷", "需要小步长或自适应方法"],
        ["有负特征值", "马鞍", "高维极常见，SGD 噪声有助于逃离"],
        ["很多近 0", "平坦", "和泛化的关系是研究热点"],
      ],
    },
    {
      t: "p",
      text: r`条件数 $\kappa=\lambda_{\max}/\lambda_{\min}$：椭圆有多扁。扁，则沿某些方向走一步就过冲。Adam / RMSProp 用对角去近似 $H^{-1}$，在各坐标上自动调步长。牛顿法直接乘 $H^{-1}$，太贵，也怕 H 不定。`,
    },
    {
      t: "callout",
      kind: "transfer",
      title: "举一反三",
      body: r`权重衰减给 Hessian 加上 $\lambda I$，把小特征值抬起来，改善 κ。BatchNorm / LayerNorm 让损失对尺度不那么敏感。SAM 明确去找较平的极小值。学习率 warmup 与 cosine，是在谱未知时用日程硬控步长。`,
    },
    {
      t: "callout",
      kind: "warn",
      title: "不要用法方程去撞条件数",
      body: "(XᵀX)⁻¹ 的条件数是 X 的 κ 的平方。特征一相关就灾难。数值上用 QR / SVD 解最小二乘。深度学习用 SGD 绕开了显式求逆，但相关特征依然让 Hessian 变扁。",
    },
    {
      t: "quiz",
      id: "quad-q1",
      q: "为什么高维深度网络里「严格的局部极小」可能没那么可怕？",
      options: [
        "因为损失是凸的",
        "因为临界点常常是马鞍，SGD 的噪声容易把你推走",
        "因为 Hessian 一定正定",
        "因为 dropout 消除了所有特征值",
      ],
      answer: 1,
      explain: "随机矩阵理论的直觉：高维里所有特征值同号的点很少。训练过程更多是在溜过马鞍，而不是掉进孤岛式的假极小。",
    },
  ],
};

export const decompChapters = [eigenChapter, svdChapter, quadraticChapter];
