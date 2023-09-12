import Events from "./modules/Event";
import UI from "./modules/UI";
import Storage from "./modules/Storage";

UI.initProjectButtons();
UI.loadHomePage();

//this is for event listeners to work
Storage.initialize();