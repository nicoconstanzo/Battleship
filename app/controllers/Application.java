package controllers;

import models.GameManager;
import org.codehaus.jackson.JsonNode;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

  /**
   * Display the Home Page
   */
  public static Result index() {
    return ok(index.render());
  }


/*
*  Display the waiting room page.
*/
  public static Result waitingRoom(String username) {
      if (username == null || username.trim().equals("")) {
          flash("error", "Invalid username.");
          return redirect(routes.Application.index());
      }
      return ok(waitingRoom.render(username));
  }

   /*Web Socket handling*/
   public static WebSocket<JsonNode> game(final String username) {
           return new WebSocket<JsonNode>() {

               // Called when the WebSocket Handshake is done.
               public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
                   // Join the user to the Game.
                   try {
                       GameManager.join(username, in, out);
                   } catch (Exception ex) {
                       ex.printStackTrace();
                   }
               }
           };
       }
}