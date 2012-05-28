var value = 0;
$( "#aircraftCarrier, #battleship, #destroyer, #patrolShip, #submarine" ).draggable({
    revert: "invalid",
    snap: '.boardBody'
});
$("#aircraftCarrier, #submarine, #patrolShip, #destroyer, #battleship").rotate({

   bind:
     {
           click: function(){
               value +=90;

               $(this).rotate({ animateTo:value})

           }
        }

});


$( "#strategyBoard .boardBody" ).droppable({

   hoverClass: 'hoverClass',
   drop: function(event, ui) {
    var position = event.target.className;
    var ship = $(ui.draggable).attr("id")
    console.log("the ship: "+ship+" was dragged to: "+ position);

    }

});


function resetmessage(){
    var message =  $(message);
    message.removechild(message.getelementsbytagname("p")[0]);

}

$('document').ready(function(){


 $(".myPiece").multiDraggable({ group: $(".myPiece"), snap: '#strategyBoard .boardBody', dragNative : function () {}});

});
