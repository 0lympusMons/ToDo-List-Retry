import Dates from "./Dates";
import Events from "./Event";
import Project from "./Project";

export default class Storage {

    static initialize() {
        Events.eventEmitter.on("newProject", (title, key) => {

            let newProject = new Project(title, key);
            Storage.addProject(newProject);

            Events.eventEmitter.emit("newKey", key);
            console.table(Storage.projectsStorage);
        });
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
                Storage.addTaskToStorage(task, Storage.#inboxStorage)
            },

        };
    }

    static get todayTasks() {
        // Filter inbox tasks based on whether they are for today
        Storage.#todayStorage = Storage.#inboxStorage.filter((task) => {
            const date = Dates.convertDate(task.date);
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });

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
    }

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(key) {
        return Storage.projectsStorage.find((project => project.key === key));
    }




}
