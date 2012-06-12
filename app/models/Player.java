package models;

import models.Ship.*;
import org.codehaus.jackson.JsonNode;
import play.mvc.WebSocket;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class Player {
    private String username;
    private WebSocket.Out<JsonNode> channel;
    private String gameId;
    private List<Ship> ships;
    List<String> shots;
    private Stack shipsSunk;

    private boolean turn;

    public Player(String name, WebSocket.Out<JsonNode> out, String id) {
        username = name;
        channel = out;
        gameId = id;
        shots = new ArrayList<String>();
        ships = new ArrayList<Ship>();
        shipsSunk = new Stack();
    }

    protected void addShips() {
        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        PatrolShip patrolShip = new PatrolShip();
        Destroyer destroyer = new Destroyer();

        ships.add(aircraftCarrier);
        ships.add(battleship);
        ships.add(submarine);
        ships.add(patrolShip);
        ships.add(destroyer);
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

    public void setTurn(boolean turn) {
        this.turn = turn;

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

    public boolean isDefeated() {
        if (shipsSunk.size()==5) {
            return true;
        }
        return false;
    }


    public List<String> getShots() {
        return shots;
    }

    public void addShot(String shot) {
        shots.add(shot);
    }

    public boolean isStrategyReady() {
        return !ships.isEmpty();
    }


    public Stack getShipsSunk() {
        return shipsSunk;
    }

    public void addShipsSunk(Ship shipSunk) {
        shipsSunk.push(shipSunk);
    }

}
