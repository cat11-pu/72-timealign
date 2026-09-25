// grid.js：从起点按步长铺网格，推进到最大采样时间（含端点）
export function align(points, step, origin = 0) {
  if (!(step > 0)) {
    const error = new Error("E_BAD_STEP");
    error.code = "E_BAD_STEP";
    throw error;
  }
  const list = points || [];
  if (list.length === 0) return { grid: [], buckets: 0 };
  let maxT = list[0].t;
  for (const point of list) {
    if (point.t > maxT) maxT = point.t;
  }
  const grid = [];
  const EPS = 1e-9;
  for (let i = 0; ; i += 1) {
    const t = origin + i * step;
    if (t > maxT + EPS) break;
    grid.push(t);
  }
  return { grid, buckets: grid.length };
}
