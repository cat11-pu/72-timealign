// fill.js：取值与缺口。每个网格点取之前最近的采样值（hold）；
// 之前没有值就取之后最近的并计入 filled；连续空桶超过 maxGap 记为缺口并标空。
// 采样指针随网格单调推进，整体 O(采样数 + 网格数)，不对每个网格点重扫。
export function fill(points, grid, mode, maxGap = 1) {
  const samples = (points || []).slice().sort((a, b) => a.t - b.t);
  const values = new Array(grid.length).fill(null);
  const gaps = [];
  let filled = 0;

  // 第一遍：标出没有精确采样的空桶，连续空桶超过上限记为缺口
  let cursor = 0;
  let run = [];
  const flush = () => {
    if (run.length > maxGap) gaps.push(...run);
    run = [];
  };
  for (let i = 0; i < grid.length; i += 1) {
    while (cursor < samples.length && samples[cursor].t <= grid[i]) cursor += 1;
    if (cursor > 0 && samples[cursor - 1].t === grid[i]) flush();
    else run.push(i);
  }
  flush();
  const isGap = new Set(gaps);

  // 第二遍：取值，缺口位置留空
  cursor = 0;
  for (let i = 0; i < grid.length; i += 1) {
    if (isGap.has(i)) continue;
    const t = grid[i];
    while (cursor < samples.length && samples[cursor].t <= t) cursor += 1;
    if (cursor > 0) {
      values[i] = samples[cursor - 1].v;
    } else if (cursor < samples.length) {
      values[i] = samples[cursor].v;
      filled += 1;
    }
  }
  return { values, gaps, filled };
}
