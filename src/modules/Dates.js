import { isToday as _isToday, isThisWeek as _isThisWeek } from 'date-fns';

export default class Dates {

    ////TODAY
    static isToday(date) {
        return _isToday(date);
    }

    ////THIS WEEK
    static isThisWeek(date) {
        return _isThisWeek(date);
    }


    ////CONVERTER

    //convert string date to int
    //example
    static convertDate(stringDate) {

        let dateArr = stringDate.split('-');
        let year = parseInt(dateArr[0]);
        let month = dateArr[1] - 1;
        let day = parseInt(dateArr[2]);

        return { year, month, day };
    }
};

