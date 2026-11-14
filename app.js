(() => {
  const capacityInput = document.getElementById("capacity");
  const operationForm = document.getElementById("operation-form");
  const actionInput = document.getElementById("action");
  const nameInput = document.getElementById("participant-name");
  const errorMessage = document.getElementById("error-message");
  const statusMessage = document.getElementById("status-message");
  const actionList = document.getElementById("action-list");
  const emptyActions = document.getElementById("empty-actions");
  const clearActionsButton = document.getElementById("clear-actions");
  const calculateButton = document.getElementById("calculate");
  const resultsSection = document.getElementById("results");
  const resultCapacity = document.getElementById("result-capacity");
  const acceptedList = document.getElementById("accepted-list");
  const waitlistList = document.getElementById("waitlist-list");
  const sourceLink = document.getElementById("source-link");
  const actions = [];

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = message.length === 0;
    if (message.length > 0) {
      statusMessage.textContent = "";
    }
  }

  function showStatus(message) {
    statusMessage.textContent = message;
  }

  function invalidateResult() {
    const hadResults = !resultsSection.hidden;
    resultsSection.hidden = true;
    if (hadResults) {
      showStatus("操作或名額已變更，請重新計算。");
    }
  }

  function renderActions() {
    actionList.replaceChildren();
    emptyActions.hidden = actions.length > 0;
    clearActionsButton.disabled = actions.length === 0;

    actions.forEach(([action, name], index) => {
      const item = document.createElement("li");
      item.className = "action-row";

      const label = document.createElement("span");
      label.className = "action-label";
      label.textContent = `${index + 1}. ${action === "join" ? "報名" : "取消"}：${name}`;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "刪除";
      deleteButton.setAttribute("aria-label", `刪除第 ${index + 1} 筆操作`);
      deleteButton.addEventListener("click", () => {
        const hadResults = !resultsSection.hidden;
        actions.splice(index, 1);
        renderActions();
        resultsSection.hidden = true;
        showError("");
        if (hadResults) {
          showStatus("操作紀錄已變更，請重新計算。");
        }
      });

      item.append(label, deleteButton);
      actionList.append(item);
    });
  }

  function renderNameList(target, names) {
    target.replaceChildren();
    if (names.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.textContent = "（無）";
      target.append(emptyItem);
      return;
    }

    names.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      target.append(item);
    });
  }

  operationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showError("");

    const name = nameInput.value.trim();
    if (name.length === 0) {
      showError("姓名不可空白，請輸入姓名。");
      nameInput.focus();
      return;
    }

    const hadResults = !resultsSection.hidden;
    actions.push([actionInput.value, name]);
    renderActions();
    invalidateResult();
    nameInput.value = "";
    nameInput.focus();
    if (!hadResults) {
      showStatus(`已新增第 ${actions.length} 筆操作。`);
    }
  });

  clearActionsButton.addEventListener("click", () => {
    const hadResults = !resultsSection.hidden;
    actions.splice(0, actions.length);
    renderActions();
    invalidateResult();
    showError("");
    if (!hadResults) {
      showStatus("操作紀錄已清空；名額設定保留。");
    }
  });

  calculateButton.addEventListener("click", () => {
    showError("");
    showStatus("");

    try {
      const capacityText = capacityInput.value.trim();
      if (capacityText.length === 0) {
        throw new Error("請輸入正取名額。");
      }

      const capacity = Number(capacityText);
      const result = signupResult(capacity, actions);
      resultCapacity.textContent = `正取名額：${capacity} 人`;
      renderNameList(acceptedList, result.accepted);
      renderNameList(waitlistList, result.waitlist);
      resultsSection.hidden = false;
      showStatus("計算完成。");
    } catch (error) {
      resultsSection.hidden = true;
      showError(error instanceof Error && error.message ? error.message : "無法計算，請檢查輸入內容。");
    }
  });

  capacityInput.addEventListener("input", invalidateResult);
  sourceLink.addEventListener("click", (event) => event.preventDefault());
  renderActions();
})();
