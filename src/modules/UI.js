import Storage from "./Storage";

//menu

export default class UI {

    ////ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton");

        //LOAD PAGE IF BUTTON CLICKED
        inboxButton.onclick = UI.loadInboxPage;
        todayButton.onclick = UI.loadTodayPage;
        thisWeekButton.onclick = UI.loadThisWeekPage;

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
    //Request: emit signal when new fethFormData request is sent, it means new task has been submitted
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
        if (UI.activePage == "inbox") {
            UI.loadInboxPage();
        }
    }

    //loads user-preferred homepage
    static loadHomePage() {
        UI.loadInboxPage();
    }

    static loadInboxPage() {

        //set active page to inbox
        UI.activePage = "inbox";

        //first, clear page
        UI.clearPage();

        //display title: Inbox
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
        <h1 id="content__title">Inbox</h1>
        <div class="tasks--wrapper"></div>
        `;


        //get from storage
        //i display tanan tasks sa storage

        (Storage.inboxStorage).forEach(task => {
            //add task to UI
            UI.addTask(task);
        });

        //createFormNode
        UI.addNode(".temporary__content--content", UI.createFormNode("inbox"));
    }

    static loadTodayPage() {

        //set active page to inbox
        UI.activePage = "Today";

        //first, clear page
        UI.clearPage();

        //display title: Inbox
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
        <h1 id="content__title">Today</h1>
        <div class="tasks--wrapper"></div>
        `;


        //get from storage
        //i display tanan tasks sa storage
    
        (Storage.todayStorage).forEach(task => {
            //add task to UI
            UI.addTask(task);
        });

        //createFormNode
        // UI.addNode(".temporary__content--content", UI.createFormNode("inbox"));

    }

    static loadThisWeekPage() {

        //set active page to inbox
        UI.activePage = "This Week";

        //first, clear page
        UI.clearPage();

        //display title: Inbox
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
        <h1 id="content__title">Today</h1>
        <div class="tasks--wrapper"></div>
        `;


        //get from storage
        //i display tanan tasks sa storage
    
        (Storage.thisWeekStorage).forEach(task => {
            //add task to UI
            UI.addTask(task);
        });

        //createFormNode
        // UI.addNode(".temporary__content--content", UI.createFormNode("inbox"));

    }




    ////CREATING NODES
    // needs addNode()

    static createTask() {

    }

    static createFormNode(storage) {
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
            Storage.addTask(storage, formData);

            //  >refresh task list
            // issue: mobalik sa inbox page
            UI.refreshPage();
            //or event emitter
            //emit nalang diri, tas pass data 
            //eventlisteners will get that data
        });

        return form;
    }

}