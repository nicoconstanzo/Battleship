package models;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.WebSocket;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 11/05/12
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */
public class Message {

    public static void sendMessage(Player player, String kind, String message) {
        ObjectNode jsonNode = Json.newObject();
        jsonNode.put("kind", kind);
        jsonNode.put("messageText", message);
        player.getChannel().write(jsonNode);
    }


    public static void usernameAlreadyChoosen(WebSocket.Out<JsonNode> out){
        ObjectNode jsonNode = Json.newObject();
        jsonNode.put("kind","exception");
        jsonNode.put("messageText", "This username is already used");
        out.write(jsonNode);
    }

    public static void sendChat(Player playerFrom, Player playerTo, String message){
        ObjectNode jsonNode = Json.newObject();
        jsonNode.put("kind", "chat");
        jsonNode.put("userFrom", playerFrom.getUsername());
        jsonNode.put("messageText", message);
        playerFrom.getChannel().write(jsonNode);
        playerTo.getChannel().write(jsonNode);
        

    }
}
