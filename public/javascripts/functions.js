var value = 0;
$( "#aircraftCarrier, #battleship, #destroyer, #patrolShip, #submarine" ).draggable({ revert: "invalid"});
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

   drop: function(event, ui) {
    var position=event.target.className;
    alert(position);
    },
     hoverClass: "hoverClass"
});


function resetMessage(){
    var message =  $(message);
    message.removeChild(message.getElementsByTagName("p")[0]);

}