// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timeStamp = new Date().getTime();
    const randomNum = Math.floor(math.random() * 1000)
    return 'task_${timeStamp}_${randomNum}';
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-card");

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description;

    const deadline = document.createElement("p");
    deadline.textContent = 'Deadline: ${task.deadline}'

    const status = document.createElement("p");
    status.textContent = 'Status: ${task.status}'


    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(deadline);
    card.appendChild(status);

    const taskContainer = document.getElementById("task-container");

}

createTaskCard(newTask);

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.array.forEach(task => {
        const $taskCard = $('<div class ="task-card"></div>')
        $taskCard.text(task.title)
        $taskCard.appendTo('.task-board')

        $taskCard.draggable ({
            containment: 'task.board',
            scroll: false
        });
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(title, description, deadline){
// Example Task card
    const newTask = {
        title: "Task Title",
        description: "Task Description",
        deadline: "2024-12-31",
        status: "Not Started"
};

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify('tasks'));

    renderTaskList();

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskID){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const taskIndex = tasks.findIndex(task => task.id === taskId)

    if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();     
    } else {
        console.log('Task not found with ID: ' + taskId);
    }
    handleDeleteTask('task1');
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
// Get the task element and status lane element
    const taskElement = document.getElementById('task');
    const statusLane = document.getElementById('status-lane');

// Add event listeners for drag and drop events
    taskElement.addEventListener('dragstart', dragStart);
    statusLane.addEventListener('dragover', dragOver);
    statusLane.addEventListener('drop', handleDrop);

// Event handler functions
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const droppedTask = document.getElementById(taskId);
    
    statusLane.appendChild(droppedTask);
}
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {


});