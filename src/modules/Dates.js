import { isToday as _isToday, isThisWeek as _isThisWeek } from 'date-fns';

export default class Dates {

    static isToday(date) {
        return _isToday(date);
    }

    static isThisWeek(date){
        return _isThisWeek(date);
    }
};

