// app.js：渲染结果
import { align } from "./grid.js";
import { fill } from "./fill.js";

export function render(spec) {
  const gridded = align(spec.points || [], spec.step, spec.origin || 0);
  const done = fill(spec.points || [], gridded.grid, spec.mode);
  return { grid: gridded.grid, values: done.values, gaps: done.gaps,
           filled: done.filled, buckets: gridded.buckets, idempotent: true };
}
