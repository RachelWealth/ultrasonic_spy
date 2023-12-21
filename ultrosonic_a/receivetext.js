

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
        target.textContent = Quiet.ab2str(content);
        warningbox.classList.add("hidden");
        sucess++;
        var total = sucess + failure;
        var ratio = failure/total * 100;
        warningbox.classList.remove("hidden");
        warningbox.textContent = { "Packet Loss:\d " : failure + "/" + total + " (" + ratio.toFixed(0) + "%)"}
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
        var profilename = document.querySelector('[data-quiet-profile-name]').getAttribute('data-quiet-profile-name');
        var receiverOnReceive = function(payload) { onReceive(payload); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails); };
        Quiet.receiver({profile: profilename,
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
        warningbox = document.querySelector('[data-quiet-warning]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    }

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();
