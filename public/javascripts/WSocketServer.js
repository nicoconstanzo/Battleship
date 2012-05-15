
var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var WSPath = $("#WSocketPath").val();
var chatSocket = new WS(WSPath);

chatSocket.onmessage = receiveEvent;
$("#talk").keypress(handleReturnKey);
$("#myBoard .boardBody").click(handleClick);

function sendMessage(kind, messageText) {
    chatSocket.send(JSON.stringify(
        {
            kind:kind,
            messageText:messageText
        }
    ))
    ;
    $("#talk").val('');
}

function receiveEvent(event) {
    var data = JSON.parse(event.data);

    // Handle errors
    if (data.error) {
        chatSocket.close();
        $("#onError span").text(data.error);
        $("#onError").show();
        return
    } else {
        $("#onChat").show();
    }

    // Create the message element
    var chatLine = $('<div class="message"><span></span><user></user><p></p></div>');
    if (data.kind == 'chat') {
        $(chatLine).addClass('chat');
        $("userFrom", chatLine).text(data.userFrom + ": ");
    }


    if (data.kind == 'wait') {
        $("#questionPanel").hide();
        $("#answerPanel").hide();
    }

    $("span", chatLine).text(data.kind);
    $("p", chatLine).text(data.messageText);
    $('#messages').append(chatLine)
}

function handleReturnKey(e) {
    if (e.charCode == 13 || e.keyCode == 13) {
        e.preventDefault();
        var messageText = $("#talk").val();
        sendMessage("chat", messageText);
    }
}
function handleClick(e){
        var position = event.target.id;

        var element = document.getElementById(position);
        element.style.background = "url('/assets/images/AGUA.jpg')";
        sendMessage("play", position);
        alert('hiciste click en la posición '+ position);

}


