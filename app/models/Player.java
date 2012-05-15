package models;

import models.Ship.Ship;
import org.codehaus.jackson.JsonNode;
import play.mvc.WebSocket;

import java.util.List;

public class Player {
    private String username;
    private WebSocket.Out<JsonNode> channel;
    private String gameId;
    private List<Ship> ships;

    private boolean turn;

    public Player(String name, WebSocket.Out<JsonNode> out, String id) {
        username = name;
        channel = out;
        gameId = id;
    }

    public String getUsername() {
        return username;
    }

    public WebSocket.Out<JsonNode> getChannel() {
        return channel;
    }

    public String getGameId() {
        return gameId;
    }

    public void setTurn(boolean turn){
        this.turn =turn;

    }

    public boolean isTurn() {
        return turn;
    }

    public List<Ship> getShips() {
        return ships;
    }

    public void setShips(List<Ship> ships) {
        this.ships = ships;
    }

    @Override
    public String toString() {
        return username;
    }
}
