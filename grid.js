export function align(points, step, origin) {
  // 步长必须为正：非正数（含 NaN / Infinity）一律报 E_BAD_STEP，
  // 网格点数量预先算成有界整数，循环不可能失控变成死循环。
  if (typeof step !== "number" || !Number.isFinite(step) || step <= 0) {
    const error = new Error("E_BAD_STEP: step must be a positive number");
    error.code = "E_BAD_STEP";
    throw error;
  }
  const start = typeof origin === "number" && Number.isFinite(origin) ? origin : 0;
  if (!Array.isArray(points) || points.length === 0) {
    return { grid: [], buckets: 0 };
  }
  let maxT = -Infinity;
  for (const point of points) {
    if (point.t > maxT) maxT = point.t;
  }
  // 最大采样时间早于起点时没有可铺的区间。
  if (!(maxT >= start)) {
    return { grid: [], buckets: 0 };
  }
  // 从起点按步长推进到最大采样时间（含端点）：下标乘步长出网格时间，
  // 避免反复相加产生浮点漂移，步长为正时网格严格递增。
  const count = Math.floor((maxT - start) / step + 1e-9) + 1;
  const grid = new Array(count);
  for (let i = 0; i < count; i += 1) {
    grid[i] = start + i * step;
  }
  return { grid, buckets: count };
}
