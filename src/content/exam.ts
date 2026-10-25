export type ExamQ = {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export const examQuestions: ExamQ[] = [
  {
    id: "e1",
    q: "没有非线性时，100 层全连接网络等价于什么？",
    options: ["100 个独立的特征探测器", "一层线性变换（一个矩阵）", "一个卷积", "一个正交变换"],
    answer: 1,
    explain: "矩阵乘法可结合：W100 ⋯ W1 仍是一个矩阵。非线性才阻止塌缩，并把空间折成片状仿射区域。",
  },
  {
    id: "e2",
    q: "Attention score 除以 √d 主要是为了什么？",
    options: ["让矩阵变成正交", "降低内积方差，避免 softmax 过尖", "把值映射到 [0,1]", "减少参数量"],
    answer: 1,
    explain: "若坐标近似独立，d 维内积的方差随 d 线性增长。除 √d 后尺度稳定，softmax 才不会过早变成 one-hot。",
  },
  {
    id: "e3",
    q: "反向传播时，对输入的梯度为什么乘 Wᵀ 而不是 W？",
    options: ["习惯", "因为 ⟨Wx, δ⟩ = ⟨x, Wᵀδ⟩", "Wᵀ 更稀疏", "转置可以降维"],
    answer: 1,
    explain: "内积伴随：正向用 W，把残差送回输入空间必须用伴随算子 Wᵀ。",
  },
  {
    id: "e4",
    q: "PCA 求的是哪张矩阵的特征向量？",
    options: ["原始数据 X", "中心化后的协方差 XᵀX / n", "损失函数 Hessian", "注意力矩阵"],
    answer: 1,
    explain: "最大特征值方向 = 方差最大方向。实际计算常用 X 的 SVD，等价且更稳。",
  },
  {
    id: "e5",
    q: "LoRA 的秩 r 在 Eckart–Young 意义下限制了什么？",
    options: ["学习率", "任务增量 ΔW 的有效自由度", "词表大小", "softmax 温度"],
    answer: 1,
    explain: "ΔW = BA 的秩 ≤ r，因此它最多是原权重空间里一个 r 维转向。许多微调任务的增量确实近似低秩。",
  },
  {
    id: "e6",
    q: "残差连接 x + F(x) 如何改变复合变换的谱？",
    options: ["强制所有奇异值为 0", "变成对角矩阵", "默认接近恒等 I，特征值靠近 1", "变成置换矩阵"],
    answer: 2,
    explain: "写成 (I+F)x。F 小时谱靠近 1，深层信号不容易消失或爆炸。",
  },
  {
    id: "e7",
    q: "岭回归里的 λI 同时做了哪两件事？",
    options: ["增加非线性、降低学习率", "保证 XᵀX+λI 正定可逆、改善条件数", "做 PCA、做 SVD", "稀疏化、二值化"],
    answer: 1,
    explain: "加上 λI 把小特征值抬起来：既避免不可逆，又让椭圆不那么扁，解更稳。权重衰减是同一几何。",
  },
  {
    id: "e8",
    q: "BatchNorm 只估每维均值方差，近似掉了协方差的什么？",
    options: ["对角元", "特征之间的相关性（非对角）", "样本数", "学习率"],
    answer: 1,
    explain: "完整白化要用满协方差并把椭圆拧成圆。BatchNorm 是廉价的对角近似：只按坐标轴缩放。",
  },
  {
    id: "e9",
    q: "线性注意力把 (QKᵀ)V 改成 Q(KᵀV)，用的是哪条代数定律？",
    options: ["交换律", "结合律", "分配律", "谱定理"],
    answer: 1,
    explain: "结合律 (AB)C = A(BC)。softmax 卡在中间时不能随便结合；去掉或核化 softmax 后，T≫d 时先算 KᵀV 更便宜。",
  },
  {
    id: "e10",
    q: "高维里 Hessian 常有负特征值，意味着什么？SGD 为什么常常不怕？",
    options: ["一定发散", "局部是马鞍；噪声与随机性有助于逃离", "损失非凸所以不能训练", "必须改用牛顿法"],
    answer: 1,
    explain: "负特征值 = 马鞍。高维里「所有方向都是山谷」的点极稀少。小批量噪声会把参数推离不稳定的临界点。",
  },
];
