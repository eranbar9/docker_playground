const API_BASE_URL = "http://localhost:3000";

const addForm = document.getElementById("add-form");
const nameInput = document.getElementById("name-input");
const formMsg = document.getElementById("form-msg");
const refreshBtn = document.getElementById("refresh-btn");
const itemsList = document.getElementById("items-list");
const healthBtn = document.getElementById("health-btn");
const healthOutput = document.getElementById("health-output");

async function fetchItems() {
  itemsList.innerHTML = "<li>Loading...</li>";
  try {
    const res = await fetch(`${API_BASE_URL}/items`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    if (items.length === 0) {
      itemsList.innerHTML = "<li><em>No items yet.</em></li>";
      return;
    }
    itemsList.innerHTML = items
      .map(
        (i) =>
          `<li><strong>${escapeHtml(i.name)}</strong> <span class="meta">${new Date(i.createdAt).toLocaleString()}</span></li>`
      )
      .join("");
  } catch (err) {
    itemsList.innerHTML = `<li class="error">Failed to load items: ${escapeHtml(err.message)}</li>`;
  }
}

async function addItem(name) {
  formMsg.textContent = "Saving...";
  formMsg.className = "msg";
  try {
    const res = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    formMsg.textContent = `Added "${data.name}"`;
    formMsg.className = "msg success";
    nameInput.value = "";
    fetchItems();
  } catch (err) {
    formMsg.textContent = `Error: ${err.message}`;
    formMsg.className = "msg error";
  }
}

async function checkHealth() {
  healthOutput.textContent = "Checking...";
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    healthOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    healthOutput.textContent = `Error: ${err.message}`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (name) addItem(name);
});
refreshBtn.addEventListener("click", fetchItems);
healthBtn.addEventListener("click", checkHealth);

fetchItems();
