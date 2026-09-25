// app.js：渲染结果
import { align } from "./grid.js";
import { fill } from "./fill.js";

export function render(spec) {
  const points = spec.points || [];
  const origin = spec.origin || 0;
  const gridded = align(points, spec.step, origin);
  const done = fill(points, gridded.grid, spec.mode, spec.max_gap ?? 1);
  // 幂等自检：把铺好的网格当采样点再对齐一遍，结果必须逐项相同
  const again = align(gridded.grid.map((t) => ({ t, v: 0 })), spec.step, origin);
  const idempotent = again.grid.length === gridded.grid.length &&
    again.grid.every((t, i) => t === gridded.grid[i]);
  return { grid: gridded.grid, values: done.values, gaps: done.gaps,
           filled: done.filled, buckets: gridded.buckets, idempotent };
}
