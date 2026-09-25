// grid.js：网格（基线：直接用原始时间点）
export function align(points, step, origin) {
  return { grid: points.map((point) => point.t), buckets: points.length };
}
