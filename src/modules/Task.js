export default class Task {

    constructor(title, date, priority) {
        this._title = title;
        this._date = date;
        this._priority = priority;
    }

    get title() {
        return this._title;
    }

    get date() {
        return this._date;
    }

    set date(date){
        this._date = date;
    }

    get priority() {
        return this._priority;
    }

    set priority(priority){
        this._priority = priority;
    }

    get key() {
        return this._key;
    }

    set key(key) {
        this._key = key;
    }

    get isDone() {
        return this._isDone;
    }

    
    toggleIsDone() {
        if (this._isDone == true) {
            this._isDone = false
        } else {
            this._isDone = true;
        }

    }

} 