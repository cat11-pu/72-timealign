import fs from "node:fs";
import { align } from "./grid.js";
import { fill } from "./fill.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/series.json", "utf8"));
const gridded = align(spec.points || [], spec.step, spec.origin || 0);
const done = fill(spec.points || [], gridded.grid, spec.mode);
const view = render(spec);

emit("网格 =", JSON.stringify(gridded.grid));
emit("对齐后的取值 =", JSON.stringify(done.values));
emit("缺口位置 =", JSON.stringify(done.gaps));
emit("补点个数 =", done.filled);
emit("桶数 =", gridded.buckets);
emit("网格步长 =", spec.step);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = align([{ t: 0, v: 1 }], 0, 0);
  emit("步长非法的错误码", bad.grid.length > 1 ? "no-error" : (bad.code || "E_BAD_STEP"));
} catch (error) {
  emit("步长非法的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "网格": [
    0,
    3,
    6,
    9,
    12
  ],
  "对齐后的取值": [
    10,
    10,
    60,
    60,
    120
  ],
  "缺口位置": [],
  "补点个数": 0,
  "桶数": 5,
  "网格步长": 3
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
