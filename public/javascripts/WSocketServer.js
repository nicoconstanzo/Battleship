
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
        var p = document.createElement("p");
        p.innerHTML = data.messageText;
        message.appendChild(p);
        var audio = new Audio("/assets/sounds/leave.wav");
        audio.play();
    }


    if(data.kind =='finish'){
        var audio = new Audio("/assets/sounds/" +data.message.subtype + ".mp3");
        audio.play();
        var blanket = $(popUpBlanket);
        blanket.css("display", "block");
        var element = $(message);
        element.css("display","block");
        var p = document.createElement("p");
        p.innerHTML = data.message.message;
        message.appendChild(p);


    }

    if (data.kind == 'wait' || data.kind == 'start' || data.kind == 'fire') {
        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
    }

     if(data.kind == 'ship') {
        if(data.message.shipType=="Aircraft Carrier"){
            $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/b5.0.png')", "width","35px");
            $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/b5.1.png')", "width","35px");
            $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/b5.2.png')", "width","35px");
            $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/b5.3.png')", "width","35px");
            $("#myBoard "+"."+ data.message.position4).css("background","url('/assets/images/ships/b5.4.png')", "width","35px");
        }
        if(data.message.shipType=="Battleship"){
            $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/b4.0.png')");
            $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/b4.1.png')");
            $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/b4.2.png')");
            $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/b4.3.png')");
        }
        if(data.message.shipType=="Submarine"){
            $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/b3.0.png')");
            $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/b3.1.png')");
            $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/b3.2.png')");
        }
        if(data.message.shipType=="Destroyer"){
            $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/b2.0.png')");
            $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/b2.1.png')");
        }
        if(data.message.shipType=="Patrol Ship"){
            $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/b2.0.png')");
            $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/b2.1.png')");
        }
     }

    //Allows the chat window to auto scroll down
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
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




