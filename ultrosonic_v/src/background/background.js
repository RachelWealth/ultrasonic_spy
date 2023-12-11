
//importScripts("../utils/shared-utils.js")
importScripts("../utils/CONSTS.js")
//importScripts("../utils/sendPrivacy.js")
//import {simplePrepend} from '../utils/shared-utils.js';
//import  {COMMANDS,CURRENTTAKS, setCurrenTasks} from "../utils/CONSTS.js";

//import sendInformation from '../utils/send-privacy.js';
// chrome.alarms.create({ periodInMinutes: 1 });
// chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
console.log(COMMANDS.NAVGATION);
 chrome.webNavigation.onCompleted.addListener(async(details)=>{
  //   await  simplePrepend(COMMANDS.NAVGATION,{
  //       url:details.url
  //   });
  //  //await sendInformation(details.url);
  //  console.log("Recorded navigation:"+details.url);
 if(CURRENTTAKS.NAVGATION===1){
  chrome.runtime.sendMessage({message:details.url},(response)=>{
    
  });

    // chrome.extension.sendRequest({}, function(response) {
    //   // do something with response.addr...
    // });
 }
 });

//  chrome.runtime.onMessage.addListener(async(message,sender, response)=>{
//   const {messageType,data} = message;
//   switch(messageType){
//     case COMMANDS.NAVGATION:
//       setCurrenTasks(COMMANDS);
//   }
//  });


 
