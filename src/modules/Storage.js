export default class Storage{

    // each index contains object: {title, date, priority}
    static inboxStorage = [];
    static todayStorage = [];

    static addTask(to, newTask){
        if(to == "inbox"){
            Storage.inboxStorage.push(newTask);
            console.table(Storage.inboxStorage);
        }
    }

    todayStorage = inboxStorage.filter((task) => task.date );
    
}