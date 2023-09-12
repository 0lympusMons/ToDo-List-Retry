import Events from "./Event";
import Storage from "./Storage";
import Project from "./Project";
import Task from "./Task";
//menu

export default class UI {

    ////ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton");
        let addProjectField = document.querySelector("#addProjectField")

        //LOAD PAGE IF BUTTON CLICKED

        inboxButton.onclick = () => { UI.loadPage(Storage.inbox) };
        todayButton.onclick = () => { UI.loadPage(Storage.todayTasks) };
        thisWeekButton.onclick = () => { UI.loadPage(Storage.thisWeekTasks) };

        // ADD PROJECT TO LIST
        addProjectField.addEventListener("keyup", (e => {
            if (e.key === "Enter") {
                UI.addNewProject(addProjectField.value);
                addProjectField.value = "";
            }
        }));

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
        taskNode.innerHTML = `
            <div class="task">

            </div>
        `;

        let taskNodeForm = document.createElement("form");
        taskNodeForm.setAttribute("data-key", task.key);
        taskNodeForm.innerHTML = `
            <input type="checkbox" name="doneTask" id="doneTask" ${(task.isDone)? "checked" : ""}>
            <h3 class="task-title">${task.title}</h3>
            <input type="date" name="date" id="date" value="${task.date}">
            <h3 class="due-date"></h3>
    
            <select name="priority" id="priority">
            <option ${(task.priority == "Unset") ? "selected" : ""} value="none" disabled>Priority</option>
            <option ${(task.priority == "Important") ? "selected" : ""} value="Important">Important</option>
            <option ${(task.priority == "Not Important") ? "selected" : ""} value="Not Important">Not Important</option>
            </select>
        `;

        taskNodeForm.addEventListener('change', (event) => {
            const changedElement = event.target;

            if(changedElement.name == "doneTask"){
                task.toggleIsDone();
                changedElement.checked = task.isDone;
            }else if(changedElement.name == "date"){
                task.date = changedElement.value;
            }else if(changedElement.name == "priority"){
                task.priority = changedElement.value;
            }

            console.log(`Element with name "${changedElement.name}" has changed to "${changedElement.value}"`);
        });

        taskNode.appendChild(taskNodeForm);

        //add task node
        UI.addNode(".tasks--wrapper", taskNode)
    }

    static addNode(target, node) {

        document.querySelector(target).appendChild(node);

    }

    static addNewProject(title) {

        let key = Project.generateKey();

        let projectButton = document.createElement("li");
        projectButton.innerHTML = `<button class="project__button" data-key="${key}">${title}</button>`;

        //if title is not an empty string, add node to UI
        if (title.trim() !== "") UI.addNode("#projects--list", projectButton);

        //add event listener
        projectButton.addEventListener("click", () => UI.loadPage(Storage.getProject(key)));

        Events.eventEmitter.emit("newProject", title, key);
    }

    ////FETHCERS

    //use for adding task in UI, and in Storage
    static fetchFormData(e) {

        let title = e.target.taskTitle.value;
        let date = e.target.taskDate.value;
        let priority = e.target.taskPriority.value;

        return {title, date, priority}; 

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
        UI.loadPage(UI.activePage);
    }

    //loads user-preferred homepage
    //WIP
    static loadHomePage() {
        UI.loadPage(Storage.inbox);
    }

    // loadPage(storageReference)
    //example: UI.loadPage(Storage.inbox)
    //UI.loadPage({title, tasks})
    static loadPage(storage) {

        const { title, tasks } = storage;
        // Set active page
        // ⛔won't work
        //😓consequences: adding task wont refresh page, etc
        UI.activePage = storage;

        console.log("Active page: " + UI.activePage);
        console.log("Active page type: " + UI.activePage.type);
        // Clear page
        UI.clearPage();

        // Display title
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
         <h1 id="content__title">${title}</h1>
         <div class="tasks--wrapper"></div>
         `;


        //display project tasks

        console.table(tasks);
        tasks.forEach(task => {
            //add task to UI
            UI.addTask(task);
        });


        // Create form node if inbox
        if (UI.activePage.title == Storage.inbox.title || UI.activePage.type == "Project") UI.addNode(".temporary__content--content", UI.createFormNode(storage));
    }


    ////CREATING NODES
    // needs addNode()

    //createFormNode(storageReference)
    //example: createFormNode(Storage.inboxStorage)
    static createFormNode(reference) {
        let form = document.createElement("form");
        form.setAttribute("id", "form");
        form.setAttribute("action", "");
        form.innerHTML = `

            <input required type="text" name="taskTitle" id="task-title">
            <input type="date" name="date" id="taskDate">
            <select name="priority" id="taskPriority">
                <option value="Unset" disabled selected>Priority</option>
                <option value="Important">Important</option>
                <option value="Not Important">Not Important</option>
            </select>

            <button type="submit" id="addTask">Add a task</button>

        `;

        //form submit event listener
        //on submit: fetch form data > append new task to UI > push new task to storage
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            //  >fetch form data
            let formData = UI.fetchFormData(e);

            //  >push new task to storage
            // storage example: "inbox"
            reference.addTask(new Task(formData.title, formData.date, formData.priority));
            // Storage.addTask(storage, formData);

            //  >refresh task list

            UI.refreshPage();
        });

        return form;
    }

}