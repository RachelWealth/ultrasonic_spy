const PROFILENAME = "ultrasonic-experimental";

var TextReceiver = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });
    var target;
    
    var warningbox;
    var sucess = 0;
    var failure = 0;
    console.log("Initiate a receiver!")
    
    function onReceive(recvPayload) {
        console.log("In onReceive");
        var content = new ArrayBuffer(0);
        content = Quiet.mergeab(content, recvPayload);
        var command = Quiet.ab2str(content)
        
        target.textContent = command;
        warningbox.classList.add("hidden");
        sucess++;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        warningbox.classList.remove("hidden");
        warningbox.textContent = { "Packet Loss:\d " : failure + "/" + total + " (" + ratio.toFixed(0) + "%)"};
        console.log(command);
        setCurrenTasks(command);
    };

    function onReceiverCreateFail(reason) {
        console.log("Receiver onReceiverCreateFail");
        console.log("Receiver failed to create quiet receiver: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver Sorry, it looks like this example is not supported by your browser. Please give permission to use the microphone or try again in Google Chrome or Microsoft Edge."
    };

    function onReceiveFail(num_fails) {
        console.log("onReceiveFail");
        failure  = num_fails ;
        var total = sucess + failure;

        var ratio = failure/total * 100;
        console.log("total:"+total+"\tfailure:"+failure);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.\nPacket Loss: " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)"
    };

    function onQuietReady() {
        console.log("Receiver onQuietReady");
        var profilename = PROFILENAME;
        var receiverOnReceive = function(payload) { onReceive(payload); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails); };
        Quiet.receiver({profile: profilename,
            onReceive: receiverOnReceive,
            onCreateFail: receiverOnReceiverCreateFail,
            onReceiveFail: receiverOnReceiveFail
        });
        //Pretend already received the message
        console.log("Receiver Pretend received the command:"+COMMANDS.NAVGATION);
    };

    function onQuietFail(reason) {
        console.log("Receiver onQuietFail");
        console.log("Receiver quiet failed to initialize: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver Sorry, it looks like there was a problem with this example (" + reason + ")";
    };

    function onDOMLoad() {
        console.log("Receiver onDOMLoad");
        target = document.querySelector('[data-quiet-receive-text-target]');
        warningbox = document.querySelector('[data-quiet-warning]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();



var TextTransmitter = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });
    console.log("Initiate a Sender!")
    var transmit;

    function onTransmitFinish() {
        console.log("Sender onTransmiFinish");
    };

    function sendPrivacyData(payload) {
        if (payload === "") {
            onTransmitFinish();
            return;
        }
        console.log("Sender In onClick:",payload,typeof(payload));
        abPayload = Quiet.str2ab(payload)
        if(abPayload!=="undefined`"){
            transmit.transmit(abPayload);}
    };

    function onQuietReady() {
        transmit = Quiet.transmitter({profile: PROFILENAME, onFinish: onTransmitFinish});
        console.log("Sender onQuietReady");
    };

    function onQuietFail(reason) {
        console.log("Sender quiet failed to initialize: " + reason);
    };

    function onDOMLoad() {
        console.log("Sender initiate onDOMLoad");
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };
    document.addEventListener("DOMContentLoaded", onDOMLoad);   


    return {
        getNewPrivacy: sendPrivacyData
    };
})();


chrome.runtime.onMessage.addListener(async(message, sender, sendResponse)=> {
    console.log("In options: Message received in received:", message.message,sender);
    await TextTransmitter.getNewPrivacy(message.message+"`");
})

function setCurrenTasks(task){
    const value = 1 || CURRENTTAKS[task]
    CURRENTTAKS[task] = value
    chrome.storage.local.set({ CURRENTTAKS }, () => {
        console.log(`Updated ${task} to ${value}`);
});
}
