// app-data.js

import { fetchTasks } from './api.js';

// DATA -- populated by loadData(), mutated by app-ui.js
export let tasks = [];
export let completedTasks = [];

export async function loadData() {
  const all = await fetchTasks();

  tasks.length = 0;
  completedTasks.length = 0;

  all.forEach(t => {
    if (t.status === 'pending') {
      tasks.push({ ...t, due: new Date(t.due), completed: false });
    } else {
      completedTasks.push({
        id: t.id,
        title: t.title,
        note: t.note || '',
        missed: t.status === 'missed',
      });
    }
  });
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
