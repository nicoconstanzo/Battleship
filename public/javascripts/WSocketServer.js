
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

    console.log(data);
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
    var chatLine = $('<div class="message"><div id="user"></div><p></p></div>');

    if (data.kind == 'chat') {
        $(chatLine).addClass('chat');
        if (data.userFrom == null) {
            $("#user", chatLine).text("chat");
        }
        $("#user", chatLine).text(data.userFrom);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
    }

    if(data.kind == 'game'){

        console.log("Game Data Arriving")
        console.log(data)

        // Seteamos el mensaje de texto, lo que aparece en el chat
        $(chatLine).addClass('game');
        $("#user", chatLine).text(data.kind);
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

    if(data.kind =='leave'){
        var element = $(message);
        element.css("display","block");
        var blanket = $(popUpBlanket);
        blanket.css("display", "block");
    }

    if (data.kind == 'wait' || data.kind == 'start') {
        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
    }

    if(data.kind == 'ship2') {
        $("#myBoard .8B").css("background","url('/assets/images/ships/b20.png')");
        $("#myBoard .8C").css("background","url('/assets/images/ships/b21.png')");

        $("#myBoard .1B").css("background","url('/assets/images/ships/b20.png')");
        $("#myBoard .1C").css("background","url('/assets/images/ships/b21.png')");

        $("#myBoard .3I").css("background","url('/assets/images/ships/b30.png')");
        $("#myBoard .2I").css("background","url('/assets/images/ships/b31.png')");
        $("#myBoard .1I").css("background","url('/assets/images/ships/b32.png')");

        $("#myBoard .6G").css("background","url('/assets/images/ships/b40.png')");
        $("#myBoard .7G").css("background","url('/assets/images/ships/b41.png')");
        $("#myBoard .8G").css("background","url('/assets/images/ships/b42.png')");
        $("#myBoard .9G").css("background","url('/assets/images/ships/b43.png')");

        $("#myBoard .4C").css("background","url('/assets/images/ships/b50.png')");
        $("#myBoard .4D").css("background","url('/assets/images/ships/b51.png')");
        $("#myBoard .4E").css("background","url('/assets/images/ships/b52.png')");
        $("#myBoard .4F").css("background","url('/assets/images/ships/b53.png')");
        $("#myBoard .4G").css("background","url('/assets/images/ships/b54.png')");
    }

    if(data.kind == 'ship1') {
        $("#myBoard .9B").css("background","url('/assets/images/ships/b20.png')");
        $("#myBoard .9C").css("background","url('/assets/images/ships/b21.png')");

        $("#myBoard .6J").css("background","url('/assets/images/ships/b20.png')");
        $("#myBoard .7J").css("background","url('/assets/images/ships/b21.png')");

        $("#myBoard .5D").css("background","url('/assets/images/ships/b30.png')");
        $("#myBoard .5E").css("background","url('/assets/images/ships/b31.png')");
        $("#myBoard .5F").css("background","url('/assets/images/ships/b32.png')");

        $("#myBoard .10F").css("background","url('/assets/images/ships/b40.png')");
        $("#myBoard .10G").css("background","url('/assets/images/ships/b41.png')");
        $("#myBoard .10H").css("background","url('/assets/images/ships/b42.png')");
        $("#myBoard .10I").css("background","url('/assets/images/ships/b43.png')");

        $("#myBoard .2B").css("background","url('/assets/images/ships/b50.png')");
        $("#myBoard .2C").css("background","url('/assets/images/ships/b51.png')");
        $("#myBoard .2D").css("background","url('/assets/images/ships/b52.png')");
        $("#myBoard .2E").css("background","url('/assets/images/ships/b53.png')");
        $("#myBoard .2F").css("background","url('/assets/images/ships/b54.png')");
    }
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


