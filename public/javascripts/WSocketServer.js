
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

    if(data.kind == 'waitOpponent'){
        var element = $(message);
        element.css("display","block");
        var blanket = $(popUpBlanket);
        blanket.css("display", "block");
        var p = document.createElement("p");
        p.innerHTML = data.messageText;
        message.appendChild(p);
    }

    if(data.kind == 'opponentReady'){
         var element = $(message);
         element.css("display","none");
         var blanket = $(popUpBlanket);
         blanket.css("display","none");
         resetMessage();
    }

    if(data.kind == 'game'){

        console.log("Game Data Arriving")
        console.log(data)

        // Seteamos el mensaje de texto, lo que aparece en el chat
//        $(chatLine).addClass('game');
//        $("#user", chatLine).text(data.kind);
//        $("p", chatLine).text(data.message.message);
//        $('#messages').append(chatLine)


        var position = data.message.shot;
        console.log("Shot at: " + position)
        var board = data.message.opponent ? $("#myBoard") : $("#opponentBoard")
        var element = $("."+position, board);



        if (data.message.subtype == "HIT") {
            if(board.selector == "#myBoard"){
                element.css("opacity", "0.3");
                element.css("filter", "alpha(opacity=30)");
            }
            else{
                var shipName = data.message.ship.shipNameHit;
                var index = data.message.ship.shipPositionHit;
                var horizontal = data.message.ship.horizontal;
                element.css("background", "url('/assets/images/ships/"+ shipName + index  +".png')");
                if(horizontal==false){
                    element.css("-webkit-transform","rotate(90deg)");
                }

            }

        }
        else if (data.message.subtype == "ALREADY_SHOT"){
            // Nothing needs to be done, since no image is required.
        }
        else if (data.message.subtype =="SINK") {
           if(board.selector == "#myBoard"){
                element.css("opacity", "0.3");
                element.css("filter", "alpha(opacity=30)");
           }else{
               var shipName = data.message.ship.shipNameHit;
               var index = data.message.ship.shipPositionHit;
               var horizontal = data.message.ship.horizontal;
               element.css("background", "url('/assets/images/ships/"+ shipName + index  +".png')");
               if(horizontal==false){
                   element.css("-webkit-transform","rotate(90deg)");
               }
           }
        }
        else{
        element.css("background", "url('/assets/images/"+ data.message.subtype +".jpg')");
        }
        //Play audio effect
        var audio = new Audio("/assets/sounds/" +data.message.subtype + ".mp3");
        audio.play();


        if(buttonAutoPlay){
            bot.update(parseInt(position.substring(0,1)),parseInt(position.substring(1,2)),data.message.autoplay);
            console.log(data.message.autoplay);
        }


    }

    if(data.kind =='leave'){

        var element = $(newGame);
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
        var element = $(newGame);
        element.css("display","block");
        var p = document.createElement("p");
        p.innerHTML = data.message.message;
        message.appendChild(p);


    }

    if (data.kind == 'fire') {
        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
        if(buttonAutoPlay){
                    var point = bot.suggest();
                    var position = point.x + point.y;
                    sendMessage("hit", position);
        }
    }


    if (data.kind == 'wait') {
        $("#opponentBoard h2").effect("pulsate", {times: 2}, 500);
//        $("#opponentBoard .boardBody").css({background: animateTo: "#FFFFFF"}, 1500);
    }
    if (data.kind == 'start') {
        $("#counter").countdown({
            image:'/assets/images/digits.png',
            startTime:'01:00',
            timerEnd:function () {
                if ($('#strategyRoom').css('display', 'none')) {
                // Do nothing
                } else {
                    getRandomStrategy()
                }
            },
            format:'mm:ss'
        });
    }
    if (data.kind == 'start' || data.kind == 'strategy') {

        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
    }

     if(data.kind == 'ship') {
        var shipType = data.message.shipType;
        var shipSize = data.message.shipSize;
        var horizontal = data.message.horizontal;

        $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/"+shipType+0+".png')");
        $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/"+shipType+1+".png')");
        $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/"+shipType+2+".png')");
        $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/"+shipType+3+".png')");
        $("#myBoard "+"."+ data.message.position4).css("background","url('/assets/images/ships/"+shipType+4+".png')");
        if(horizontal == false){
            $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
            $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");
            $("#myBoard "+"."+ data.message.position2).css("-webkit-transform","rotate(90deg)");
            $("#myBoard "+"."+ data.message.position3).css("-webkit-transform","rotate(90deg)");
            $("#myBoard "+"."+ data.message.position4).css("-webkit-transform","rotate(90deg)");
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
    var target = event.target
    var xPosition = $(target).data('x')
    var yPosition = $(target).data('y')

    var position = xPosition +""+ yPosition;

    sendMessage("hit", position);
    console.log('Hiciste click en la posición ' + position);
}
