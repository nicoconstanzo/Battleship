
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

//TODOOO
function getDefaultStrategy(){

    var strategy= {};
    var horizontal = "horizontal";
    var vertical = "vertical"
    strategy["ship0"] = {}

    strategy["ship0"]["name"] = "destroyer";
    strategy["ship0"]["position"] = {}
    var destroyerX=Math.floor(Math.random()*8)
    var destroyerY=Math.floor(Math.random()*8)
    var orientation= (Math.floor(Math.random()*1)==1) ? horizontal : vertical
    strategy["ship0"]["orientation"] = orientation;
    strategy["ship0"]["position"]["x"] = destroyerX;
    strategy["ship0"]["position"]["y"] = destroyerY;
    strategy["ship1"] = {}
    var patrolShipX=Math.floor(Math.random()*8)
    var patrolShipY=Math.floor(Math.random()*8)
    strategy["ship1"]["orientation"] = vertical;
    strategy["ship1"]["name"] = "patrolShip";
    strategy["ship1"]["position"] = {}
    strategy["ship1"]["position"]["x"] = patrolShipX;
    strategy["ship1"]["position"]["y"] = patrolShipY;
    strategy["ship2"] = {}
    var aircraftX=Math.floor(Math.random()*5)
    var aircraftY=Math.floor(Math.random()*5)
    strategy["ship2"]["orientation"] = horizontal;
    strategy["ship2"]["name"] = "aircraftCarrier";
    strategy["ship2"]["position"] = {}
    strategy["ship2"]["position"]["x"] = aircraftX ;
    strategy["ship2"]["position"]["y"] = aircraftY ;
    strategy["ship3"] = {}
    var submarineX=Math.floor(Math.random()*7)
    var submarineY=Math.floor(Math.random()*7)
    strategy["ship3"]["orientation"] = horizontal;
    strategy["ship3"]["name"] = "submarine";
    strategy["ship3"]["position"] = {}
    strategy["ship3"]["position"]["x"] = submarineX;
    strategy["ship3"]["position"]["y"] = submarineY;
    strategy["ship4"] = {}
    var battleshipX=Math.floor(Math.random()*6)
    var battleshipY=Math.floor(Math.random()*6)
    strategy["ship4"]["orientation"] = vertical;
    strategy["ship4"]["name"] = "battleship";
    strategy["ship4"]["position"] = {}
    strategy["ship4"]["position"]["x"] = battleshipX;
    strategy["ship4"]["position"]["y"] = battleshipY;



    sendMessage("strategy",strategy);
    console.log(JSON.stringify(strategy));
    showGame();
}

function sendStrategy() {

    var strategy= {};
    var xPosition;
    var yPosition;
    var orientation;

    var destroyer = $('.destroyer')
    var patrolShip = $('.patrolShip')
    var aircraftCarrier = $('.aircraftCarrier')
    var submarine = $('.submarine')
    var battleship = $('.battleship')

    if (destroyer) {
        xPosition = destroyer.data('x')
        yPosition = destroyer.data('y')

        orientation = $("#destroyer").attr('data-orientation')
        strategy["ship0"] = {}
        strategy["ship0"]["orientation"] = orientation;
        strategy["ship0"]["name"] = "destroyer";
        strategy["ship0"]["position"] = {}
        strategy["ship0"]["position"]["x"] = xPosition;
        strategy["ship0"]["position"]["y"] = yPosition;
//        strategy = defineStrategy("destroyer")
    }

    if (patrolShip) {
        xPosition = patrolShip.data('x')
        yPosition = patrolShip.data('y')
        orientation = $("#patrolShip").attr('data-orientation')
        strategy["ship1"] = {}
        strategy["ship1"]["orientation"] = orientation;
        strategy["ship1"]["name"] = "patrolShip";
        strategy["ship1"]["position"] = {}
        strategy["ship1"]["position"]["x"] = xPosition;
        strategy["ship1"]["position"]["y"] = yPosition;
//        defineStrategy(strategy, "patrolShip")
    }

    if (aircraftCarrier) {
        xPosition = aircraftCarrier.data('x')
        yPosition = aircraftCarrier.data('y')
        orientation = $("#aircraftCarrier").attr('data-orientation')
        strategy["ship2"] = {}
        strategy["ship2"]["orientation"] = orientation;
        strategy["ship2"]["name"] = "aircraftCarrier";
        strategy["ship2"]["position"] = {}
        strategy["ship2"]["position"]["x"] = xPosition;
        strategy["ship2"]["position"]["y"] = yPosition;
//        defineStrategy(strategy, "aircraftCarrier")

    }
    if (submarine) {
        xPosition = submarine.data('x')
        yPosition = submarine.data('y')
        orientation = $("#submarine").attr('data-orientation')
        strategy["ship3"] = {}
        strategy["ship3"]["orientation"] = orientation;
        strategy["ship3"]["name"] = "submarine";
        strategy["ship3"]["position"] = {}
        strategy["ship3"]["position"]["x"] = xPosition;
        strategy["ship3"]["position"]["y"] = yPosition;
//        defineStrategy(strategy, "submarine")


    }
    if (battleship) {
        xPosition = battleship.data('x')
        yPosition = battleship.data('y')
        orientation = $("#battleship").attr('data-orientation')
        strategy["ship4"] = {}
        strategy["ship4"]["orientation"] = orientation;
        strategy["ship4"]["name"] = "battleship";
        strategy["ship4"]["position"] = {}
        strategy["ship4"]["position"]["x"] = xPosition;
        strategy["ship4"]["position"]["y"] = yPosition;
    }
//    chatSocket.send(JSON.stringify(strategy))
    sendMessage("strategy", strategy)
    console.log(JSON.stringify(strategy));
    showGame();

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