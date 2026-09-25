// fill.js：插值与缺口（基线：缺口留空、不记方式）
export function fill(points, grid, mode) {
  return { values: grid.map(() => null), gaps: [], filled: 0 };
}
