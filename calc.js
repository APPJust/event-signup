function signupResult(capacity, actions) {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error("名額必須是 1 以上的整數。");
  }

  if (!Array.isArray(actions)) {
    throw new Error("操作紀錄必須是陣列。");
  }

  const accepted = [];
  const waitlist = [];

  for (let index = 0; index < actions.length; index += 1) {
    const entry = actions[index];
    if (!Array.isArray(entry) || entry.length !== 2) {
      throw new Error(`第 ${index + 1} 筆操作格式錯誤，需為 [動作, 姓名]。`);
    }

    const [action, rawName] = entry;
    if (action !== "join" && action !== "cancel") {
      throw new Error(`第 ${index + 1} 筆動作只能是 join 或 cancel。`);
    }

    if (typeof rawName !== "string") {
      throw new Error(`第 ${index + 1} 筆姓名必須是文字，且不可空白。`);
    }

    const name = rawName.trim();
    if (name.length === 0) {
      throw new Error(`第 ${index + 1} 筆姓名必須是文字，且不可空白。`);
    }

    if (action === "join") {
      if (accepted.includes(name) || waitlist.includes(name)) {
        continue;
      }

      if (accepted.length < capacity) {
        accepted.push(name);
      } else {
        waitlist.push(name);
      }
      continue;
    }

    const acceptedIndex = accepted.indexOf(name);
    if (acceptedIndex !== -1) {
      accepted.splice(acceptedIndex, 1);
      if (waitlist.length > 0) {
        accepted.push(waitlist.shift());
      }
      continue;
    }

    const waitlistIndex = waitlist.indexOf(name);
    if (waitlistIndex !== -1) {
      waitlist.splice(waitlistIndex, 1);
    }
  }

  return { accepted, waitlist };
}

if (typeof module !== "undefined") module.exports = { signupResult };
