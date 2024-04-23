// Both lines of code are pulling data from local storage elements, then translating it into the JSON format, it then pushes it into a JavaScript object, the variable is defined as the object to be used later in the code. 
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// This function is to generate a uhnique numerical ID for each indivudual task, therefore it will not confuse the loal storage for generating task lists.
function generateTaskId() {
    // This line of code generates a very percise timestamp for when something occure, down to the millisecond. for example, exactally when a new task card was created. 
    const timeStamp = new Date().getTime();
    // This line of code generates a random number with a cap limit of 1000, and then multiplies it by 1000, the floor element rounds the number to a whole integer, the variable is able tp be used later in the code.  
    const randomNum = Math.floor(Math.random() * 1000)
    // This line of code is returning the 2 variables above for use of the webpage
    return `task_${timeStamp}_${randomNum}`;
}
// This function is creating the task card structure with a task parameter for the entire function to refer back to
function createTaskCard(task) {
    //this variable is defined by setting the task-card variable to the HTML Div containers
    const taskCard = $('<div>')
    //Adding 4 classes using JQuery for the CSS stying
        .addClass('card task-card draggable my-3')
    //Using JQuery to set attributes by refering to the parameter of the function
        .attr('data-taskid', task.id);
    //Defining a new variable creating a new div HTML element, then adding new CSS classes based on the div element, then setting the text content to the parameter for the task title section
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    //Defining a new Variable by creating a new div HTML element, then adding a class for CSS labeled card-body for the card body section of the task card
    const cardBody = $('<div>').addClass('card-body');
    //Defining a new variable by creating a new p HTML element, then adding a new class for CSS styling for the task description section. Then refering to the paremeter for the text to appear in the task description element
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    //Defining a new variable by creating a new p HTML element, then adding a new class for CSS styling labeled card-text, the pulling the parameter for the text in the deadline component
    const cardDueDate = $('<p>').addClass('card-text').text(task.deadline);
    //Defining a new variable for the delete button, then creating a new object using a button HTML element
    const cardDeleteBtn = $('<button>')
    //Adds CSS classes using bootstrap fo styling the delete button.\ 
        .addClass('btn btn-danger delete')
    //This sets the text inside the button to 'delete'
        .text('Delete')
    //This element allows us to delete only tasks we want to delete, only deletes the card for a task who's button has been clicked by refering to the original parameter. 
        .attr('data-taskid', task.id);
    //This line of code is listening for when the mouse clicks on the button, once clicked, the handkeDeleteTask function and all ofits components will run
    cardDeleteBtn.on('click', handleDeleteTask);

    //This 'if' statement reads: if the task duedate and the status of the task-card is NOT done, then run the statement
    if (task.dueDate && task.status !== 'done') {
    //Defining a new variable to display the current date and time using dayjs()
        const now = dayjs();
    // Defining a new variable to compare the current date and time with the due date on the task card
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    //This 'if' statement reads: if what the now variable reads is the same as the taskduedate value, then style it with a warning color to let the person know their task is due today
        if (now.isSame(taskDueDate, 'day')) {
    //Using bootstrap for when this if statement criteria is met to change the appearance of a card that is due today
            taskCard.addClass('bg-warning text-white');
    //This 'if' statement reads: if what the the now variable reads is after the taskduedate vaule, add a CSS styling class that stylies the card and delete button
        } else if (now.isAfter(taskDueDate)) {
    //Using bootstrap for these 2 lines of code to call the taskcard and the delete button to change the appearance for when a task is past due
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    //This line is appending the specific components by calling variables for the taskcard elements to be displayed on a task card. 
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    //This line is appending the header of a card and the entire card body to a task card. 
    taskCard.append(cardHeader, cardBody);

    //Reurns the fully constructed task card and its elements, exits the function and calls the appropiate variable
    return taskCard;

}
//Defining a new variable for the overall structure of the task card to refer to later in the code
const newTask = {
  //Storing the title of the task as a default of "Task Title"
    title: "Task Title",
  //Storing the description of the task as a default of "Task Description"
    description: "Task Description",
  //Storing the format of the deadline date by setting a template of 2024-12-31 in the YYYY-MM-DD format
    deadline: "2024-12-31",
  //Sets the default setting of a new task to the Not Started category
    status: "Not Started"
};

//This function sets up the status collumns of task cards
function renderTaskList() {
  taskList =  JSON.parse(localStorage.getItem("tasks")) || [];

    //Defining a variable by selecting the Id todo-cards from index.html using JQuery
    const todoList = $('#todo-cards');
    //This allows us to remove all child elements within that container from the HTML,the content within the specified Id of todo-cards to be empty, so that they can be added directly from the webpage interactivity inside the empty container, rather then the HTML
    todoList.empty();
    //Defining a variable by selecting the Id in-progress-cards from index.html using JQuery 
    const inProgressList = $('#in-progress-cards');
    //This allows us to remove all child elements within that container from the HTML, the content within the specified Id of in-progress-cards to be empty, allowing a user to move a task card into an empty container, without coding the HTML
    inProgressList.empty();
    //Defining a variable by selecting the Id of done-cards from index.html using JQuery
    const doneList = $('#done-cards');
    //This allows us to remove all child elements within that container from the HTML, the content within the specified id of done-cards will become empty, allowing a user to move task cards into the done section which is empty using webpage interactivity
    doneList.empty();
    // taskList = [];
    //This for-loop contains if and else statements to cover each element in relation to each task within the taskList
    for (let task of taskList) {
    //This checks if the task's current status is todo, if true, then it appends a new task card to the to-do list reffering the previous function of createTaskCard
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
    //If the task card in to-do is false, then it will append a new task card into the in-progress list by reffering the previous function of createTaskCard
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
    //If both of the above statements are false, then the task card will be appended to done. This is done by reffering the createTaskCard function that we created previously
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
    //Likely bug within this section below!
    // Using JQuery UI elements to set styling and functionality in regards to dragging task cards
    $('.draggable').draggable({
      //Using CSS properties for styling, the card will appear dim when clicked and dragged, and the z-index overides position elements so that the card appears above the body
        opacity: 0.7,
        zIndex: 100,
        // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data or create a second copy of the card in LocalStorage
        helper: function (task) {
            // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(task.target).hasClass('ui-draggable')
                ? $(task.target)
                : $(task.target).closest('.ui-draggable');
            // Returning the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Creating a function to handle adding a new task to the taskList 
function handleAddTask() {
    //Defining a variable to layout the entire task card structure
    const newTask = {
      //Calling the generateTaskId function to assign each task card with a unique task ID
        id: generateTaskId(),
      //This component allows the page to copy the text value (val) for what a user inputs within the textbox for the task title
        title: $('#taskTitle').val(),
      //This component allows the page to copy the text value (val) for what a user inputs within the textbox for the task description
        description: $('#formDescription').val(),
      //This component allows the page to copy the value (val) for what a user inputs within the date picker for the task due date
        deadline: $('#taskDueDate').val(),
      //Thiscomponent sets all new task cards are to be placed in the to-do section initially, the user can move it into other list sections as they please
        status: 'to-do'
    };
    //Console logging the variable to test the functionality of the task card structure
    console.log(newTask)
    //Console logging the list element of the variable to test the functionality of the status list
    taskList.push(newTask);
    //Stores created task cards into the local storage for revisiting later
    localStorage.setItem('tasks', JSON.stringify(taskList));
    //Calling the renderTaskList function to run the components of that functoin when a task card is created
    renderTaskList();

}

//This function allows us to delete a task card from the page AND localStorage once the delete button is clicked. 
function handleDeleteTask() {
  //Defining a variable using the attribute data-taskID that was defined earlier, this identifier is useful for deleting the task
    const taskId = $(this).attr('data-taskid');

    //This for loop is for deleting a task by stating the index is not less then the original task list 
    for (let index = 0; index < taskList.length; index++) {
      //Defining a variable to define a unique task id using the index within the for loop to define it. 
        const task = taskList[index];
        //Console logging both the task.id and taskID to visually see the match
        console.log(task.id, taskId)
        //This if statement reads: if task.id is equal to taskID, then delete the specific task only
        if (task.id === taskId) {
        //Splicing/deleting the task for the 1 match of task ids. 
        taskList.splice(index, 1);
        }
    };
    //Testing by console logging the updated taskList
    console.log(taskList)
    //Updating local storage with the new taskList after th splice, this removes the task card from local storage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    //Calling the renderTaskList function to then apply ythe updated localStorage to the page. 
        renderTaskList();
}
//Bug likely in section listed below!
//This function handles the dropping of a task card into a new task list section
function handleDrop(event, ui) {
  //This preventDefault element prevents the page from refreshing when a task card is clicked and dragged, then dropped into a new section
    event.preventDefault();
    //Defining a variable by pulling data from the 'tasks attribute in localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    //Testing one of the function parameters by console logging
    // console.log(ui)
    //This refers to the element that is triggered in the event, then the Id element is retreived using JQuery
    const laneId = $(this).attr("id")
    //Console logging laneID to test if it pulled the ID attribute
    // console.log(laneId)
    //Defining a variable to store the value of taskid attribte from the drag element 
    const taskID = ui.draggable[0].dataset.taskid
    //Console logging the variable to test if it stored the data
    // console.log(taskID)
    //This for loop updated the laneId for the task cards by their Ids. 
    for (const task of tasks) {
      //If the task card id is the same as the taskID, then it will assign the status property by updating the laneId for a task
        if (task.id === taskID) {
            task.status = laneId
        }
    }
    console.log(tasks);
    //Updates the status change of task cards into localStorage for later use
    localStorage.setItem('tasks', JSON.stringify(tasks));
    //Calling the renderTaskList function to run what is contained within it, and to update the status of individual task cards
    renderTaskList();
}


//This function will only run then the HTML page fully loads.
$(document).ready(function () {
    // Get the task element and status lane element
    //defining variables by selecting and storing elements in objects for JS execution
    const taskElement = document.getElementById('task');
    const statusLane = document.getElementById('status-lane');
  //Calling the renderTaskList function
    renderTaskList();

    // Add event listeners for drag and drop events ??
    // Make lanes droppable by selecting a class and allowing a functional drop from calling the handledrop function
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
    //allows a datepicker popup to appear when the taskDueDate box is selected as it contains that ID
    $('#taskDueDate').datepicker({
      //Allows user to change the month and year
        changeMonth: true,
        changeYear: true,
    });


    // Using JQuery to add functionality to the save-changes button ID when clicked,once the button is clicked, the handleAddTask function will run and a new task card will be created 
    $('#save-changes').on('click', handleAddTask)

});

