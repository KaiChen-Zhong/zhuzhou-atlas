import type { LabId } from "@/lib/curriculum";
import { AttentionLab } from "./AttentionLab";
import { BackpropLab } from "./BackpropLab";
import { EigenLab } from "./EigenLab";
import { LoraLab } from "./LoraLab";
import { MultiplyLab } from "./MultiplyLab";
import { SvdLab } from "./SvdLab";
import { TransformLab } from "./TransformLab";
import { VectorLab } from "./VectorLab";

export function LabById({ id, standalone = false }: { id: string; standalone?: boolean }) {
  switch (id as LabId) {
    case "vector":
      return <VectorLab standalone={standalone} />;
    case "transform":
      return <TransformLab standalone={standalone} />;
    case "multiply":
      return <MultiplyLab standalone={standalone} />;
    case "eigen":
      return <EigenLab standalone={standalone} />;
    case "svd":
      return <SvdLab standalone={standalone} />;
    case "backprop":
      return <BackpropLab standalone={standalone} />;
    case "attention":
      return <AttentionLab standalone={standalone} />;
    case "lora":
      return <LoraLab standalone={standalone} />;
    default:
      return null;
  }
}

export {
  AttentionLab,
  BackpropLab,
  EigenLab,
  LoraLab,
  MultiplyLab,
  SvdLab,
  TransformLab,
  VectorLab,
};
