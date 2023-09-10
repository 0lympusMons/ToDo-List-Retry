import Dates from "./Dates";

export default class Storage {

    // each index contains object: {title, date, priority}
    static #inboxStorage = [];
    static #todayStorage = [];
    static #thisWeekStorage = [];

    // each index contains a Project object: {name, key, tasks}
    //tasks is an array that contains object: {title, date, priority}
    static projectsStorage = [];

    //⚠️code repeating
    //continue here 👇
    static addTaskToStorage(task, storage) {
        storage.push(task);
    }

    static get inbox() {
        return {
            title: "Inbox",
            tasks: Storage.#inboxStorage,
            addTask: (task) => Storage.addTaskToStorage(task, Storage.#inboxStorage)
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

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(key) {
        return Storage.projectsStorage.find((project => project.key === key));
    }




}
