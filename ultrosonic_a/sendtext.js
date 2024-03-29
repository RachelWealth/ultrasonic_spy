

PROFILENAME = "ultrasonic-experimental";
var TextTransmitter = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });
    var btn;
    var warningbox;
    var transmit;

    function onTransmitFinish() {
        //;
        btn.addEventListener('click', onClick, false);
        btn.disabled = false;
        var originalText = btn.innerText;
        btn.innerText = btn.getAttribute('data-quiet-sending-text');
        btn.setAttribute('data-quiet-sending-text', originalText);
    };

    function onClick(e) {
        e.target.removeEventListener(e.type, arguments.callee);
        e.target.disabled = true;
        var originalText = e.target.innerText;
        e.target.innerText = e.target.getAttribute('data-quiet-sending-text');
        e.target.setAttribute('data-quiet-sending-text', originalText);
        //var payload = textbox.value;
        var payload = document.getElementById("commandSelector").value;        
        console.log("In onClick:",payload,typeof(payload))
        for(let i = 0; i < 20;++i)
            transmit.transmit(Quiet.str2ab(payload));
    };

    function onQuietReady() {
        var profilename = document.querySelector('[data-quiet-profile-name]').getAttribute('data-quiet-profile-name');
        transmit = Quiet.transmitter({profile: profilename, onFinish: onTransmitFinish});
        btn.addEventListener('click', onClick, false);
    };

    function onQuietFail(reason) {
        console.log("quiet failed to initialize: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like there was a problem with this example (" + reason + ")";
    };

    function onDOMLoad() {
        btn = document.querySelector('[data-quiet-send-button]');
        textbox = document.querySelector('[data-quiet-text-input]');
        warningbox = document.querySelector('[data-quiet-warning-send]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();




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

    function onReceive(recvPayload) {
        console.log("In onReceive");
        var content = new ArrayBuffer(0);
        content = Quiet.mergeab(content, recvPayload);
        command = Quiet.ab2str(content)
        console.log(command);
        // command = command.replace(/`/g, "\n");
        //target.textContent = command;
        target.value = target.value + "\n" + command;
        //inputElement.value = "";
        warningbox.classList.add("hidden");
        sucess++;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        warningbox.textContent = "Packet Loss: " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)"
    }

    function onReceiverCreateFail(reason) {
        console.log("onReceiverCreateFail");
        console.log("failed to create quiet receiver: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like this example is not supported by your browser. Please give permission to use the microphone or try again in Google Chrome or Microsoft Edge."
    }

    function onReceiveFail(num_fails) {
        console.log("onReceiveFail");
        failure  = num_fails ;
        var total = sucess + failure;

        var ratio = failure/total * 100;
        console.log("total:"+total+"\tfailure:"+failure);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.\nPacket Loss: " + failure + "/" + total + " (" + ratio.toFixed(0) + "%)"
    }

    function onQuietReady() {
        console.log("onQuietReady");
        var receiverOnReceive = function(payload) { onReceive(payload); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails); };
        Quiet.receiver({profile: PROFILENAME,
            onReceive: receiverOnReceive,
            onCreateFail: receiverOnReceiverCreateFail,
            onReceiveFail: receiverOnReceiveFail
        });
    }

    function onQuietFail(reason) {
        console.log("onQuietFail");
        console.log("quiet failed to initialize: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like there was a problem with this example (" + reason + ")";
    }

    function onDOMLoad() {
        console.log("onDOMLoad");
        target = document.querySelector('[data-quiet-receive-text-target]');
        warningbox = document.querySelector('[data-quiet-warning-receive]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    }

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();
