// NOTE: The CI/CD pipeline replaces this placeholder with the real API endpoint.
const API_BASE_URL = "__API_URL__";

const els = {
  form: document.getElementById("todo-form"),
  title: document.getElementById("title"),
  list: document.getElementById("todo-list"),
  stats: document.getElementById("stats"),
  filterAll: document.getElementById("filter-all"),
  filterOpen: document.getElementById("filter-open"),
  filterDone: document.getElementById("filter-done"),
  markAll: document.getElementById("mark-all"),
};

let todos = [];
let filter = "all";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function load() {
  todos = await api("/todos");
  render();
}

function render() {
  let shown = todos;
  if (filter === "open") shown = todos.filter(t => !t.completed);
  if (filter === "done") shown = todos.filter(t => t.completed);

  els.list.innerHTML = "";
  shown.forEach(t => {
    const li = document.createElement("li");
    if (t.completed) li.classList.add("done");
    li.innerHTML = `
      <span>${t.title}</span>
      <div class="todo-actions">
        <button data-id="${t.id}" data-action="toggle">${t.completed ? "Reopen" : "Done"}</button>
        <button data-id="${t.id}" data-action="delete">Delete</button>
      </div>
    `;
    els.list.appendChild(li);
  });

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  els.stats.textContent = `Total: ${total} • Done: ${done} • Open: ${total - done}`;
}

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = els.title.value.trim();
  if (!title) return;
  const created = await api("/todos", { method: "POST", body: JSON.stringify({ title }) });
  todos.push(created);
  els.title.value = "";
  render();
});

els.list.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === "toggle") {
    const item = todos.find(x => x.id === id);
    const updated = await api(`/todos/${id}`, { method: "PATCH", body: JSON.stringify({ completed: !item.completed }) });
    const idx = todos.findIndex(x => x.id === id);
    todos[idx] = updated;
    render();
  } else if (action === "delete") {
    await api(`/todos/${id}`, { method: "DELETE" });
    todos = todos.filter(x => x.id !== id);
    render();
  }
});

els.filterAll.onclick = () => { filter = "all"; render(); };
els.filterOpen.onclick = () => { filter = "open"; render(); };
els.filterDone.onclick = () => { filter = "done"; render(); };
els.markAll.onclick = async () => {
  for (const t of todos.filter(x => !x.completed)) {
    await api(`/todos/${t.id}`, { method: "PATCH", body: JSON.stringify({ completed: true }) });
    t.completed = true;
  }
  render();
};

load().catch(err => {
  console.error(err);
  alert("Failed to load todos. Check API URL and CORS.");
});
