import Dates from "./Dates";
import Events from "./Event";
import Project from "./Project";
import Task from "./Task";

export default class Storage {

    static initialize() {
        Events.eventEmitter.on("newProject", (title, key) => {

            let newProject = new Project(title, key);
            Storage.addProject(newProject);

            Events.eventEmitter.emit("newKey", key);
            console.table(Storage.projectsStorage);
        });

        //for local storage
        function populateStorage(item) {

            let tasksSerialized;

            if (localStorage.getItem(item)) {
                tasksSerialized = JSON.parse(localStorage.getItem(item));
                tasksSerialized = tasksSerialized.map(parseStringifiedTask);
            }

            return tasksSerialized;
        }

        //⚠️⚠️does not pass ._isDone
        function parseStringifiedTask(task) { return new Task(task._title, task._date, task._priority, task._isDone) };

        //initialize localStorage if empty
        if (!localStorage.getItem("inbox")) {
            localStorage.setItem("inbox", JSON.stringify(Storage.#inboxStorage))
        } else {
            Storage.#inboxStorage = populateStorage("inbox");
        };

        //if greater than 1, projects are saved in localStorage
        if (localStorage.length > 1) {
            for (let _key = 0; _key < localStorage.length; _key++) {
                //loop thru localStorage
                //get item
                //create new Project from item
                //if tasks inside new Project is undefined, skip
                //push new Project to storage
                //iterate to next item, then repeat.

                const projectName = localStorage.key(_key);
                if(projectName !== "inbox"){
                    const tasksSerialized = JSON.parse(localStorage.getItem(projectName));
                    const project = new Project(projectName, Project.generateKey());
    
                    project.tasks = (tasksSerialized.tasks)? tasksSerialized.tasks.map(parseStringifiedTask) : [];
                    
                    Storage.projectsStorage.push(project);
                }
                
                // console.table("Storage projects: "+project.tasks);
            }
        }




    }

    // each index contains object: {title, date, priority}
    static #inboxStorage = [];
    static #todayStorage = [];
    static #thisWeekStorage = [];

    // each index contains a Project object: {name, key, tasks}
    //tasks is an array that contains object: {title, date, priority}
    static projectsStorage = [];

    static addTaskToStorage(task, storage) {
        storage.push(task);

        // localStorage.setItem(name, JSON.stringify(storage));
    }

    //function key counter
    //⚠️⚠️ FUNCTION USELESS
    /*usage example: 
        inboxKeyCounter = Storage.keyCounter();
        inboxKeyCounter.newKey()
    */
    static keyCounter = () => {

        let _keyCounter = 0;
        let newKey = () => { return _keyCounter++ }
        return {
            newKey,
        }
    }

    static inboxKeyCounter = Storage.keyCounter();

    static get inbox() {

        return {
            title: "Inbox",
            tasks: Storage.#inboxStorage,
            taskKeyCounter: 0,
            addTask: (task) => {
                task.key = Storage.inboxKeyCounter.newKey();
                Storage.addTaskToStorage(task, Storage.#inboxStorage, "inbox")
            },

        };
    }

    static get todayTasks() {
        // Filter inbox tasks based on whether they are for today
        //⚠️⚠️ Clean code
        Storage.#todayStorage = Storage.#inboxStorage.filter((task) => {
            const date = Dates.convertDate(task.date);
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });

        Storage.projectsStorage.forEach(project => {
            let tasksToday = project.tasks.filter((task) => {
                const date = Dates.convertDate(task.date);
                return Dates.isToday(new Date(date.year, date.month, date.day));
            });

            tasksToday.forEach(task => {
                Storage.#todayStorage.push(task);
            });
        });

        // ⚠️⚠️ Clean code ends here

        return {
            title: "Today",
            tasks: Storage.#todayStorage,
            addTask: (task) => Storage.addTaskToStorage(task, Storage.#todayStorage)
        };
    }

    static get thisWeekTasks() {
        // Filter inbox tasks based on whether they are for this week
        Storage.#thisWeekStorage = Storage.#inboxStorage.filter((task) => {
            const date = Dates.convertDate(task.date);
            return Dates.isThisWeek(new Date(date.year, date.month, date.day));
        });

        Storage.projectsStorage.forEach(project => {
            let tasksThisWeek = project.tasks.filter((task) => {
                const date = Dates.convertDate(task.date);
                return Dates.isThisWeek(new Date(date.year, date.month, date.day));
            });

            tasksThisWeek.forEach(task => {
                Storage.#thisWeekStorage.push(task);
            });
        });

        return {
            title: "This Week",
            tasks: Storage.#thisWeekStorage,
            addTask: (task) => Storage.addTaskToStorage(task, Storage.#thisWeekStorage)
        };
    }

    static get projects() {
        return Storage.projectsStorage;
    }

    static addProject(newProject) {
        Storage.projectsStorage.push(newProject);

        if (!localStorage.getItem(newProject.title)) localStorage.setItem(newProject.title, JSON.stringify(newProject.tasks));
    }

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(title) {
        return Storage.projectsStorage.find((project => project.title === title));
    }




}
