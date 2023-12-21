
//importScripts("../utils/shared-utils.js")
importScripts("../utils/CONSTS.js")
importScripts("/utils/quiet.js")




console.log(COMMANDS.NAVGATION);
 chrome.webNavigation.onCompleted.addListener(async(details)=>{
 if(CURRENTTAKS.NAVGATION===1){
  chrome.runtime.sendMessage({message:details.url},(response)=>{
  });
 }
 });

//  });


 
