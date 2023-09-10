import Storage from "./Storage";

export default class Project{

    tasks = [];
    
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

    set key(_key){
        // if key not taken, set key
        // else generate another key
    }

    //💡idea: cache index
    //if a project gets removed from storage, re-cache index
    get storageIndex(){
        return Storage.projectsStorage.findIndex(project => project.key === this.key);
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
        
        // delete from storage
        let index = Storage.projectsStorage.findIndex(project => project.key === this.key);
        Storage.projectsStorage.splice(index, 1);
        
        // delete in UI
    }

    
    addTask(task){
        let index = Storage.projectsStorage.findIndex(project => project.key === this.key);
        Storage.projectsStorage[index].tasks.push(task);
    }


}