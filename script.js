const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    const li = document.createElement("li");

    li.innerHTML = `
        <div class="task-left">
            <input type="checkbox">
            <span>${text}</span>
        </div>
        <button class="delete-btn">Delete</button>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed", checkbox.checked);
    });

    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    taskList.appendChild(li);
    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});
