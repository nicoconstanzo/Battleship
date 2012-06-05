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

//  TODO
function getDefaultStrategy() {

    var strategy = {};
    var horizontal = "horizontal";
    var vertical = "vertical"
    strategy["ship0"] = {}

    strategy["ship0"]["name"] = "destroyer";
    strategy["ship0"]["position"] = {}
    var destroyerX = Math.floor(Math.random() * 8)
    var destroyerY = Math.floor(Math.random() * 8)
    var orientation = (Math.floor(Math.random() * 1) == 1) ? horizontal : vertical
    strategy["ship0"]["orientation"] = orientation;
    strategy["ship0"]["position"]["x"] = destroyerX;
    strategy["ship0"]["position"]["y"] = destroyerY;
    strategy["ship1"] = {}
    var patrolShipX = Math.floor(Math.random() * 8)
    var patrolShipY = Math.floor(Math.random() * 8)
    strategy["ship1"]["orientation"] = vertical;
    strategy["ship1"]["name"] = "patrolShip";
    strategy["ship1"]["position"] = {}
    strategy["ship1"]["position"]["x"] = patrolShipX;
    strategy["ship1"]["position"]["y"] = patrolShipY;
    strategy["ship2"] = {}
    var aircraftX = Math.floor(Math.random() * 5)
    var aircraftY = Math.floor(Math.random() * 5)
    strategy["ship2"]["orientation"] = horizontal;
    strategy["ship2"]["name"] = "aircraftCarrier";
    strategy["ship2"]["position"] = {}
    strategy["ship2"]["position"]["x"] = aircraftX;
    strategy["ship2"]["position"]["y"] = aircraftY;
    strategy["ship3"] = {}
    var submarineX = Math.floor(Math.random() * 7)
    var submarineY = Math.floor(Math.random() * 7)
    strategy["ship3"]["orientation"] = horizontal;
    strategy["ship3"]["name"] = "submarine";
    strategy["ship3"]["position"] = {}
    strategy["ship3"]["position"]["x"] = submarineX;
    strategy["ship3"]["position"]["y"] = submarineY;
    strategy["ship4"] = {}
    var battleshipX = Math.floor(Math.random() * 6)
    var battleshipY = Math.floor(Math.random() * 6)
    strategy["ship4"]["orientation"] = vertical;
    strategy["ship4"]["name"] = "battleship";
    strategy["ship4"]["position"] = {}
    strategy["ship4"]["position"]["x"] = battleshipX;
    strategy["ship4"]["position"]["y"] = battleshipY;


    sendMessage("strategy", strategy);
    console.log(JSON.stringify(strategy));
    showGame();
}

function sendStrategy() {

    var strategy = {};
    var xPosition;
    var yPosition;
    var orientation;

    var destroyer = $('.destroyer')
    var patrolShip = $('.patrolShip')
    var aircraftCarrier = $('.aircraftCarrier')
    var submarine = $('.submarine')
    var battleship = $('.battleship')
    var validation = "false";

    var isOverlap = shipOverlap();


    if (destroyer) {
        var length = 2;
        xPosition = destroyer.data('x')
        yPosition = destroyer.data('y')


        orientation = $("#destroyer").attr('data-orientation')

        var validate = validatePlaces(length, xPosition, yPosition, orientation)
        if (validate == "true") {
            strategy["ship0"] = {}
            strategy["ship0"]["orientation"] = orientation;
            strategy["ship0"]["name"] = "destroyer";
            strategy["ship0"]["position"] = {}
            strategy["ship0"]["position"]["x"] = xPosition;
            strategy["ship0"]["position"]["y"] = yPosition;
            validation = "true"
        }
        else {
            validation = "false"
        }
//        strategy = defineStrategy("destroyer")
    }

    if (patrolShip) {
        var length = 2;
        xPosition = patrolShip.data('x')
        yPosition = patrolShip.data('y')
        orientation = $("#patrolShip").attr('data-orientation')
        var validate = validatePlaces(length, xPosition, yPosition, orientation)
        if (validate == "true") {
            strategy["ship1"] = {}
            strategy["ship1"]["orientation"] = orientation;
            strategy["ship1"]["name"] = "patrolShip";
            strategy["ship1"]["position"] = {}
            strategy["ship1"]["position"]["x"] = xPosition;
            strategy["ship1"]["position"]["y"] = yPosition;
            validation = "true"
        }
        else {
            validation = "false"
        }

//        defineStrategy(strategy, "patrolShip")
    }

    if (aircraftCarrier) {
        var length = 4;
        xPosition = aircraftCarrier.data('x')
        yPosition = aircraftCarrier.data('y')
        orientation = $("#aircraftCarrier").attr('data-orientation')
        var validate = validatePlaces(length, xPosition, yPosition, orientation)
        if (validate == "true") {
            strategy["ship2"] = {}
            strategy["ship2"]["orientation"] = orientation;
            strategy["ship2"]["name"] = "aircraftCarrier";
            strategy["ship2"]["position"] = {}
            strategy["ship2"]["position"]["x"] = xPosition;
            strategy["ship2"]["position"]["y"] = yPosition;
            validation = "true"
        }
        else {
            validation = "false"
        }
//        defineStrategy(strategy, "aircraftCarrier")

    }
    if (submarine) {
        var length = 3;
        xPosition = submarine.data('x')
        yPosition = submarine.data('y')
        orientation = $("#submarine").attr('data-orientation')
        var validate = validatePlaces(length, xPosition, yPosition, orientation)
        if (validate == "true") {
            strategy["ship3"] = {}
            strategy["ship3"]["orientation"] = orientation;
            strategy["ship3"]["name"] = "submarine";
            strategy["ship3"]["position"] = {}
            strategy["ship3"]["position"]["x"] = xPosition;
            strategy["ship3"]["position"]["y"] = yPosition;
            validation = "true"
        }
        else {
            validation = "false"
        }
//        defineStrategy(strategy, "submarine")


    }
    if (battleship) {
        var length = 5;
        xPosition = battleship.data('x')
        yPosition = battleship.data('y')
        orientation = $("#battleship").attr('data-orientation')
        var validate = validatePlaces(length, xPosition, yPosition, orientation)
        if (validate == "true") {
            strategy["ship4"] = {}
            strategy["ship4"]["orientation"] = orientation;
            strategy["ship4"]["name"] = "battleship";
            strategy["ship4"]["position"] = {}
            strategy["ship4"]["position"]["x"] = xPosition;
            strategy["ship4"]["position"]["y"] = yPosition;
            validation = "true"
        } else {
            validation = "false"
        }
    }
//    chatSocket.send(JSON.stringify(strategy))
    if (validation == "true" && isOverlap == "false") {
        console.log(JSON.stringify(strategy));
        sendMessage("strategy", strategy)
        showGame();
    }
    else if (validation == "false" || isOverlap== "true") {
        strategy = {}
        var element = $("#notAllowed");
        element.css("display", "block")
        var p = document.createElement("p");
        p.innerHTML = "You can't place your boat there";
        element.append(p);
        var blanket = $("#popUpBlanket");
        blanket.css("display", "block");
        blanket.click(function () {
            element.css("display", "none");

            blanket.css("display", "none");
        });

    }


}


function validatePlaces(length, xPosition, yPosition, orientation) {


    if (orientation == "horizontal" && xPosition > 9 - length) {
        return "false";
    }
    else if (orientation == "vertical" && yPosition > 9 - length) {
        return "false";
    }
    else if (xPosition == null || yPosition == null) {
        return "false";
    }
    else {
        return "true";
    }
}

function shipOverlap() {

    var isOverlap = "false"

    var destroyer = $('.destroyer')
    var patrolShip = $('.patrolShip')
    var aircraftCarrier = $('.aircraftCarrier')
    var submarine = $('.submarine')
    var battleship = $('.battleship')

    var desOrientation = $("#destroyer").attr('data-orientation')
    var patOrientation = $("#patrolShip").attr('data-orientation')
    var airOrientation = $("#aircraftCarrier").attr('data-orientation')
    var subOrientation = $("#submarine").attr('data-orientation')
    var batOrientation = $("#battleship").attr('data-orientation')


    var desPos0x = $(destroyer).data('x')
    var desPos0y = $(destroyer).data('y')
    var desPos0 = desPos0x + "" + desPos0y
    var desPos1;

    if (desOrientation == "horizontal") {
        desPos1 = (desPos0x + 1) + "" + (desPos0y)
    } else {
        desPos1 = (desPos0x) + "" + (desPos0y + 1)
    }

    var patPos0x = $(patrolShip).data('x')
    var patPos0y = $(patrolShip).data('y')
    var patPos0 = patPos0x + "" + patPos0y
    var patPos1;
    if (patOrientation == "horizontal") {
        patPos1 = (patPos0x + 1) + "" + (patPos0y)
    } else {
        patPos1 = (patPos0x) + "" + (patPos0y + 1)
    }

    var subPos0x = $(submarine).data('x')
    var subPos0y = $(submarine).data('y')
    var subPos0 = subPos0x + "" + subPos0y;
    var subPos1;
    var subPos2;
    if (subOrientation == "horizontal") {
        subPos1 = (subPos0x + 1) + "" + (subPos0y)
        subPos2 = (subPos0x + 2) + "" + (subPos0y)

    } else {
        subPos1 = (subPos0x) + "" + (subPos0y + 1)
        subPos2 = (subPos0x) + "" + (subPos0y + 2)
    }


    var batPos0x = $(battleship).data('x')
    var batPos0y = $(battleship).data('y')
    var batPos0 = batPos0x + "" + batPos0y;
    var batPos1;
    var batPos2;
    var batPos3;
    if (batOrientation == "horizontal") {
        batPos1 = (batPos0x + 1) + "" + (batPos0y)
        batPos2 = (batPos0x + 2) + "" + (batPos0y)
        batPos3 = (batPos0x + 3) + "" + (desPos0y)
    } else {
        batPos1 = (batPos0x) + "" + (batPos0y + 1)
        batPos2 = (batPos0x) + "" + (batPos0y + 2)
        batPos3 = (batPos0x) + "" + (batPos0y + 3)
    }

    var airPos0x = $(aircraftCarrier).data('x')
    var airPos0y = $(aircraftCarrier).data('y')
    var airPos0 = airPos0x + "" + airPos0y;
    var airPos1;
    var airPos2;
    var airPos3;
    var airPos4;
    if (airOrientation == "horizontal") {
        airPos1 = (airPos0x + 1) + "" + (airPos0y)
        airPos2 = (airPos0x + 2) + "" + (airPos0y)
        airPos3 = (airPos0x + 3) + "" + (airPos0y)
        airPos4 = (airPos0x + 4) + "" + (airPos0y)
    } else {
        airPos1 = (airPos0x) + "" + (airPos0y + 1)
        airPos2 = (airPos0x) + "" + (airPos0y + 2)
        airPos3 = (airPos0x) + "" + (airPos0y + 3)
        airPos4 = (airPos0x) + "" + (airPos0y + 4)
    }


    var list = []
    list.push(desPos0, desPos1)

    if (jQuery.inArray(patPos0 || patPos1, list)==-1) {
        list.push(patPos0, patPos1)

    } else {
        isOverlap = "true"
    }

    if (jQuery.inArray(subPos0 || subPos1 || subPos2, list)==-1) {
        list.push(subPos0, subPos1, subPos2)

    } else {
        isOverlap = "true"
    }

    if (jQuery.inArray(batPos0 || batPos1 || batPos2 || batPos3, list) ==-1) {
        list.push(batPos0, batPos1, batPos2, batPos3)
    } else {
        isOverlap = "true"
    }

    if (jQuery.inArray(airPos0 || airPos1 || airPos2 || airPos3 || airPos4, list) ==-1) {
        list.push(airPos0, airPos1, airPos2, airPos3, airPos4)
    } else {
        isOverlap = "true"
    }
    console.log(isOverlap)
    return isOverlap;

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