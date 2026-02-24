// main.js

import { isLoggedIn } from "./api.js";
import { loadData } from "./app-data.js";
import {
  renderTasks,
  renderCompleted,
  openAddModal,
  closeModal,
  setFilter,
  addTaskBtn,
  searchInput,
  closeModalBtn
} from "./app-ui.js";

// Auth guard: redirect to login if not authenticated
if (!isLoggedIn()) {
  window.location.href = 'login.html';
} else {
  addTaskBtn.onclick = openAddModal;
  searchInput.oninput = renderTasks;
  closeModalBtn.onclick = closeModal;

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => {
      setFilter(btn.dataset.filter);
      renderTasks();
    };
  });

  // Load data from API, then render
  loadData()
    .then(() => {
      renderTasks();
      renderCompleted();
    })
    .catch((err) => {
      console.error('Failed to load tasks:', err);
    });
}
