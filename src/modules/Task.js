export default class Task{

    constructor(title, date, priority){
        this.#_title = title;
        this.#_date = date;
        this.#_priority = priority;
    }

    get title(){
        return this.#_title;
    }

    get date(){
        return this.#_date;
    }

    get priority(){
        return this.#_priority;
    }

} 