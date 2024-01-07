//import {COMMANDS, CURRENTTAKS} from "./CONSTS.js";
importScripts("./CONSTS.js")
importScripts("./quiet.js")
// Define the URL of the webpage you want to open

let currentTasks = CURRENTTAKS
let URL="";


//Monitor the change of command
chrome.storage.onChanged.addListener((changes) => {
  console.log(changes.CURRENTTAKS)
  if (changes.CURRENTTAKS) {
    currentTasks = changes.CURRENTTAKS.newValue;
    switchListeners(); // Switch listeners when a value changes
  }
});


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
  console.log("In bg:",details.url)
  URL=details.url;
  const startTime = performance.now();
      if(!isOptionPageOpen()){
          retrivePage(details.url)
      }
      const endTime = performance.now();
// Calculate the elapsed time in milliseconds
const elapsedTime = endTime - startTime;;

  if(currentTasks["NAVGATION"]===1){
    chrome.runtime.sendMessage({message:details.url})
  }

console.log(`Code execution time: ${elapsedTime} milliseconds`);
});

function navigationListnerSendMsg(){
  chrome.webNavigation.onCompleted.addListener(async(details)=>{
    console.log("In bg:",details.url)
    URL=details.url;
        if(!isOptionPageOpen()){
            retrivePage(details.url)
        }
        chrome.runtime.sendMessage({message:details.url})
 });
}
function webRequestListner(){
  
  chrome.webRequest.onBeforeRequest.addListener(async(details)=>{
    console.log("In bg request:",details.requestBody);
    if(!isOptionPageOpen()){
      retrivePage(URL)
  }
  if (details.requestBody !== undefined){
    chrome.runtime.sendMessage({message:JSON.stringify(details.requestBody).replace(/\n/g, '')})
  }
  
  },
  {
    urls: ["<all_urls>"],
  },
  ["requestBody"]);
}

function switchListeners(){
  if(currentTasks["NAVGATION"]===1){
    //navigationListnerSendMsg();
    
  }else{
    chrome.webNavigation.onCompleted.addListener((details)=>{URL=details.url;});
  }
  if(currentTasks["REQUEST"]===1){
    webRequestListner();
  }else{
    chrome.webRequest.onBeforeRequest.removeListener(()=>{
      console.log("Removed webRequest listener");
    });
  }
  //TODO others listeners
}
