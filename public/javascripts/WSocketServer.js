
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
        var close = $(".close");
        close.css("display", "none");
        var p = document.createElement("p");
        p.innerHTML = data.messageText;
        var img = document.createElement("img");
        img.setAttribute("src", "/assets/images/257.gif");
        img.setAttribute("width", "20");
        message.appendChild(p);
        message.appendChild(img);
    }

    if(data.kind == 'opponentReady'){
         var element = $(message);
         element.css("display","none");
         var blanket = $(popUpBlanket);
         blanket.css("display","none");
         var close = $(".close");
         close.css("display", "block");
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

        if (data.message.subtype == "HIT" || data.message.subtype =="SINK") {
            element.css("opacity", "0.3");
            element.css("filter", "alpha(opacity=30)");
        }
        else if (data.message.subtype == "ALREADY_SHOT") {
        // Nothing needs to be done, since no image is required.
        }
        else{
        element.css("background", "url('/assets/images/"+ data.message.subtype +".jpg')");
        }
        //Play audio effect
        var audio = new Audio("/assets/sounds/" +data.message.subtype + ".mp3");
        audio.play();

        if(autoplay){
            bot.update(Integer.valueOf(position.substring(0,1)),Integer.valueOf(position.substring(1,2)),data.message.subtype);
        }



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

    if (data.kind == 'fire') {
        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
        if(autoplay){
                    var point = bot.suggest();
                    var position = point.x + point.y;
                    sendMessage("hit", position);
        }
    }


    if (data.kind == 'wait') {
        $("#opponentBoard h2").effect("pulsate", {times: 2}, 500);
//        $("#opponentBoard .boardBody").css({background: animateTo: "#FFFFFF"}, 1500);
    }

    if (data.kind == 'start' || data.kind == 'strategy') {
        $(chatLine).addClass('info');
        $("#user", chatLine).text(data.kind);
        $("p", chatLine).text(data.messageText);
        $('#messages').append(chatLine)
    }

     if(data.kind == 'ship') {
       var shipType = data.message.shipType;
     //        var shipSize = data.message.shipSize;
        if(shipType=="Aircraft Carrier"){
            if(data.message.position0.substring(0,1)!=data.message.position1.substring(0,1)){
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/aircraftCarrier0.png')");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/aircraftCarrier1.png')");
                $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/aircraftCarrier2.png')");
                $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/aircraftCarrier3.png')");
                $("#myBoard "+"."+ data.message.position4).css("background","url('/assets/images/ships/aircraftCarrier4.png')");

            }
            else{
              $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/aircraftCarrier0.png')");
              $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
              $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/aircraftCarrier1.png')");
              $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");
              $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/aircraftCarrier2.png')");
              $("#myBoard "+"."+ data.message.position2).css("-webkit-transform","rotate(90deg)");
              $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/aircraftCarrier3.png')");
              $("#myBoard "+"."+ data.message.position3).css("-webkit-transform","rotate(90deg)");
              $("#myBoard "+"."+ data.message.position4).css("background","url('/assets/images/ships/aircraftCarrier4.png')");
              $("#myBoard "+"."+ data.message.position4).css("-webkit-transform","rotate(90deg)");

            }

        }
        if(shipType=="Battleship"){
            if(data.message.position0.substring(0,1)!=data.message.position1.substring(0,1)){
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/battleship0.png')");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/battleship1.png')");
                $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/battleship2.png')");
                $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/battleship3.png')");
            }
            else{
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/battleship0.png')");
                $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/battleship1.png')");
                $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/battleship2.png')");
                $("#myBoard "+"."+ data.message.position2).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position3).css("background","url('/assets/images/ships/battleship3.png')");
                $("#myBoard "+"."+ data.message.position3).css("-webkit-transform","rotate(90deg)");

            }
        }
        if(shipType=="Submarine"){
            if(data.message.position0.substring(0,1)!=data.message.position1.substring(0,1)){
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/submarine0.png')");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/submarine1.png')");
                $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/submarine2.png')");
            }
            else{
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/submarine0.png')");
              $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/submarine1.png')");
              $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position2).css("background","url('/assets/images/ships/submarine2.png')");
              $("#myBoard "+"."+ data.message.position2).css("-webkit-transform","rotate(90deg)");

            }
        }
        if(shipType=="Destroyer"){
            if(data.message.position0.substring(0,1)!=data.message.position1.substring(0,1)){
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/destroyer0.png')");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/destroyer1.png')");
                }
            else{
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/destroyer0.png')");
              $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/destroyer1.png')");
              $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");

            }
        }
        if(shipType=="Patrol Ship"){
            if(data.message.position0.substring(0,1)!=data.message.position1.substring(0,1)){
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/patrolShip0.png')");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/patrolShip1.png')");
            }
            else{
                $("#myBoard "+"."+ data.message.position0).css("background","url('/assets/images/ships/patrolShip0.png')");
                $("#myBoard "+"."+ data.message.position0).css("-webkit-transform","rotate(90deg)");
                $("#myBoard "+"."+ data.message.position1).css("background","url('/assets/images/ships/patrolShip1.png')");
                $("#myBoard "+"."+ data.message.position1).css("-webkit-transform","rotate(90deg)");
            }
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
