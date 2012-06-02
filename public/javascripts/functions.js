var value = 0;


$("#aircraftCarrier, #battleship, #destroyer, #patrolShip, #submarine").draggable({
    revert:"invalid",
    snap:'#strategyBoard .boardBody'
});

$("#aircraftCarrier, #submarine, #patrolShip, #destroyer, #battleship").rotate({
    bind:{
        click:function () {
            value += 90;
            $(this).rotate({ animateTo:value})
        }
    }

});

$("#strategyBoard .boardBody").droppable({
    addClasses:false,
    drop:function (event, ui) {
        var target = event.target;

        $(target).css('background', 'blue')

//        var targetClass = $(target).attr('class').split(" ")
//        var yPosition = targetClass[0]
//        var xPosition = targetClass[1]
        var shipType = $(ui.draggable).attr('id')

        $(target).addClass(shipType)

    },
    hoverClass:"hoverClass"
});


function showGame() {
    $('#strategyRoom').css("display", "none");
    $('#game').css("display", "block");
}

function resetMessage() {
    var message = $(message);
    message.removeChild(message.getElementsByTagName("p")[0]);
}


function sendStrategy() {


    var strategy = {}

//    xPosition = $('.' + shipType).data('x')
//    yPosition = $('.' + shipType).data('y')

//    yPosition = yPosition
    if ($('.destroyer')) {
        xPosition = $('.destroyer').data('x')
        yPosition = $('.destroyer').data('y')
        strategy["type"] = "strategy"
        strategy["destroyer"] = {}
        strategy["destroyer"][0] = {}
        strategy["destroyer"][0]["x"] = xPosition;
        strategy["destroyer"][0]["y"] = yPosition;

//        chatSocket.send(JSON.stringify(strategy))
    }

    if ($('.patrolShip')) {
        strategy["type"] = "strategy"
        strategy["patrolShip"] = {}
        strategy["patrolShip"][0] = {}
        strategy["patrolShip"][0]["x"] = xPosition;
        strategy["patrolShip"][0]["y"] = yPosition;

//        chatSocket.send(JSON.stringify(strategy))
    }

    if ($('.aircraftCarrier')) {
        strategy["type"] = "strategy"

        strategy["aircraftCarrier"] = {}
        strategy["aircraftCarrier"][0] = {}
        strategy["aircraftCarrier"][0]["x"] = xPosition;
        strategy["aircraftCarrier"][0]["y"] = yPosition;


//        chatSocket.send(JSON.stringify(strategy))
    }
    if ($('.submarine')) {
        strategy["type"] = "strategy"

        strategy["submarine"] = {}
        strategy["submarine"][0] = {}
        strategy["submarine"][0]["x"] = xPosition;
        strategy["submarine"][0]["y"] = yPosition;

//        chatSocket.send(JSON.stringify(strategy))
    }
    if ($('.battleship')) {
        strategy["type"] = "strategy"

        strategy["battleship"] = {}
        strategy["battleship"][0] = {}
        strategy["battleship"][0]["x"] = xPosition;
        strategy["battleship"][0]["y"] = yPosition;

//        chatSocket.send(JSON.stringify(strategy))
    }
    chatSocket.send(JSON.stringify(strategy))

    console.log(JSON.stringify(strategy))
}