const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const totalSteps = document.getElementById("totalSteps");

const overallText = document.getElementById("overallText");
const overallBar = document.getElementById("overallBar");

const selectMultipleBtn = document.getElementById("selectMultiple");
const selectAllBtn = document.getElementById("selectAll");
const bulkActions = document.getElementById("bulkActions");

let tasks = [];
let multiSelectMode = false;
let selectedTasks = new Set();

// ------------------------------
// OVERALL PROGRESS (TASK-BASED)
// ------------------------------
function updateOverallProgress() {

    let completedTasks = 0;
    let totalTasks = tasks.length;

    tasks.forEach(task => {
        if (task.completedSteps === task.totalSteps) {
            completedTasks++;
        }
    });

    overallText.textContent =
        `${completedTasks} / ${totalTasks} Tasks Completed`;

    const percent =
        totalTasks === 0
            ? 0
            : (completedTasks / totalTasks) * 100;

    overallBar.style.width = `${percent}%`;
}

// ------------------------------
// RENDER TASKS (WITH SORTING)
// ------------------------------
function renderTasks() {

    // Sort by pinned first, then priority
    tasks.sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };

        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = "task";

        const percent =
            (task.completedSteps / task.totalSteps) * 100;

        const completedClass =
            task.completedSteps === task.totalSteps
                ? "completed"
                : "";

        const isSelected = selectedTasks.has(index);

        li.innerHTML = `
            <div class="${completedClass}">
                <div class="task-top">

                    <span class="task-title">${task.name}</span>

                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                    <button class="menu-btn">⋯</button>

                    <div class="menu hidden">
                        <button class="rename">Rename</button>
                        <button class="pin">${task.pinned ? "Unpin" : "Pin"}</button>
                        <button class="delete">Delete</button>
                    </div>

                </div>

                <div class="task-progress">
                    ${task.completedSteps} / ${task.totalSteps}
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>

                <div class="task-controls">

                    <button class="minus">−</button>
                    <button class="plus">+</button>

                    ${
                        multiSelectMode
                        ? `<button class="select-btn ${isSelected ? "selected" : ""}">
                               ${isSelected ? "✔" : "Select"}
                           </button>`
                        : `<button class="delete">Delete</button>`
                    }

                </div>
            </div>
        `;

        // Buttons
        const minusBtn = li.querySelector(".minus");
        const plusBtn = li.querySelector(".plus");
        const deleteBtn = li.querySelector(".delete");
        const menuBtn = li.querySelector(".menu-btn");
        const menu = li.querySelector(".menu");
        const renameBtn = li.querySelector(".rename");
        const pinBtn = li.querySelector(".pin");
        const selectBtn = li.querySelector(".select-btn");

        // Step controls
        minusBtn.addEventListener("click", () => {
            if (task.completedSteps > 0) {
                task.completedSteps--;
            }
            renderTasks();
        });

        plusBtn.addEventListener("click", () => {
            if (task.completedSteps < task.totalSteps) {
                task.completedSteps++;
            }
            renderTasks();
        });

        // Delete
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
            });
        }

        // Menu toggle
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });

        // Rename
        renameBtn.addEventListener("click", () => {
            const newName = prompt("Rename task:", task.name);
            if (newName) task.name = newName;
            renderTasks();
        });

        // Pin
        pinBtn.addEventListener("click", () => {
            task.pinned = !task.pinned;
            renderTasks();
        });

        // Multi-select
        if (selectBtn) {
            selectBtn.addEventListener("click", () => {
                if (selectedTasks.has(index)) {
                    selectedTasks.delete(index);
                } else {
                    selectedTasks.add(index);
                }
                renderTasks();
            });
        }

        taskList.appendChild(li);
    });

    updateOverallProgress();
}

// ------------------------------
// MULTI-SELECT MODE
// ------------------------------
selectMultipleBtn.addEventListener("click", () => {
    multiSelectMode = !multiSelectMode;
    selectedTasks.clear();

    bulkActions.style.display = multiSelectMode ? "flex" : "none";
    selectAllBtn.style.display = multiSelectMode ? "inline-block" : "none";

    renderTasks();
});

// Select All
selectAllBtn.addEventListener("click", () => {
    selectedTasks.clear();
    tasks.forEach((_, i) => selectedTasks.add(i));
    renderTasks();
});

// Bulk Categorize
document.getElementById("bulkCategorize").addEventListener("click", () => {
    const category = prompt("Enter category name:");
    if (!category) return;

    selectedTasks.forEach(i => {
        tasks[i].category = category;
    });

    selectedTasks.clear();
    renderTasks();
});

// Bulk Delete
document.getElementById("bulkDelete").addEventListener("click", () => {
    tasks = tasks.filter((_, i) => !selectedTasks.has(i));
    selectedTasks.clear();
    renderTasks();
});

// ------------------------------
// ADD TASK
// ------------------------------
addTaskBtn.addEventListener("click", () => {

    const name = taskName.value.trim();
    const total = parseInt(totalSteps.value);

    if (!name) return;
    if (total < 1) return;

    tasks.push({
        name: name,
        priority: priority.value,
        totalSteps: total,
        completedSteps: 0,
        pinned: false,
        category: null
    });

    taskName.value = "";
    totalSteps.value = 1;

    renderTasks();
});

renderTasks();
