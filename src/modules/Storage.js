import Dates from "./Dates";

export default class Storage {

    // each index contains object: {title, date, priority}
    static inboxStorage = [];
    static todayStorage = [];

    static addTask(to, newTask) {
        if (to == "inbox") {
            Storage.inboxStorage.push(newTask);
            console.table(Storage.inboxStorage);
        }

        //Warning: function not following single-responsibility principle
        //because it performs filtering of today's tasks

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
        //⚠️⚠️ Clean code
        Storage.#todayStorage = Storage.#inboxStorage.filter((task) => {
            const date = Dates.convertDate(task.date);
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });

        Storage.projectsStorage.forEach(project => {
            let tasksToday = project.tasks.filter((task)=>{
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
            let tasksThisWeek = project.tasks.filter((task)=>{
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
    }

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(key) {
        return Storage.projectsStorage.find((project => project.key === key));
    }


}
