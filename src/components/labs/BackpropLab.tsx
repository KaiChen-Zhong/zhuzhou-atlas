import { useMemo, useState } from "react";
import { fmt, matVec, outer, sub, transpose, type Mat, type Vec } from "@/lib/linalg";
import { Button } from "@/components/ui/button";
import { LabCard, MatrixGrid, Stat } from "./shared";

export function BackpropLab({ standalone = false }: { standalone?: boolean }) {
  const x: Vec = [1, 2];
  const y: Vec = [1, 0];
  const [W, setW] = useState<Mat>([
    [0.4, -0.2],
    [0.1, 0.8],
  ]);
  const [lr, setLr] = useState(0.2);

  const { yhat, loss, delta, dW, dx } = useMemo(() => {
    const yhat = matVec(W, x);
    const delta = sub(yhat, y);
    const loss = 0.5 * (delta[0] ** 2 + delta[1] ** 2);
    const dW = outer(delta, x);
    const dx = matVec(transpose(W), delta);
    return { yhat, loss, delta, dW, dx };
  }, [W]);

  function step() {
    setW([
      [W[0][0] - lr * dW[0][0], W[0][1] - lr * dW[0][1]],
      [W[1][0] - lr * dW[1][0], W[1][1] - lr * dW[1][1]],
    ]);
  }

  return (
    <LabCard
      labId={standalone ? "backprop" : undefined}
      title="一层线性 + MSE 的反传"
      hint="正向乘 W，反向对输入乘 Wᵀ，对权重是残差与输入的外积。点一次梯度下降，看损失往下走。"
    >
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">W（可改）</p>
          <MatrixGrid value={W} onChange={setW} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="x" value={`${fmt(x[0])}, ${fmt(x[1])}`} />
          <Stat label="y 目标" value={`${fmt(y[0])}, ${fmt(y[1])}`} />
          <Stat label="ŷ = Wx" value={`${fmt(yhat[0])}, ${fmt(yhat[1])}`} />
          <Stat label="损失 ½‖ŷ−y‖²" value={fmt(loss, 3)} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">δ = ŷ − y</p>
          <MatrixGrid value={[delta]} />
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">∂L/∂W = δ xᵀ</p>
          <MatrixGrid value={dW} />
        </div>
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        ∂L/∂x = Wᵀ δ = ({fmt(dx[0])}, {fmt(dx[1])})
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={step}>沿 −∇ 走一步</Button>
        <Button
          variant="outline"
          onClick={() =>
            setW([
              [0.4, -0.2],
              [0.1, 0.8],
            ])
          }
        >
          重置
        </Button>
        <label className="flex h-11 items-center gap-2 text-sm text-muted-foreground">
          η
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.05}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="accent-accent"
          />
          <span className="font-mono tabular-nums text-foreground">{fmt(lr)}</span>
        </label>
      </div>
    </LabCard>
  );
}
