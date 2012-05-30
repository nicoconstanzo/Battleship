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
    addClasses: false,
    drop:function (event, ui) {

        var target = event.target;
        $(target).css('background', 'blue')

//        var targetClass = $(target).attr('class').split(" ")
//        var yPosition = targetClass[0]
//        var xPosition = targetClass[1]

        var shipType = $(ui.draggable).attr('id')

        var xPosition = $(target).data('x')
        var yPosition = $(target).data('y')

        console.log(xPosition,yPosition, shipType)

        if(shipType == "destroyer" || shipType == "patrolShip") {
            var length = 2;

        }

        if(shipType == "aircraftCarrier") {
            var length = 5

        }
        if(shipType == "submarine") {
            var length = 3

        }
        if(shipType == "battleship") {
            var length = 4

        }

    },
    hoverClass:"hoverClass"
});




function resetMessage() {
    var message = $(message);
    message.removeChild(message.getElementsByTagName("p")[0]);
}

