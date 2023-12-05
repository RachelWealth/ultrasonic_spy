//import {updateNavigation} from '../compoments/Navigation'
importScripts("../compoments/Navigation.js")
 async function simpleGet(
    // Get the new value from Chrome storage
    key,
    defaultValue
){
    const result = await chrome.storage.local.get([key]);
    console.log("result of simpleGet is:",result)
    return result[key]||defaultValue;
}
async function simpleSet(key,value,callback){
    // Set new log
    await chrome.storage.log.set({
        [key]:value,
    })
    // TODO I am not sure, I want to replace "useEffect"
    callback(key,value);
}
async function simplePrepend(
    key,
    value,
){
    const current = await simpleGet(key,[]);
    console.log("Start the SimplePrepend\n\tGet key:\n\t"+key+"value:\n\t"+value);
    //await simpleSet(key,[value,...current].slice(0,maxLength),watch);
    await simpleSet(key,current,watch);

}

function contextData(){
    console.log("to save the space, ignore this function");
}

 async function watch(key,callback){
    chrome.storage.onChanged.addListener((change)=>{
        for(let [k,v] of Object.entries(changes)){
            if(k===key){
                callback(v);
                updateNavigation(v);
            }
        }
    });
    callback({newValue:await simpleGet((key))});
}
console.log("Import shared-utlis.js succeed")