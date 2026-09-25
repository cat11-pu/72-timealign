// fill.js：网格取值。每个网格点取“之前最近”的采样值（hold），
// 之前还没有采样时才借用“之后最近”的采样值（回填，计入 filled）。
// 连续空桶（采样未正好落在网格点上的桶）数量超过缺口上限 maxGap 时，
// 整段记为缺口并在 values 里标空 null。整过程单趟线性推进。
export function fill(points, grid, mode, maxGap = 1) {
  const values = new Array(grid.length).fill(null);
  const gaps = [];
  let filled = 0;
  if (!Array.isArray(points) || !Array.isArray(grid) || grid.length === 0) {
    return { values, gaps, filled };
  }

  // 只在内部排序，不改调用方数据；同一时间重复采样以最后一个为准。
  const ordered = points.slice().sort((a, b) => a.t - b.t);
  let cursor = 0;
  let lastValue = null;
  let hasLast = false;

  // 跟踪当前连续空桶游程 [runStart, runEnd]；exact 命中会结束游程。
  let runStart = -1;
  let runLen = 0;

  function closeRun(end) {
    if (runLen > maxGap) {
      for (let j = runStart; j <= end; j += 1) {
        values[j] = null;
        gaps.push(j);
      }
    }
    runStart = -1;
    runLen = 0;
  }

  for (let i = 0; i < grid.length; i += 1) {
    const t = grid[i];
    let exactValue;
    // 游标只随网格点单调向前，总推进次数 O(points)。
    while (cursor < ordered.length && ordered[cursor].t <= t) {
      hasLast = true;
      lastValue = ordered[cursor].v;
      if (ordered[cursor].t === t) exactValue = ordered[cursor].v;
      cursor += 1;
    }
    if (exactValue !== undefined) {
      closeRun(i - 1);
      values[i] = exactValue;
      continue;
    }
    if (hasLast) {
      // 之前最近的采样值（向前保持），不算补点。
      values[i] = lastValue;
    } else if (cursor < ordered.length) {
      // 之前没有值：借用之后最近的采样值并计数回填。
      values[i] = ordered[cursor].v;
      filled += 1;
    }
    // 前后都没有采样（例如没有任何采样点）时保持 null，不计数回填。
    if (runLen === 0) runStart = i;
    runLen += 1;
  }
  closeRun(grid.length - 1);

  gaps.sort((a, b) => a - b);
  return { values, gaps, filled };
}
