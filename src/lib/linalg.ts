export type Mat = number[][];
export type Vec = number[];

const EPS = 1e-10;

export function dim(A: Mat): [number, number] {
  return [A.length, A[0]?.length ?? 0];
}

export function zeros(m: number, n: number): Mat {
  return Array.from({ length: m }, () => Array.from({ length: n }, () => 0));
}

export function identity(n: number): Mat {
  const I = zeros(n, n);
  for (let i = 0; i < n; i++) I[i][i] = 1;
  return I;
}

export function clone(A: Mat): Mat {
  return A.map((r) => r.slice());
}

export function transpose(A: Mat): Mat {
  const [m, n] = dim(A);
  const T = zeros(n, m);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j][i] = A[i][j];
  return T;
}

export function matMul(A: Mat, B: Mat): Mat {
  const [m, k] = dim(A);
  const n = B[0]?.length ?? 0;
  const C = zeros(m, n);
  for (let i = 0; i < m; i++) {
    for (let t = 0; t < k; t++) {
      const a = A[i][t];
      if (a === 0) continue;
      for (let j = 0; j < n; j++) C[i][j] += a * B[t][j];
    }
  }
  return C;
}

export function matVec(A: Mat, x: Vec): Vec {
  return A.map((row) => dot(row, x));
}

export function addMat(A: Mat, B: Mat): Mat {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

export function scaleMat(A: Mat, s: number): Mat {
  return A.map((row) => row.map((v) => v * s));
}

export function outer(u: Vec, v: Vec): Mat {
  return u.map((ui) => v.map((vj) => ui * vj));
}

export function dot(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}

export function normalize(a: Vec): Vec {
  const n = norm(a);
  if (n < EPS) return a.map(() => 0);
  return a.map((v) => v / n);
}

export function sub(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v - b[i]);
}

export function add(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v + b[i]);
}

export function scale(a: Vec, s: number): Vec {
  return a.map((v) => v * s);
}

export function det2(A: Mat): number {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

export function inv2(A: Mat): Mat | null {
  const d = det2(A);
  if (Math.abs(d) < EPS) return null;
  const s = 1 / d;
  return [
    [A[1][1] * s, -A[0][1] * s],
    [-A[1][0] * s, A[0][0] * s],
  ];
}

export function frobenius(A: Mat): number {
  let s = 0;
  for (const row of A) for (const v of row) s += v * v;
  return Math.sqrt(s);
}

export function round(n: number, d = 3): number {
  const p = 10 ** d;
  const x = Math.round(n * p) / p;
  return Object.is(x, -0) ? 0 : x;
}

export function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return "—";
  const x = round(n, d);
  return Object.is(x, -0) ? "0" : String(x);
}

export function softmax(z: Vec): Vec {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

export type Eigen2 = {
  values: [number, number];
  vectors: [Vec, Vec];
  complex: boolean;
};

export function eigen2(A: Mat): Eigen2 {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc < -1e-8) {
    const re = tr / 2;
    return {
      values: [re, re],
      vectors: [
        [1, 0],
        [0, 1],
      ],
      complex: true,
    };
  }
  const s = Math.sqrt(Math.max(disc, 0));
  const l1 = (tr + s) / 2;
  const l2 = (tr - s) / 2;
  return {
    values: [l1, l2],
    vectors: [eigenvec2(A, l1), eigenvec2(A, l2)],
    complex: false,
  };
}

function eigenvec2(A: Mat, lambda: number): Vec {
  const a = A[0][0] - lambda;
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1] - lambda;
  let v: Vec;
  if (Math.abs(b) + Math.abs(a) >= Math.abs(c) + Math.abs(d)) {
    v = Math.abs(a) + Math.abs(b) < EPS ? [1, 0] : [-b, a];
  } else {
    v = Math.abs(c) + Math.abs(d) < EPS ? [0, 1] : [-d, c];
  }
  const n = normalize(v);
  return n[0] < 0 || (n[0] === 0 && n[1] < 0) ? scale(n, -1) : n;
}

export type SVD2 = { U: Mat; S: [number, number]; V: Mat };

export function svd2(A: Mat): SVD2 {
  const At = transpose(A);
  const AtA = matMul(At, A);
  const eig = eigen2(AtA);
  let pairs = [
    { s: Math.sqrt(Math.max(eig.values[0], 0)), v: eig.vectors[0] },
    { s: Math.sqrt(Math.max(eig.values[1], 0)), v: eig.vectors[1] },
  ];
  pairs.sort((p, q) => q.s - p.s);
  const V: Mat = [
    [pairs[0].v[0], pairs[1].v[0]],
    [pairs[0].v[1], pairs[1].v[1]],
  ];
  const S: [number, number] = [pairs[0].s, pairs[1].s];
  const u0 =
    S[0] > 1e-8 ? normalize(matVec(A, pairs[0].v).map((x) => x / S[0])) : [1, 0];
  let u1: Vec;
  if (S[1] > 1e-8) {
    u1 = normalize(matVec(A, pairs[1].v).map((x) => x / S[1]));
  } else {
    u1 = normalize([-u0[1], u0[0]]);
  }
  if (det2([u0, u1]) < 0) u1 = scale(u1, -1);
  const U: Mat = [
    [u0[0], u1[0]],
    [u0[1], u1[1]],
  ];
  return { U, S, V };
}

export function lowRankApprox(A: Mat, r: number): Mat {
  const { U, S, V } = svd2(A);
  const k = Math.max(0, Math.min(r, S.length));
  const Sigma = [
    [k >= 1 ? S[0] : 0, 0],
    [0, k >= 2 ? S[1] : 0],
  ];
  return matMul(matMul(U, Sigma), transpose(V));
}

export function rotate(theta: number): Mat {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s],
    [s, c],
  ];
}

export function apply2(A: Mat, x: number, y: number): [number, number] {
  return [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
}
