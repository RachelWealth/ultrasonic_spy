//import {COMMANDS} from "../ultrasonic/CONSTS";
async function sendMessage(command) {
    return chrome.runtime.sendMessage({
        //messageType,
        message:command,
    });
}
console.log("Import page-utils: succeed");