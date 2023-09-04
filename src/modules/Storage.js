import Dates from "./Dates";

export default class Storage {

    // each index contains object: {title, date, priority}
    static inboxStorage = [];
    static todayStorage = [];
    static thisWeekStorage = [];

    // each index contains a Project object: {name, key, tasks}
    //tasks is an array that contains object: {title, date, priority}
    static projectsStorage = [];

    static addTask(to, newTask) {
        if (to == "inbox") {
            Storage.inboxStorage.push(newTask);
        }

        //Warning: function not following single-responsibility principle
        //because it performs filtering of today's tasks

        // Date.isToday(2023, 07, 29) or Date.isToday(year, month, day)
        //If task date is today, then add it to todayStorage
        Storage.todayStorage = Storage.inboxStorage.filter((task) => {
            let date = Dates.convertDate(task.date);
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });



        //saves to thisWeekStorage
        Storage.thisWeekStorage = Storage.inboxStorage.filter((task) => {
            let date = Dates.convertDate(task.date);
            return Dates.isThisWeek(new Date(date.year, date.month, date.day));
        });

    }

    //gets project inside Storage.projectsStorage
    //Parameter: key
    //example: getProject(1), gets project with key 1
    static getProject(key){
        return Storage.projectsStorage.find((project => project.key === key));
    }


}
