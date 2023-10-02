import Storage from "./Storage";

export default class Project{

    tasks = [];

    //⚠️⚠️ FUNCTION USELESS
    tasksKeyCounter = Storage.keyCounter();
    
    constructor(title, key){
        this._title = title;
        this._key = key;
    }

    get title(){
        return this._title;
    }

    set title(title){
        this._title = title;
    }

    get key(){
        return this._key;
    }

    get type(){
        return "Project";
    }

    static #$key = 0;

    static generateKey(){
        return Project.#$key++;
    };

    //💡idea: cache index
    //if a project gets removed from storage, re-cache index
    get storageIndex(){
        return Storage.projectsStorage.findIndex(project => project.key === this.key);
    }

    get tasks(){
        return this.tasks;
    }

    set tasks(_tasks){
        _tasks.array.forEach(task => {
            this.addTask(task);
        });
    }

    //add newly constructed project to storage
    addToStorage() {
        Storage.projectsStorage.push(this);
        localStorage.setItem(this.title, JSON.stringify(this));
    }

    //delete project from storage
    delete(){
        
        // delete from storage
        let index = Storage.projectsStorage.findIndex(project => project.key === this.key);
        Storage.projectsStorage.splice(index, 1);

        //delete in local storage
        localStorage.removeItem(this.title);
        
        // delete in UI
    }

    
    addTask(task){
        task.key = this.tasksKeyCounter.newKey();
        console.table("Project task: "+task);
        let index = Storage.projectsStorage.findIndex(project => project.key === this.key);
        Storage.projectsStorage[index].tasks.push(task);
    }


}