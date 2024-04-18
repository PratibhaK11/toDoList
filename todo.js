
const taskInput = document.querySelector(".input");
const addBTN = document.querySelector(".btn");
const ListBox = document.querySelector(".taskList");
const count = document.querySelectorAll(".container span");
const removeAllBtn = document.querySelector(".remove-btn");

let getList = JSON.parse(localStorage.getItem("todoList")) || [];

// Function to display the filtered list of tasks
function showTodoList(statusFilter) {
    let filteredList = getList;
    if (statusFilter !== "all") {
        filteredList = getList.filter(todo => todo.status.toLowerCase() === statusFilter);
    }
    let li = "";
    filteredList.forEach((todo, id) => {
        let isCompleted = todo.status === "Completed" ? "checked" : "";
        li += `<li class="task">
            <label for="${id}">
                <input onclick="updatedStatus(this)" type="checkbox" name="checkbox" id="${id}" ${isCompleted}>
                <p class="${isCompleted}" contenteditable="true" onblur="editTaskName(${id}, this)">${todo.name}</p>
            </label>
            <div class="setting">
                <i class="fas fa-edit"></i>
                <i onclick="deleteTask(${id})" class="fas fa-trash-alt"></i>
            </div>
        </li>`;
    });
    ListBox.innerHTML = li;
}

// Function to edit task name
function editTaskName(taskId, editedTaskName) {
    let newName = editedTaskName.innerText.trim();
    getList[taskId].name = newName;
    localStorage.setItem("todoList", JSON.stringify(getList));
}

// Function to delete a task
function deleteTask(deletedId) {
    getList.splice(deletedId, 1);
    localStorage.setItem("todoList", JSON.stringify(getList));
    showTodoList(document.querySelector(".container .active").id); // Show tasks according to active filter
}

// Function to update the status of a task
function updatedStatus(checkedTask) {
    let taskId = checkedTask.id;
    let taskName = checkedTask.parentElement.querySelector('p');
    if (checkedTask.checked) {
        taskName.classList.add("checked");
        getList[taskId].status = "Completed";
    } else {
        taskName.classList.remove("checked");
        getList[taskId].status = "Pending";
    }
    localStorage.setItem("todoList", JSON.stringify(getList));
}

// Event listener for adding a new task
addBTN.addEventListener("click", () => {
    let userInput = taskInput.value.trim();
    if (userInput && !getList.some(task => task.name === userInput)) {
        taskInput.value = "";
        let listInfo = { name: userInput, status: "pending" };
        getList.push(listInfo);
        localStorage.setItem("todoList", JSON.stringify(getList));
        showTodoList(document.querySelector(".container .active").id); // Show tasks according to active filter
    } else {
        alert("Task already exists or input is empty!");
    }
});

// Event listener for removing all tasks
removeAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to remove all tasks?")) {
        getList = []; // Clear the task list
        localStorage.setItem("todoList", JSON.stringify(getList)); // Update localStorage
        showTodoList(document.querySelector(".container .active").id); // Show tasks according to active filter
    }
});

// Add event listeners to the filter buttons
count.forEach(Click => {
    Click.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        Click.classList.add("active");
        showTodoList(Click.id);
    });
});

// Add event listeners for editing task names
document.querySelectorAll(".taskList p").forEach(p => {
    p.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent line break
            this.blur(); // Finish editing
        }
    });
});

// Initially display all tasks
showTodoList("all");
