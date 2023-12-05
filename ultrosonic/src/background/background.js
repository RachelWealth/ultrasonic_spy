//import {INavigationLogEntry} from "../interfaces";
//import {COMMANDS} from "../ultrasonic/CONSTS";
 //import {simplePrepend} from "../utils/shared-utils";

importScripts("../ultrasonic/CONSTS.js")
importScripts("../utils/shared-utils.js")
//COMMANDS = require("../ultrasonic/CONSTS");
//script.src = chrome.runtime.getURL("../ultrasonic/CONSTS");

console.log(COMMANDS.NAVGATION);
chrome.alarms.create({ periodInMinutes: 1 });
chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
//
 chrome.webNavigation.onCompleted.addListener(async(details)=>{
    await  simplePrepend(COMMANDS.NAVGATION,{
        url:details.url
    });
   console.log("Recorded navigation:"+details.url);
 });
