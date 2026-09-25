// app.js：渲染结果
import { align } from "./grid.js";
import { fill } from "./fill.js";

function runOnce(spec) {
  const points = spec.points || [];
  const gridded = align(points, spec.step, spec.origin || 0);
  const done = fill(points, gridded.grid, spec.mode, spec.max_gap);
  return { grid: gridded.grid, values: done.values, gaps: done.gaps,
           filled: done.filled, buckets: gridded.buckets };
}

// 幂等：align/fill 只从原始采样点出发，不回写输入，
// 同一份 spec 重跑一遍，网格、取值、缺口、补点数必须逐项相同。
function sameAs(first, second) {
  if (first.grid.length !== second.grid.length) return false;
  for (let i = 0; i < first.grid.length; i += 1) {
    if (first.grid[i] !== second.grid[i] || first.values[i] !== second.values[i]) return false;
  }
  if (first.buckets !== second.buckets || first.filled !== second.filled) return false;
  if (first.gaps.length !== second.gaps.length) return false;
  for (let i = 0; i < first.gaps.length; i += 1) {
    if (first.gaps[i] !== second.gaps[i]) return false;
  }
  return true;
}

export function render(spec) {
  const first = runOnce(spec);
  const second = runOnce(spec);
  return { grid: first.grid, values: first.values, gaps: first.gaps,
           filled: first.filled, buckets: first.buckets,
           idempotent: sameAs(first, second) };
}
