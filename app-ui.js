// app-ui.js

import {
  tasks,
  completedTasks,
  saveData,
  formatTime,
  formatDate,
  isOverdue,
  toLocalInputValue,
  getCategoryBadge,
  getCategoryLabel,
  getPriorityBadge,
  getPriorityLabel
} from "./app-data.js";

// DOM refs
const tasksListEl = document.getElementById("tasksList");
const completedListEl = document.getElementById("completedList");
const tasksCountEl = document.getElementById("tasksCount");
const themeToggleEl = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");
const toastEl = document.getElementById("toast");
const toastMessageEl = document.getElementById("toast-message");
const modalBackdropEl = document.getElementById("modalBackdrop");
const modalTitleEl = document.getElementById("modalTitle");
const modalBodyEl = document.getElementById("modalBody");
const modalFooterEl = document.getElementById("modalFooter");
const closeModalBtn = document.getElementById("closeModalBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// language buttons
const langEnBtn = document.getElementById("lang-en");
const langArBtn = document.getElementById("lang-ar");

let currentFilter = "all";

let currentLang = localStorage.getItem("lang") || "en";

// ========= Translations =========
const translations = {
  en: {
    welcome: "Welcome 👋",
    subtitle: "Let’s organize your day and build new achievements.",
    moodText: "You can do it step by step",
    addTask: "+ Add Task",
    filterAll: "All",
    filterToday: "Today",
    filterHigh: "High Priority",
    todayTasks: "Today Tasks",
    tasksCountSuffix: "Tasks",
    completedTitle: "Completed / Missed",
    completedSubtitle: "Every step counts",
    clearCompleted: "Clear",
    searchPlaceholder: "Search for a task...",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    modalAddTitle: "Add New Task",
    modalEditTitle: "Edit Task",
    modalCompleteTitle: "Task Completed 🎉",
    modalMissedTitle: "Task Missed",
    toastAdd: "Task added successfully",
    toastUpdate: "Task updated successfully",
    toastComplete: "Great job!",
    toastMissed: "It's okay, keep going.",
    confirmClearCompleted: "Clear all completed tasks?",
    labelTitle: "Title",
    labelCategory: "Category",
    labelPriority: "Priority",
    labelDue: "Due Date",
    labelNote: "Note (optional)",
    btnCancel: "Cancel",
    btnAdd: "Add",
    btnSave: "Save",
    btnComplete: "Complete",
    btnMissed: "Missed",
    btnEdit: "Edit",
    btnDelete: "Delete",
    catWork: "Work",
    catHome: "Home",
    catPersonal: "Personal",
    prioHigh: "High",
    prioMedium: "Medium",
    prioLow: "Low"
  },
  ar: {
    welcome: "أهلًا 👋",
    subtitle: "خلّينا نرتّب يومك ونبني إنجازات جديدة.",
    moodText: "تقدر/ي خطوة خطوة",
    addTask: "+ إضافة مهمة",
    filterAll: "الكل",
    filterToday: "اليوم",
    filterHigh: "أولوية عالية",
    todayTasks: "مهام اليوم",
    tasksCountSuffix: "مهام",
    completedTitle: "المهام المكتملة / الفائتة",
    completedSubtitle: "كل خطوة تفرق",
    clearCompleted: "مسح المكتملة",
    searchPlaceholder: "ابحث عن مهمة...",
    themeDark: "الوضع الداكن",
    themeLight: "الوضع الفاتح",
    modalAddTitle: "إضافة مهمة جديدة",
    modalEditTitle: "تعديل مهمة",
    modalCompleteTitle: "تم إنجاز المهمة 🎉",
    modalMissedTitle: "مهمة فائتة",
    toastAdd: "تمت إضافة المهمة بنجاح",
    toastUpdate: "تم تحديث المهمة بنجاح",
    toastComplete: "أحسنتِ!",
    toastMissed: "عادي، كمّلي وحاولي تاني.",
    confirmClearCompleted: "هل تريدين مسح كل المهام المكتملة؟",
    labelTitle: "العنوان",
    labelCategory: "الفئة",
    labelPriority: "الأولوية",
    labelDue: "تاريخ الاستحقاق",
    labelNote: "ملاحظة (اختياري)",
    btnCancel: "إلغاء",
    btnAdd: "إضافة",
    btnSave: "حفظ",
    btnComplete: "إكمال",
    btnMissed: "فاتت",
    btnEdit: "تعديل",
    btnDelete: "حذف",
    catWork: "عمل",
    catHome: "المنزل",
    catPersonal: "شخصي",
    prioHigh: "عالية",
    prioMedium: "متوسطة",
    prioLow: "منخفضة"
  }
};

function applyTranslations() {
  const dict = translations[currentLang];

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  if (langEnBtn && langArBtn) {
    langEnBtn.classList.toggle("active", currentLang === "en");
    langArBtn.classList.toggle("active", currentLang === "ar");
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });

  const isDark = document.body.classList.contains("dark");
  if (themeText) themeText.textContent = isDark ? dict.themeLight : dict.themeDark;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
  renderTasks();
  renderCompleted();
}


document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  renderTasks();
  renderCompleted();
});

// ========= Toast & Theme =========
export function showToast(key) {
  const dict = translations[currentLang];
  toastMessageEl.textContent = dict[key] || key;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2000);
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

if (themeToggleEl) {
  themeToggleEl.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    const dict = translations[currentLang];
    if (themeText) themeText.textContent = isDark ? dict.themeLight : dict.themeDark;
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };
}

if (langEnBtn && langArBtn) {
  langEnBtn.onclick = () => setLanguage("en");
  langArBtn.onclick = () => setLanguage("ar");
}

if (clearCompletedBtn) {
  clearCompletedBtn.onclick = () => {
    const dict = translations[currentLang];
    if (!completedTasks.length) return;
    const ok = confirm(dict.confirmClearCompleted);
    if (!ok) return;
    completedTasks.length = 0;
    saveData();
    renderCompleted();
  };
}

// ========= Modal helpers =========
export function openModal() {
  modalBackdropEl.classList.add("show");
}
export function closeModal() {
  modalBackdropEl.classList.remove("show");
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) tasks.splice(index, 1);
  saveData();
  renderTasks();
}

// ========= Render Functions =========
export function renderTasks() {
  if (!tasksListEl) return;
  tasksListEl.innerHTML = "";
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  let filtered = tasks.filter((t) => !t.completed);

  if (currentFilter === "today") {
    const today = new Date();
    filtered = filtered.filter(
      (t) =>
        t.due.getDate() === today.getDate() &&
        t.due.getMonth() === today.getMonth() &&
        t.due.getFullYear() === today.getFullYear()
    );
  } else if (currentFilter === "high") {
    filtered = filtered.filter((t) => t.priority === "high");
  }

  if (searchTerm)
    filtered = filtered.filter((t) =>
      t.title.toLowerCase().includes(searchTerm)
    );

  const dict = translations[currentLang];
  if (tasksCountEl) tasksCountEl.textContent = `${filtered.length} ${dict.tasksCountSuffix}`;

  filtered.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    if (isOverdue(task)) taskEl.classList.add("overdue");

    taskEl.innerHTML = `
      <div class="task-main">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span class="badge ${getCategoryBadge(task.category)}">${
            task.category === "work" ? dict.catWork : task.category === "home" ? dict.catHome : dict.catPersonal
          }</span>
          <span class="badge ${getPriorityBadge(task.priority)}">${dict.labelPriority}: ${
            task.priority === "high" ? dict.prioHigh : task.priority === "medium" ? dict.prioMedium : dict.prioLow
          }</span>
          <span class="task-time">⏰ <span>${formatTime(task.due)} - ${formatDate(task.due)}</span></span>
          ${isOverdue(task) ? `<span style="color: var(--danger); font-size: .8rem;">${dict.modalMissedTitle}</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-mini btn-complete">${isOverdue(task) ? dict.btnMissed : dict.btnComplete}</button>
        <button class="btn-mini btn-edit">${dict.btnEdit}</button>
        <button class="btn-mini btn-delete">${dict.btnDelete}</button>
      </div>
    `;

    taskEl.querySelector(".btn-complete").onclick = () => openCompleteModal(task.id, isOverdue(task) ? "missed" : "complete");
    taskEl.querySelector(".btn-edit").onclick = () => openEditModal(task.id);
    taskEl.querySelector(".btn-delete").onclick = () => deleteTask(task.id);
    tasksListEl.appendChild(taskEl);
  });
}

export function renderCompleted() {
  if (!completedListEl) return;
  completedListEl.innerHTML = "";
  completedTasks.forEach((t) => {
    const el = document.createElement("div");
    el.className = "completed-task" + (t.missed ? " missed" : "");
    el.innerHTML = `
      <div class="completed-header">
        <div>
          <div class="completed-title">${t.title}</div>
          <div class="completed-note">${t.note || (t.missed ? "No reason added." : "No note added.")}</div>
        </div>
        <div class="completed-icon">${t.missed ? "😔" : "🎉"}</div>
      </div>
    `;
    completedListEl.appendChild(el);
  });
}

// ========= Modals Functions =========
export function openAddModal() {
  const dict = translations[currentLang];
  modalTitleEl.textContent = dict.modalAddTitle;
  modalBodyEl.innerHTML = `
    <label>${dict.labelTitle}</label><input id="addTitle" />
    <label>${dict.labelCategory}</label>
    <select id="addCategory">
      <option value="work">${dict.catWork}</option>
      <option value="home">${dict.catHome}</option>
      <option value="personal">${dict.catPersonal}</option>
    </select>
    <label>${dict.labelPriority}</label>
    <select id="addPriority">
      <option value="high">${dict.prioHigh}</option>
      <option value="medium" selected>${dict.prioMedium}</option>
      <option value="low">${dict.prioLow}</option>
    </select>
    <label>${dict.labelDue}</label><input type="datetime-local" id="addDue" />
  `;
  modalFooterEl.innerHTML = `
    <button class="btn-sm btn-outline" id="cancelAddBtn">${dict.btnCancel}</button>
    <button class="btn-sm btn-fill" id="saveAdd">${dict.btnAdd}</button>
  `;
  document.getElementById("cancelAddBtn").onclick = closeModal;
  document.getElementById("saveAdd").onclick = () => {
    const title = document.getElementById("addTitle").value.trim();
    const due = document.getElementById("addDue").value;
    if (!title || !due) return;
    tasks.unshift({ id: Date.now(), title, category: document.getElementById("addCategory").value, priority: document.getElementById("addPriority").value, due: new Date(due), completed: false });
    saveData(); renderTasks(); closeModal(); showToast("toastAdd");
  };
  openModal();
}

export function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const dict = translations[currentLang];
  modalTitleEl.textContent = dict.modalEditTitle;
  modalBodyEl.innerHTML = `
    <label>${dict.labelTitle}</label><input id="editTitle" value="${task.title}" />
    <label>${dict.labelCategory}</label>
    <select id="editCategory">
      <option value="work" ${task.category === "work" ? "selected" : ""}>${dict.catWork}</option>
      <option value="home" ${task.category === "home" ? "selected" : ""}>${dict.catHome}</option>
      <option value="personal" ${task.category === "personal" ? "selected" : ""}>${dict.catPersonal}</option>
    </select>
    <label>${dict.labelPriority}</label>
    <select id="editPriority">
      <option value="high" ${task.priority === "high" ? "selected" : ""}>${dict.prioHigh}</option>
      <option value="medium" ${task.priority === "medium" ? "selected" : ""}>${dict.prioMedium}</option>
      <option value="low" ${task.priority === "low" ? "selected" : ""}>${dict.prioLow}</option>
    </select>
    <label>${dict.labelDue}</label><input type="datetime-local" id="editDue" value="${toLocalInputValue(task.due)}" />
  `;
  modalFooterEl.innerHTML = `
    <button class="btn-sm btn-outline" id="cancelEditBtn">${dict.btnCancel}</button>
    <button class="btn-sm btn-fill" id="saveEdit">${dict.btnSave}</button>
  `;
  document.getElementById("cancelEditBtn").onclick = closeModal;
  document.getElementById("saveEdit").onclick = () => {
    const newTitle = document.getElementById("editTitle").value.trim();
    const newDue = new Date(document.getElementById("editDue").value);
    if (!newTitle || !newDue) return;
    task.title = newTitle; task.category = document.getElementById("editCategory").value; task.priority = document.getElementById("editPriority").value; task.due = newDue;
    saveData(); renderTasks(); closeModal(); showToast("toastUpdate");
  };
  openModal();
}

export function openCompleteModal(id, mode) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const dict = translations[currentLang];
  modalTitleEl.textContent = mode === "complete" ? dict.modalCompleteTitle : dict.modalMissedTitle;
  modalBodyEl.innerHTML = `<label>${dict.labelNote}</label><textarea id="note"></textarea>`;
  modalFooterEl.innerHTML = `
    <button class="btn-sm btn-outline" id="cancelCompleteBtn">${dict.btnCancel}</button>
    <button class="btn-sm btn-fill" id="saveComplete">${dict.btnSave}</button>
  `;
  document.getElementById("cancelCompleteBtn").onclick = closeModal;
  document.getElementById("saveComplete").onclick = () => {
    completedTasks.unshift({ title: task.title, note: document.getElementById("note").value.trim(), missed: mode === "missed" });
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) tasks.splice(index, 1);
    saveData(); renderTasks(); renderCompleted(); closeModal(); showToast(mode === "complete" ? "toastComplete" : "toastMissed");
  };
  openModal();
}

export function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

export { addTaskBtn, searchInput, closeModalBtn };