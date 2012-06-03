var value = 0;


$("#aircraftCarrier, #battleship, #destroyer, #patrolShip, #submarine").draggable({
    revert:"invalid",
    snap:'#strategyBoard .boardBody'
});

$("#aircraftCarrier, #submarine, #patrolShip, #destroyer, #battleship").rotate({
    bind:{
        click:function () {
            if ($(this).attr('data-orientation') == "horizontal") {
                value = 90;
                $(this).attr("data-orientation", "vertical");
                $(this).rotate({ animateTo:value});
            }
            else if ($(this).attr('data-orientation') == "vertical") {
                value = 0
                $(this).rotate({ animateTo:value});
                $(this).attr("data-orientation", "horizontal");
            }

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

    var strategy= {};
    var xPosition;
    var yPosition;
    var orientation;

//    xPosition = $('.' + shipType).data('x')
//    yPosition = $('.' + shipType).data('y')

    var destroyer = $('.destroyer')
    var patrolShip = $('.patrolShip')
    var aircraftCarrier = $('.aircraftCarrier')
    var submarine = $('.submarine')
    var battleship = $('.battleship')

    if (destroyer) {
        xPosition = destroyer.data('x')
        yPosition = destroyer.data('y')

        orientation = $("#destroyer").attr('data-orientation')
        strategy["destroyer"] = {}
        strategy["destroyer"]["orientation"] = orientation
        strategy["destroyer"][0] = {}
        strategy["destroyer"][0]["x"] = xPosition;
        strategy["destroyer"][0]["y"] = yPosition;
//        strategy = defineStrategy("destroyer")
    }

    if (patrolShip) {
        xPosition = patrolShip.data('x')
        yPosition = patrolShip.data('y')
        orientation = $("#patrolShip").attr('data-orientation')
        strategy["patrolShip"] = {}
        strategy["patrolShip"]["orientation"] = orientation
        strategy["patrolShip"][0] = {}
        strategy["patrolShip"][0]["x"] = xPosition;
        strategy["patrolShip"][0]["y"] = yPosition;
//        defineStrategy(strategy, "patrolShip")
    }

    if (aircraftCarrier) {
        xPosition = aircraftCarrier.data('x')
        yPosition = aircraftCarrier.data('y')
        orientation = $("#aircraftCarrier").attr('data-orientation')
        strategy["aircraftCarrier"] = {}
        strategy["aircraftCarrier"]["orientation"] = orientation
        strategy["aircraftCarrier"][0] = {}
        strategy["aircraftCarrier"][0]["x"] = xPosition;
        strategy["aircraftCarrier"][0]["y"] = yPosition;
//        defineStrategy(strategy, "aircraftCarrier")

    }
    if (submarine) {
        xPosition = submarine.data('x')
        yPosition = submarine.data('y')
        orientation = $("#submarine").attr('data-orientation')
        var length = 3;
        strategy["submarine"] = {}
        strategy["submarine"]["orientation"] = orientation
        strategy["submarine"][0] = {}
        strategy["submarine"][0]["x"] = xPosition;
        strategy["submarine"][0]["y"] = yPosition;
//        defineStrategy(strategy, "submarine")


    }
    if (battleship) {
        xPosition = battleship.data('x')
        yPosition = battleship.data('y')
        orientation = $("#battleship").attr('data-orientation')
        strategy["battleship"] = {}
        strategy["battleship"]["orientation"] = orientation
        strategy["battleship"][0] = {}
        strategy["battleship"][0]["x"] = xPosition;
        strategy["battleship"][0]["y"] = yPosition;
    }
//    chatSocket.send(JSON.stringify(strategy))
    sendMessage("strategy", strategy)
    console.log(JSON.stringify(strategy))

}


function validatePlaces(length, xPosition, yPosition, orientation) {
    if (orientation == "horizontal" && xPosition > 9 - length) {
        return "false";
    }
    else if (orientation == "vertical" && yPosition > 9 - length) {
        return "false";
    } else {
        return "true";
    }
}

//function defineStrategy(strategy, shipType) {
//    console.log(shipType)
//    var shipClass = $('.' + shipType)
//    var orientation = $("#" + shipType).attr('data-orientation')
//
//    xPosition = shipClass.data('x')
//    yPosition = shipClass.data('y')
//
//    strategy[shipType] = {}
//    strategy[shipType]["orientation"] = orientation
//    strategy[shipType][0] = {}
//    strategy[shipType][0]["x"] = xPosition;
//    strategy[shipType][0]["y"] = yPosition;
//
//}