// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: Crwating a specific ID for each task
function generateTaskId() {
    const timeStamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000)
    return `task_${timeStamp}_${randomNum}`;
}

// Creating the task  card
function createTaskCard(task) {

    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-taskid', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.deadline);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-taskid', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    // Return the card so it can be appended to the correct lane.
    return taskCard;

}

const newTask = {
    title: "Task Title",
    description: "Task Description",
    deadline: "2024-12-31",
    status: "Not Started"
};

// Creates a task list for each category
function renderTaskList() {

    // Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();
    taskList = [];
    for (let task of taskList) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    // Using JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Creating a function to handle adding a new task
function handleAddTask() {
    // Task card Structure
    const newTask = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#formDescription').val(),
        deadline: $('#taskDueDate').val(),
        status: 'to-do'
    };
    console.log(newTask)

    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

}

// Creating a function to handle deleting a task
function handleDeleteTask() {
    const taskId = $(this).attr('data-taskid');

    // Remove project from the array. 
    for (let index = 0; index < taskList.length; index++) {
        const task = taskList[index];
        console.log(task.id, taskId)
        if (task.id === taskId) {
        taskList.splice(index, 1);
        }
    };
    console.log(taskList)
    localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
}

function handleDrop(event, ui) {
    event.preventDefault();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log(ui)
    const laneId = $(this).attr("id")
    console.log(laneId)
    const taskID = ui.draggable[0].dataset.taskid
    console.log(taskID)
    for (const task of tasks) {
        if (task.id === taskID) {
            task.status = laneId
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();
}


// when the page loads, it renders the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Get the task element and status lane element
    const taskElement = document.getElementById('task');
    const statusLane = document.getElementById('status-lane');

    renderTaskList();

    // Add event listeners for drag and drop events
    // Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });



    $('#save-changes').on('click', handleAddTask)

});

    //extra js


    // const card = document.createElement("div");
    // card.classList.add("task-card");

    // const title = document.createElement("h3");
    // title.textContent = task.title;

    // const description = document.createElement("p");
    // description.textContent = task.description;

    // const deadline = document.createElement("p");
    // deadline.textContent = `Deadline: ${task.deadline}`

    // const status = document.createElement("p");
    // status.textContent = `Status: ${task.status}`

        // card.appendChild(title);
    // card.appendChild(description);
    // card.appendChild(deadline);
    // card.appendChild(status);

    // tasks.forEach(task => {
    //     const $taskCard = $('<div class ="task-card"></div>')
    //     $taskCard.text(task.title)
    //     $taskCard.appendTo('.task-board')

    //     $taskCard.draggable({
    //         containment: 'task.board',
    //         scroll: false
    //     });
    // });

    


// function handleDeleteTask(taskID) {
//     const taskId = $(this).attr('data-project-id');

//     let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

//     const taskIndex = tasks.findIndex(task => task.id === taskId)

//     if (taskIndex !== -1) {
//         tasks.splice(taskIndex, 1);
//         localStorage.setItem('tasks', JSON.stringify(tasks));
//         renderTaskList();
//     } else {
//         console.log('Task not found with ID: ' + taskId);
//     }
//     handleDeleteTask('task1');
// }

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {

// }
// // Event handler functions
// function dragStart(event) {
//     event.dataTransfer.setData('text/plain', event.target.id);
// }

// function dragOver(event) {
//     event.preventDefault();
// }

    // Search JQuery Droppable
    // Create a JQuery Datepicker