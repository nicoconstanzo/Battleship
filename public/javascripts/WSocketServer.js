
var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var WSPath = $("#WSocketPath").val();
var chatSocket = new WS(WSPath);

chatSocket.onmessage = receiveEvent;
$("#talk").keypress(handleReturnKey);
$("#opponentBoard .boardBody").click(handleClick);

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
    var chatLine = $('<div class="message"><span></span><span id="user"></span><p></p></div>');
    if (data.kind == 'chat') {
        $(chatLine).addClass('chat');
        $("#user", chatLine).text(data.userFrom + ": ");
        $('#messages').append(chatLine)
    }

//    if(data.kind == 'hit'){
//        console.log("HIT: " + data)
//        var position = data.messageText;
//        var element = document.getElementById(position);
//        element.style.background = "url('/assets/images/WATER.jpg')";
//         $("span", chatLine).text(data.kind);
//         $("p", chatLine).text("You hit: " + data.messageText);
//         $('#messages').append(chatLine)
//
//    }

    if(data.kind == 'game'){

        console.log("Data Arriving")
        console.log(data)

        // Seteamos el mensaje de texto, lo que aparece en el chat
        $("span", chatLine).text(data.kind);
        $("p", chatLine).text(data.message.message);
        $('#messages').append(chatLine)


        var position = data.message.shot;
        console.log("Shot at: " + position)
        var board = data.message.opponent ? $("#myBoard") : $("#opponentBoard")
        var element = $("."+position, board);

        //Change the background depending on WATER/HIT, etc..
        element.css("background", "url('/assets/images/"+ data.message.subtype +".jpg')");
        //Play audio effect
        var audio = new Audio("/assets/sounds/" +data.message.subtype + ".mp3");
        audio.play();
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
        var position = event.target.className.substring(0,event.target.className.indexOf(" "));
        sendMessage("hit", position);
        console.log('Hiciste click en la posición '+ position);

}


