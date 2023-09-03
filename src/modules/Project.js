import Storage from "./Storage";

export default class Project{

    tasks = [];
    
    constructor(name, key){
        this.name = name;
        this.key = key;
    }

    get getName(){
        return this.name;
    }

    get getKey(){
        return this.key;
    }

    get tasks(){
        return this.tasks;
    }

    //add newly constructed project to storage
    addToStorage() {
        Storage.projectsStorage.push(this);
    }

    //delete project from storage
    delete(){

        let index = Storage.projectsStorage.findIndex(project => project.key === this.getKey);
        Storage.projectsStorage.splice(index, 1);
        
    }

    
    addTask(task){
        let index = Storage.projectsStorage.findIndex(project => project.key === this.getKey);
        Storage.projectsStorage[index].tasks.push(task);
    }


}