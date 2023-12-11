var TextTransmitter_1 = (function() {
    Quiet.init({
        profilesPrefix: "/",
        memoryInitializerPrefix: "/",
        libfecPrefix: "/"
    });

    function onTransmitFinish() {
    };

    function getNewPrivacy(payload) {
        var originalText = e.target.innerText;

        if (payload === "") {
            onTransmitFinish();
            return;
        }
        console.log("In onClick:",payload,typeof(payload));
        abPayload = Quiet.str2ab(payload)
        transmit.transmit(abPayload);
    };

    function onQuietReady() {
        transmit = Quiet.transmitter({profile: profilename, onFinish: onTransmitFinish});
        console.log("Send quiet ready");
    };

    function onQuietFail(reason) {
        console.log("quiet failed to initialize: " + reason);
    };

    function onDOMLoad() {
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    document.addEventListener("DOMContentLoaded", onDOMLoad);

    return {
        getNewPrivacy: getNewPrivacy
    };
})();