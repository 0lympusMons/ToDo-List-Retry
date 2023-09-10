import Storage from "./Storage";

//menu

export default class UI {

    ////ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton");

        //LOAD PAGE IF BUTTON CLICKED

        inboxButton.onclick = () => { UI.loadPage(Storage.inbox) };

        todayButton.onclick = () => { UI.loadPage(Storage.todayTasks) };
        thisWeekButton.onclick = () => { UI.loadPage(Storage.thisWeekTasks) };

    }

    ////ADDERS

    //ADDS NODE TO SPECIFIC TARGET
    // must add "." if class or "#" if ID

    //addTask(fetchFormData())
    //addTask({title, date, priority})
    static addTask({ title, date, priority }) { 

        //create task node
        let taskNode = document.createElement("div");
        taskNode.innerHTML = `
            <div class="task">
            <div class="task--1">
                <input type="checkbox" name="doneTask" id="doneTask">
                <h3 class="task-title">${title}</h3>
                <input type="date" name="date" id="date" value="${date}">
                <h3 class="due-date"></h3>
        
                <select name="priority" id="priority">
                <option ${(priority == "Unset") ? "selected" : ""} value="none" disabled>Priority</option>
                <option ${(priority == "Important") ? "selected" : ""} value="Important">Important</option>
                <option ${(priority == "Not Important") ? "selected" : ""} value="Not Important">Not Important</option>
                </select>
        
            </div>
        
        
            </div>
        `;

        //add task node
        UI.addNode(".tasks--wrapper", taskNode)
    }

    static addNode(target, node) {

        document.querySelector(target).appendChild(node);

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

        const {title, tasks} = storage;
        // Set active page
        // ⛔won't work
        //😓consequences: adding task wont refresh page, etc
        UI.activePage = storage;

        console.log("Active page: "+ UI.activePage);
        console.log("Active page type: "+UI.activePage.type);
        // Clear page
        UI.clearPage();

        // Display title
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
         <h1 id="content__title">${title}</h1>
         <div class="tasks--wrapper"></div>
         `;


        //display project tasks

        console.log(tasks);
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
            reference.addTask(formData);
            // Storage.addTask(storage, formData);

            //  >refresh task list

            UI.refreshPage();
        });

        return form;
    }

}