import Storage from "./Storage";

//menu

export default class UI {

    ////ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton"); 

        //LOAD PAGE IF BUTTON CLICKED
        inboxButton.onclick = ()=>{UI.loadPage("Inbox")};
        todayButton.onclick = ()=>{UI.loadPage("Today")};
        thisWeekButton.onclick = ()=>{UI.loadPage("This Week")};

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
        UI.loadPage("Inbox");
    }

    static loadPage(pageTitle) {

        // Set active page
        UI.activePage = pageTitle;
    
        // Clear page
        UI.clearPage();
    
        // Display title
        let temporaryContent = document.querySelector(".temporary__content--content");
        temporaryContent.innerHTML += `
        <h1 id="content__title">${pageTitle}</h1>
        <div class="tasks--wrapper"></div>
        `;
    
        // Get tasks from storage and display
        //make this simpler
        if(UI.activePage == "Inbox"){
            (Storage.inboxStorage).forEach(task => {
                //add task to UI
                UI.addTask(task);
            });
        }else if(UI.activePage == "Today"){
            (Storage.todayStorage).forEach(task => {
                //add task to UI
                UI.addTask(task);
            });
        }else if(UI.activePage == "This Week"){
            (Storage.thisWeekStorage).forEach(task => {
                //add task to UI
                UI.addTask(task);
            });
        }
    
        // Create form node if inbox
        if(UI.activePage == "Inbox") UI.addNode(".temporary__content--content", UI.createFormNode("inbox"));
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