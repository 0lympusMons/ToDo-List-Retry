import Events from "./Event";
import Storage from "./Storage";
import Project from "./Project";
import Task from "./Task";
//menu

export default class UI {

    ////ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {

        //⚠️⚠️ initialize all buttons including project buttons
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton");
        let addProjectField = document.querySelector("#addProjectField");

        //LOAD PAGE IF BUTTON CLICKED
        //add active class to button when clicked, delete buttons that have this class
        inboxButton.onclick = () => {
            UI.setButtonActive(inboxButton);
            UI.loadPage(Storage.inbox);
        };
        todayButton.onclick = () => {
            UI.setButtonActive(todayButton);
            UI.loadPage(Storage.todayTasks)
        };
        thisWeekButton.onclick = () => {
            UI.setButtonActive(thisWeekButton);
            UI.loadPage(Storage.thisWeekTasks)
        };

        // ADD PROJECT TO LIST
        addProjectField.addEventListener("keyup", (e => {
            if (e.key === "Enter") {
                UI.addNewProject(addProjectField.value);
                addProjectField.value = "";
            }
        }));
    }

    //Misc Functions
    //for button

    //adds class="active" to button 
    static setButtonActive(button) {
        let allButtons = document.querySelectorAll("button");

        allButtons.forEach(button => {
            button.classList.remove("active");
        });

        button.classList.add("active");
    }

    ////ADDERS

    //ADDS NODE TO SPECIFIC TARGET
    // must add "." if class or "#" if ID

    //addTask(fetchFormData())
    //addTask({title, date, priority})
    static addTask(task) {

        //⚠️⚠️CLEAN THIS SHIT 
        //create task node
        let taskNode = document.createElement("div");
        taskNode.classList.add("task");

        let taskNodeForm = document.createElement("form");
        taskNodeForm.classList.add("task-form");
        taskNodeForm.setAttribute("data-key", task.key);
        taskNodeForm.innerHTML = `

            <div class="left-panel">
                <input type="checkbox" name="doneTask" id="doneTask" ${(task.isDone) ? "checked" : ""}>
                <h3 class="task-title">${task.title}</h3>
            </div>

            <div class="right-panel">
                <input type="date" name="date" id="date" value="${task.date}">
                
                <select name="priority" id="priority">
                <option ${(task.priority == "Unset") ? "selected" : ""} value="none" disabled>Priority</option>
                <option ${(task.priority == "Important") ? "selected" : ""} value="Important">Important</option>
                <option ${(task.priority == "Not Important") ? "selected" : ""} value="Not Important">Not Important</option>
                </select>
            </div>
    

        `;

        taskNodeForm.onchange = (event) => {
            const changedElement = event.target;

            if (changedElement.name == "doneTask") {
                task.toggleIsDone();
                changedElement.checked = task.isDone;
            } else if (changedElement.name == "date") {
                task.date = changedElement.value;
            } else if (changedElement.name == "priority") {
                task.priority = changedElement.value;
            }

            UI.refreshPage();
            console.log(`Element with name "${changedElement.name}" has changed to "${changedElement.value}"`);
        };

        taskNode.appendChild(taskNodeForm);

        //add task node
        UI.addNode(".tasks--wrapper", taskNode)
    }

    static addNode(target, node) {

        document.querySelector(target).appendChild(node);

    }

    static addNewProject(title) {

        //⚠️i used key to find it in storage
        // ⚠️not used. used title to search for project instead
        let key = Project.generateKey();

        //creating a delete button for projects

        let projectButton = document.createElement("li");
        projectButton.innerHTML = `
                                <button class="project__button" data-key="${key}">
                                
                                    <div class="left-panel"><i class="fa-solid fa-clipboard-list"></i>${title}</div>
                                    <i class="right-panel fa-solid fa-xmark delete-button"></i>
                                </button>`;


        //if title is not an empty string, add node to UI
        if (title.trim() !== "") UI.addNode("#projects--list", projectButton);

        Events.eventEmitter.emit("newProject", title, key);

        //add event listener
        projectButton.addEventListener("click", (event) => {

            UI.setButtonActive(projectButton.childNodes[1]);

            if (event.target.classList.contains("delete-button")) {
                UI.deleteProject(event);
                localStorage.removeItem(title);
            } else {
                UI.loadPage(Storage.getProject(title))
            }
        });

    }

    ////DELETERS

    static deleteProject(event) {
        let projectButton = event.target.parentNode.parentNode;

        projectButton.remove();

    }

    ////FETHCERS

    //use for adding task in UI, and in Storage
    static fetchFormData(e) {

        let title = e.target.taskTitle.value;
        let date = e.target.taskDate.value;
        let priority = e.target.taskPriority.value;

        return { title, date, priority };

        //returns object, usage: let formData = fetchFormData();
    }

    ////CLEAR PAGE
    static clearPage() {
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML = "";
    };

    ////LOADERS

    //saves the current active page
    //used in refreshPage()
    static activePage;

    static refreshPage() {

        //update local storage
        //⚠️⚠️⚠️ not a single responsibility function
        if (UI.activePage.title == "Inbox") {
            localStorage.setItem("inbox", JSON.stringify(UI.activePage.tasks))
        } else if (UI.activePage.type == "Project") {
            //⚠️⚠️⚠️ localStorage.setItem("projects", JSON.stringify(UI.activePage));
            localStorage.setItem(UI.activePage.title, JSON.stringify(UI.activePage));
        };

        UI.loadPage(UI.activePage);
    }

    //loads user-preferred homepage
    //WIP
    static loadHomePage() {
        UI.loadPage(Storage.inbox);
        UI.initProjectButtons();
        UI.loadProjects();
    }

    static loadProjects() {
        Storage.projectsStorage.forEach((project) => {
            UI.addNewProject(project.title);
        })
    }

    // loadPage(storageReference)
    //example: UI.loadPage(Storage.inbox)
    //UI.loadPage({title, tasks})
    static loadPage(storage) {

        const { title, tasks } = storage;
        // Set active page
        UI.activePage = storage;

        // console.log("Active page: " + UI.activePage);
        // console.log("Active page type: " + UI.activePage.type);

        // Clear page
        UI.clearPage();

        // Display title
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
         <h1 id="content__title">${title}</h1>
         <div class="tasks--wrapper"></div>
         `;


        //display project tasks

        // console.table(tasks);

        if (tasks !== undefined) {
            tasks.forEach(task => {
                //add task to UI
                if (task._isDone != true) UI.addTask(task);

            });
        }

        // Create form node if inbox
        if (UI.activePage.title == Storage.inbox.title || UI.activePage.type == "Project") UI.addNode(".temporary__content--content", UI.createFormNode(storage));


    }


    ////CREATING NODES
    // needs addNode()

    //createFormNode(storageReference)
    //example: createFormNode(Storage.inboxStorage)
    static createFormNode(reference) {
        let form = document.createElement("form");
        form.setAttribute("id", "addTaskForm");
        form.setAttribute("action", "");
        form.innerHTML = `

            <div class="row-container">
                <div class="left-panel">
                <input required type="text" name="taskTitle" id="task-title">
                </div>

                <div class="right-panel">
                    <input type="date" name="date" id="taskDate">
                    <select name="priority" id="taskPriority">
                        <option value="Unset" disabled selected>Priority</option>
                        <option value="Important">Important</option>
                        <option value="Not Important">Not Important</option>
                    </select>
                </div>
            </div>

            <div class="row-container submit">
                <button type="submit" id="addTask">Add a task</button>
            </div>
        `;

        //form submit event listener
        //on submit: fetch form data > append new task to UI > push new task to storage

        form.onsubmit = (e) => {
            e.preventDefault();

            //  >fetch form data
            let formData = UI.fetchFormData(e);

            //  >push new task to storage
            // storage example: "inbox"
            reference.addTask(new Task(formData.title, formData.date, formData.priority));
            // Storage.addTask(storage, formData);

            //  >refresh task list

            UI.refreshPage();
        }

        return form;
    }

}