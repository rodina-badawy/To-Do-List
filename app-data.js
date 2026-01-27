// app-data.js

// DATA
export let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
export let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

tasks = tasks.map(t => ({ ...t, due: new Date(t.due) }));

export function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// ========= Utils =========
export function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
export function formatDate(date) {
  return date.toLocaleDateString("en-US");
}
export function isOverdue(task) {
  return !task.completed && task.due.getTime() < Date.now();
}
export function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getCategoryBadge(c) {
  return c === "work" ? "badge-work" : c === "home" ? "badge-home" : "badge-personal";
}
export function getCategoryLabel(c) {
  return c === "work" ? "Work" : c === "home" ? "Home" : "Personal";
}
export function getPriorityBadge(p) {
  return p === "high" ? "badge-priority-high" : p === "medium" ? "badge-priority-medium" : "badge-priority-low";
}
export function getPriorityLabel(p) {
  return p === "high" ? "High" : p === "medium" ? "Medium" : "Low";
}
