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

        // Date.isToday(2023, 07, 29) or Date.isToday(year, month, day)
        //If task date is today, then add it to todayStorage
        Storage.todayStorage = Storage.inboxStorage.filter((task) => {
            let date = Dates.convertDate(task.date);
            
            return Dates.isToday(new Date(date.year, date.month, date.day));
        });
        console.log("___________________________");
        console.table(Storage.todayStorage);
    }


}
