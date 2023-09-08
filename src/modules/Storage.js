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
    static get inbox(){
        function addTask(task){
            Storage.#inboxStorage.push(task);
        }
        return {title:"Inbox",tasks:Storage.#inboxStorage, addTask};
    };

    static get todayTasks(){
        function addTask(task){
            Storage.#todayStorage.push(task);
        }

        //adding tasks after button is clicked 
        Storage.#todayStorage = Storage.#inboxStorage.filter((task) => {
            let date = Dates.convertDate(task.date);
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });

        return {title:"Today",tasks:Storage.#todayStorage, addTask};
    };

    static get thisWeekTasks(){
        function addTask(task){
            Storage.#thisWeekStorage.push(task);
        }

        Storage.#thisWeekStorage = Storage.#inboxStorage.filter((task) => {
            let date = Dates.convertDate(task.date);
            return Dates.isThisWeek(new Date(date.year, date.month, date.day));
        });


        return {title:"This Week",tasks:Storage.#thisWeekStorage, addTask};
    };

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(key){
        return Storage.projectsStorage.find((project => project.key === key));
    }




}
