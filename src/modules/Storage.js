export default class Storage{
    static inboxStorage = [];
    
    static saveInbox(){

    }

    static addTask(to, newTask){
        if(to == "inbox"){
            Storage.inboxStorage.push(newTask);
            console.table(Storage.inboxStorage);
        }
    }
    
}