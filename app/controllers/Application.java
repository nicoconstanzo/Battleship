package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

  /**
   * Display the Home Page
   */
  public static Result index() {
    return ok(index.render());
  }

  public static Result waitingRoom(String username) {
      if (username == null || username.trim().equals("")) {
          flash("error", "Invalid username.");
          return redirect(routes.Application.index());
      }
      return ok(waitingRoom.render(username));
  }
  
}