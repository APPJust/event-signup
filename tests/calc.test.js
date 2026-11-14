const test = require("node:test");
const assert = require("node:assert/strict");
const { signupResult } = require("../calc.js");

test("官方案例 1：名額已滿時加入候補", () => {
  assert.deepStrictEqual(
    signupResult(2, [["join", "小安"], ["join", "阿哲"], ["join", "小薇"]]),
    { accepted: ["小安", "阿哲"], waitlist: ["小薇"] },
  );
});

test("官方案例 2：正取取消後由候補遞補", () => {
  assert.deepStrictEqual(
    signupResult(2, [["join", "小安"], ["join", "阿哲"], ["join", "小薇"], ["cancel", "小安"]]),
    { accepted: ["阿哲", "小薇"], waitlist: [] },
  );
});

test("官方案例 3：候補取消不影響正取", () => {
  assert.deepStrictEqual(
    signupResult(1, [["join", "小安"], ["join", "阿哲"], ["join", "小薇"], ["cancel", "阿哲"]]),
    { accepted: ["小安"], waitlist: ["小薇"] },
  );
});

test("官方案例 4：重複加入與取消未報名者不改變名單", () => {
  assert.deepStrictEqual(
    signupResult(2, [["join", "小安"], ["join", "小安"], ["cancel", "大寶"]]),
    { accepted: ["小安"], waitlist: [] },
  );
});

test("官方案例 5：空操作紀錄回傳空名單", () => {
  assert.deepStrictEqual(signupResult(3, []), { accepted: [], waitlist: [] });
});

test("官方案例 6：名額為 0 時丟出錯誤", () => {
  assert.throws(
    () => signupResult(0, [["join", "小安"]]),
    { name: "Error", message: "名額必須是 1 以上的整數。" },
  );
});

test("官方案例 7：未支援的動作丟出錯誤", () => {
  assert.throws(
    () => signupResult(2, [["leave", "小安"]]),
    { name: "Error", message: "第 1 筆動作只能是 join 或 cancel。" },
  );
});

test("自訂案例：姓名去除前後空白後視為同一人", () => {
  assert.deepStrictEqual(
    signupResult(1, [["join", " 小安 "], ["join", "小安"], ["cancel", " 小安"]]),
    { accepted: [], waitlist: [] },
  );
});

test("自訂案例：取消不在任何名單的人不影響現有名單", () => {
  assert.deepStrictEqual(
    signupResult(1, [["join", "小安"], ["join", "阿哲"], ["cancel", "大寶"]]),
    { accepted: ["小安"], waitlist: ["阿哲"] },
  );
});

test("自訂案例：非整數名額丟出繁體中文錯誤", () => {
  assert.throws(
    () => signupResult(2.5, []),
    { name: "Error", message: "名額必須是 1 以上的整數。" },
  );
});

test("自訂案例：操作紀錄格式錯誤時指出筆數", () => {
  assert.throws(
    () => signupResult(2, [["join"]]),
    { name: "Error", message: "第 1 筆操作格式錯誤，需為 [動作, 姓名]。" },
  );
});

test("自訂案例：空白姓名丟出繁體中文錯誤", () => {
  assert.throws(
    () => signupResult(2, [["join", "   "]]),
    { name: "Error", message: "第 1 筆姓名必須是文字，且不可空白。" },
  );
});
