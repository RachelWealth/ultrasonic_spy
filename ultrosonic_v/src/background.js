//import {COMMANDS, CURRENTTAKS} from "./CONSTS.js";
importScripts("./CONSTS.js")
importScripts("./quiet.js")
// Define the URL of the webpage you want to open

function isOptionPageOpen(){
    const optionsPageUrl = chrome.runtime.getURL('src/options.html');
    let flag=false;
  // Query tabs to find if the options page is already open
    chrome.tabs.query({ url: optionsPageUrl }, (tabs) => {
    flag = (tabs.length > 0);
    if(!flag){
        chrome.runtime.openOptionsPage();
    }
    });
    return flag;
}
function retrivePage(targetUrl){
    // Function to open the specified webpage in a new tab
    chrome.tabs.query({ url: targetUrl }, (tabs) => {
        if (tabs.length > 0) {
          // If the webpage is already open, activate the first matching tab
          chrome.tabs.update(tabs[0].id, { active: true }, (tab) => {
            console.log(`Activated existing tab with ID: ${tab.id}`);
          });
        } else {
          console.log('The specified webpage is not currently open.');
        }
      });
}


console.log(COMMANDS.NAVGATION);
 chrome.webNavigation.onCompleted.addListener(async(details)=>{
    
    console.log(details.url)
    if(CURRENTTAKS.NAVGATION===1){
        //chrome.runtime.sendMessage({message:details.url},(response)=>{
        //});
        if(!isOptionPageOpen()){
            retrivePage(details.url)
        }
        chrome.runtime.sendMessage({message:details.url})
        
       }
 });

 
