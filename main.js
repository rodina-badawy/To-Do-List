// main.js

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

addTaskBtn.onclick = openAddModal;
searchInput.oninput = renderTasks;
closeModalBtn.onclick = closeModal;

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.onclick = () => {
    setFilter(btn.dataset.filter);
    renderTasks();
  };
});

renderTasks();
renderCompleted();
