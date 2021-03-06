
var value = 0;
var buttonAutoPlay = false;
var bot = new BattleshipBot();



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
        var xPos = $(target).attr('data-x')
        var yPos = $(target).attr('data-y')

        $(ui.draggable).attr('data-x', xPos)
        $(ui.draggable).attr('data-y', yPos)

//        var shipType = $(ui.draggable).attr('id')
//        $(target).addClass(shipType)
    },
    hoverClass:"hoverClass"
});


function showGame() {
    $('#game').css("display", "block");
    $('#strategyRoom').css("display", "none");
}

function resetMessage() {
    var message = document.getElementById("message");
    message.removeChild(message.getElementsByTagName("p")[0]);
}

function getRandomStrategy() {
    var strategy = []
    sendMessage("randomStrategy", strategy);
    showGame();
}

function createStrategy(strategy, allPositions, shipName, shipLength, shipOrientation, positionX, positionY, shipId) {
    var valid = validatePlaces(shipLength, positionX, positionY, shipOrientation);
    if (valid == "true") {
        strategy[shipName] = {};
        strategy[shipName] = {};
        strategy[shipName]["orientation"] = shipOrientation;
        strategy[shipName]["position"] = {}
        if (shipOrientation == "vertical") {
            for(var i=0; i<shipLength;i=i+1){
                posY=(parseInt(positionX)+i);
                position = positionX + posY.toString();
                if(jQuery.inArray(position.toString(), allPositions)>-1){
                    allPositions = {}
                    return shipId.attr('id');
                }else{
                    strategy[shipName]["position"][i]={};
                    strategy[shipName]["position"][i]["x"] = positionX;
                    strategy[shipName]["position"][i]["y"] = parseInt(positionY)+i;
                    allPositions.push(position);
                }
            }
        }


        if (shipOrientation == "horizontal") {
            for (var i = 0; i < shipLength; i = i + 1) {
                posX=(parseInt(positionX)+i);
                position = posX.toString() + positionY;
                if(jQuery.inArray(position.toString(), allPositions)>-1){
                    allPositions = {}
                    return shipId.attr('id');
                }else{
                    strategy[shipName]["position"][i] = {};
                    strategy[shipName]["position"][i]["x"] = parseInt(positionX) + i;
                    strategy[shipName]["position"][i]["y"] = positionY;
                    allPositions.push(position);
                }
            }
        }
        return "true";

    } else {
        return shipId.attr('id');
    }
}



function sendStrategy() {



    var strategy = {}
    var allPositions = []
    var destroyer = $('#destroyer')
    var patrolShip = $('#patrolShip')
    var aircraftCarrier = $('#aircraftCarrier')
    var submarine = $('#submarine')
    var battleship = $('#battleship')
//
//    var valid1 = createStrategy(strategy,allPositions,"carrier",5,aircraftCarrier.attr('data-orientation'), $(".aircraftCarrier").data('x'),$(".aircraftCarrier").data('y'), aircraftCarrier);
//    var valid2 = createStrategy(strategy,allPositions,"battleship",4,battleship.attr('data-orientation'),$(".battleship").data('x'),$(".battleship").data('y'), battleship);
//    var valid3 = createStrategy(strategy,allPositions,"submarine",3,submarine.attr('data-orientation'),$(".submarine").data('x'),$(".submarine").data('y'), submarine);
//    var valid4 = createStrategy(strategy,allPositions,"patrol",2,patrolShip.attr('data-orientation'),$(".patrolShip").data('x'),$(".patrolShip").data('y'), patrolShip);
//    var valid5 = createStrategy(strategy,allPositions,"destroyer",2,destroyer.attr('data-orientation'),$(".destroyer").data('x'),$(".destroyer").data('y'), destroyer);
    var valid1 = createStrategy(strategy,allPositions,"carrier",5,aircraftCarrier.attr('data-orientation'), $(aircraftCarrier).data('x'),$(aircraftCarrier).data('y'), aircraftCarrier);
    var valid2 = createStrategy(strategy,allPositions,"battleship",4,battleship.attr('data-orientation'),$(battleship).data('x'),$(battleship).data('y'), battleship);
    var valid3 = createStrategy(strategy,allPositions,"submarine",3,submarine.attr('data-orientation'),$(submarine).data('x'),$(submarine).data('y'), submarine);
    var valid4 = createStrategy(strategy,allPositions,"patrol",2,patrolShip.attr('data-orientation'),$(patrolShip).data('x'),$(patrolShip).data('y'), patrolShip);
    var valid5 = createStrategy(strategy,allPositions,"destroyer",2,destroyer.attr('data-orientation'),$(destroyer).data('x'),$(destroyer).data('y'), destroyer);


//    var overlap = "false";
//    var sorted = allPositions.sort()
//    for (var i = 0; i < allPositions.length - 1; i++) {
//        if (sorted[i + 1] == sorted[i]) {
//            overlap = "true";
//        }
//    }


    if (valid1 == "true" && valid2 == "true" && valid3 == "true" && valid4=="true" && valid5 == "true") {
        console.log(strategy);
        sendMessage("strategy", strategy);
        showGame();
    } else if (valid1 != "true") {
        $("#"+valid1).effect("pulsate", {times: 2}, 500);
        strategy = {}
    } else if (valid2 != "true") {
        $("#"+valid2).effect("pulsate", {times: 2}, 500);
        strategy = {}
    } else if (valid3 != "true") {
        $("#"+valid3).effect("pulsate", {times: 2}, 500);
        strategy = {}
    } else if (valid4 != "true") {
        $("#"+valid4).effect("pulsate", {times: 2}, 500);
        strategy = {}
    } else if (valid5 != "true") {
        $("#"+valid5).effect("pulsate", {times: 2}, 500);
        strategy = {}
    } else {
//        alert ("I shouldn't get here")
    }
}



function validatePlaces(length, xPosition, yPosition, orientation) {
    if (orientation == "horizontal" && xPosition > 10 - length) {
        return "false";
    }
    else if (orientation == "vertical" && yPosition > 10 - length) {
        return "false";
    }
    else if (xPosition == null || yPosition == null) {
        return "false";
    }
    else {
        return "true";
    }
}

function autoPlay(){
        if(buttonAutoPlay){
           buttonAutoPlay= false;
           $("#autoPlay a").html("AutoPlay!")
        } else {
           buttonAutoPlay = true;
           $("#autoPlay a").html("Deactivate")
        }
}



