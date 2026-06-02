const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const totalSteps = document.getElementById("totalSteps");

const overallText = document.getElementById("overallText");
const overallBar = document.getElementById("overallBar");

let tasks = [];

function updateOverallProgress() {

    let completed = 0;
    let total = 0;

    tasks.forEach(task => {
        completed += task.completedSteps;
        total += task.totalSteps;
    });

    overallText.textContent =
        `${completed} / ${total} Completed`;

    const percent =
        total === 0
            ? 0
            : (completed / total) * 100;

    overallBar.style.width = `${percent}%`;
}

function renderTasks() {

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

        li.innerHTML = `
            <div class="${completedClass}">
                <div class="task-top">

                    <span class="task-title">
                        ${task.name}
                    </span>

                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                </div>

                <div class="task-progress">
                    ${task.completedSteps} / ${task.totalSteps}
                </div>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width:${percent}%"
                    ></div>
                </div>

                <div class="task-controls">

                    <button class="minus">
                        −
                    </button>

                    <button class="plus">
                        +
                    </button>

                    <button class="delete">
                        Delete
                    </button>

                </div>
            </div>
        `;

        const minusBtn =
            li.querySelector(".minus");

        const plusBtn =
            li.querySelector(".plus");

        const deleteBtn =
            li.querySelector(".delete");

        minusBtn.addEventListener("click", () => {

            if (task.completedSteps > 0) {
                task.completedSteps--;
            }

            renderTasks();
        });

        plusBtn.addEventListener("click", () => {

            if (
                task.completedSteps <
                task.totalSteps
            ) {
                task.completedSteps++;
            }

            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {

            tasks.splice(index, 1);
            renderTasks();
        });

        taskList.appendChild(li);
    });

    updateOverallProgress();
}

addTaskBtn.addEventListener("click", () => {

    const name = taskName.value.trim();

    const total =
        parseInt(totalSteps.value);

    if (!name) return;
    if (total < 1) return;

    tasks.push({
        name: name,
        priority: priority.value,
        totalSteps: total,
        completedSteps: 0
    });

    taskName.value = "";
    totalSteps.value = 1;

    renderTasks();
});

renderTasks();
