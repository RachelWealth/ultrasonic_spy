function attackConmander(command){
    if(command === 'email'){
        console.log("received EMAIL attack command");
    }else if(command === 'SMS'){
        console.log("received SMS attack command");
    }else {
        console.log("received OTHER attack command");
        console.log("Extensible part");
    }

}