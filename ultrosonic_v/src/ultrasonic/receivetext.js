// function done(){


//importScripts("../ultrasonic/quiet.js")


// Quiet.init({
//     profilesPrefix: "/",
//     memoryInitializerPrefix: "/",
//     libfecPrefix: "/"
// });

//Quiet.transmitter({profile: "ultrasonic-experimental", onFinish: done});

// export default async function sendInformation(data){
//     console.log("Start to ultrasonic transmit!")
//     transmitter.transmit(Quiet.str2ab(payload));
// }




var TextReceiver = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });
    var target;
    var content = new ArrayBuffer(0);
    var warningbox;
    var sucess = 0;
    var failure = 0;
    
    
    function onReceive(recvPayload) {
        console.log("In onReceive");
        content = Quiet.mergeab(content, recvPayload);
        var command = Quiet.ab2str(content)
        target.textContent = command;
        warningbox.classList.add("hidden");
        sucess++;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        warningbox.classList.remove("hidden");
        warningbox.textContent = { "Packet Loss:\d " : failure + "/" + total + " (" + ratio.toFixed(0) + "%)"};
        
        var sendPrivacy = TextTransmitter;
        /*Send message to background, start the monitor tasks */
        chrome.runtime.sendMessage({
            type:command
        })
    }

    function onReceiverCreateFail(reason) {
        console.log("Receiver onReceiverCreateFail");
        console.log("Receiver failed to create quiet receiver: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver Sorry, it looks like this example is not supported by your browser. Please give permission to use the microphone or try again in Google Chrome or Microsoft Edge."
    }

    function onReceiveFail(num_fails) {
        console.log("onReceiveFail");
        failure  = num_fails ;
        var total = sucess + failure;

        var ratio = failure/total * 100;
        console.log("total:"+total+"\tfailure:"+failure);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.\nPacket Loss: " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)"
    }

    function onQuietReady() {
        console.log("Receiver onQuietReady");
        var profilename = document.querySelector('[data-quiet-profile-name]').getAttribute('data-quiet-profile-name');
        var receiverOnReceive = function(payload) { onReceive(payload); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails); };
        Quiet.receiver({profile: profilename,
            onReceive: receiverOnReceive,
            onCreateFail: receiverOnReceiverCreateFail,
            onReceiveFail: receiverOnReceiveFail
        });

        
        //privacySender = send();

        //Pretend already received the message
        console.log("Receiver Pretend received the command:"+COMMANDS.NAVGATION);
        //getConduct(COMMANDS.NAVGATION);
    }

    function onQuietFail(reason) {
        console.log("Receiver onQuietFail");
        console.log("Receiver quiet failed to initialize: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Receiver Sorry, it looks like there was a problem with this example (" + reason + ")";
    }

    function onDOMLoad() {
        console.log("Receiver onDOMLoad");
        target = document.querySelector('[data-quiet-receive-text-target]');
        warningbox = document.querySelector('[data-quiet-warning]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    }

    document.addEventListener("Receiver DOMContentLoaded", onDOMLoad);
})();


var TextTransmitter = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });
    console.log("Initiate a TextTransmitter!")
    var transmit;

    function onTransmitFinish() {
        console.log("Sender onTransmiFinish");
    };

    function getNewPrivacy(payload) {
        //var originalText = e.target.innerText;

        if (payload === "") {
            onTransmitFinish();
            return;
        }
        console.log("Sender In onClick:",payload,typeof(payload));
        abPayload = Quiet.str2ab(payload)
        transmit.transmit(abPayload);
    };

    function onQuietReady() {
        transmit = Quiet.transmitter({profile: profilename, onFinish: onTransmitFinish});
        console.log("Sender Send quiet ready");
    };

    function onQuietFail(reason) {
        console.log("Sender quiet failed to initialize: " + reason);
    };

    function onDOMLoad() {
        console.log("Sender initiate onDOMLoad");
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    function init(){
        document.addEventListener("Sender DOMContentLoaded", onDOMLoad);
    }

    

    return {
        init:init,
        getNewPrivacy: getNewPrivacy
    };
})();

TextTransmitter.init();

chrome.runtime.onMessage.addListener(async(message, sender, sendResponse)=> {
    console.log("In options: Message received in received:", message.message,sender);

    //await TextTransmitter.getNewPrivacy(message.message);
    //await sendInformation(message.message);
})