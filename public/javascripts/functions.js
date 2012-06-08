
var value = 0;
var autoplay = "false";
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
    var message = document.getElementById("message");
    message.removeChild(message.getElementsByTagName("p")[0]);
}

function getRandomStrategy() {
    var strategy = []
    sendMessage("randomStrategy", strategy);
    showGame();
}

function createStrategy(strategy, shipName, shipLength, shipOrientation, positionX, positionY){

    strategy[shipName] = {};
    strategy[shipName] = {};
    strategy[shipName]["orientation"] = shipOrientation;
    strategy[shipName]["position"] = {}
    if(shipOrientation=="vertical"){
        for(var i=0; i<shipLength;i=i+1){
            strategy[shipName]["position"][i]={};
            strategy[shipName]["position"][i]["x"] = positionX;
            strategy[shipName]["position"][i]["y"] = parseInt(positionY)+i;
        }
    }

    if(shipOrientation=="horizontal"){
         for(var i=0; i<shipLength;i=i+1){
           strategy[shipName]["position"][i]={};
           strategy[shipName]["position"][i]["x"] = parseInt(positionX)+i;
           strategy[shipName]["position"][i]["y"] = positionY;
         }
    }
}


function sendStrategy() {

    var strategy = {}
    var destroyer = $('#destroyer')
    var patrolShip = $('#patrolShip')
    var aircraftCarrier = $('#aircraftCarrier')
    var submarine = $('#submarine')
    var battleship = $('#battleship')

    createStrategy(strategy,"Aircraft Carrier",5,aircraftCarrier.attr('data-orientation'), $(".aircraftCarrier").data('x'),$(".aircraftCarrier").data('y'));
    createStrategy(strategy,"Battleship",4,battleship.attr('data-orientation'),$(".battleship").data('x'),$(".battleship").data('y'));
    createStrategy(strategy,"Submarine",3,submarine.attr('data-orientation'),$(".submarine").data('x'),$(".submarine").data('y'));
    createStrategy(strategy,"Patrol Ship",2,patrolShip.attr('data-orientation'),$(".patrolShip").data('x'),$(".patrolShip").data('y'));
    createStrategy(strategy,"Destroyer",2,destroyer.attr('data-orientation'),$(".destroyer").data('x'),$(".destroyer").data('y'));

    console.log(strategy);
    sendMessage("strategy", strategy);
    showGame();
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

function autoPlay(){
        if(autoplay){
                   autoplay= false;
                   $("#autoPlay a").html("AutoPlay!")
              } else {
                   autoplay = true;
                   $("#autoPlay a").html("Deactivate")
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