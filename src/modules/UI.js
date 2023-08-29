//menu

export default class UI {

    // ADDING EVENT LISTENERS TO PROJECTS

    static initProjectButtons() {
        let inboxButton = document.querySelector("#inboxButton");
        let todayButton = document.querySelector("#todayButton");
        let thisWeekButton = document.querySelector("#thisWeekButton");

        inboxButton.onclick = UI.loadInboxPage;
        todayButton.onclick = UI.loadTodayPage;
        thisWeekButton.onclick = UI.loadThisWeekPage;

    }

    static loadInboxPage() {
        
    }

    static loadTodayPage() {

    }

    static loadThisWeekPage() {
        
    }
}