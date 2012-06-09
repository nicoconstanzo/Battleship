package models;

import models.Ship.*;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import static models.Message.sendMessage;

public class Game {
    private String gameId;


    private Player playerOne;
    private Player playerTwo;
    private int nPlayer;

    public Game() {
        gameId = UUID.randomUUID().toString();
    }

    void startGame() {
        nPlayer = 2;
        setTurn();
        notifyOponent();
        notifyTurn();
    }

    private void notifyOponent() {
        sendMessage(getPlayerOne(), "start", "Welcome to Boom Boom Splash, you are playing against " + getPlayerTwo().getUsername());
        sendMessage(getPlayerTwo(), "start", "Welcome to Boom Boom Splash you are playing against " + getPlayerOne().getUsername());
    }

    public void play(Player player, String shot){
        if (getCurrentPlayer() == player) {
            FireResult fireResult = checkFire(player, shot);
            if(fireResult.isAlreadyShot()){
                sendMessage(getCurrentPlayer(), "fire", "Try again!");
                sendMessage(getOpponent(getCurrentPlayer()), "turn", "We will give him another chance");
            }else if(!player.isDefeated()){
                changeTurn();
                notifyTurn();
            }
            else{
                notifyWinner(player, shot);
            }
        } else {
            sendMessage(getOpponent(getCurrentPlayer()), "wait", "Wait, is not your turn!");
        }
    }

    private void notifyWinner(Player player, String shot) {
        FireResult win = FireResult.WIN;
        sendMessage(player,"finish", createShotMessage(false, win.name(), shot, win.getCurrentPlayerMessage()));
        FireResult loser = FireResult.LOSER;
        sendMessage(getOpponent(player),"finish", createShotMessage(true, loser.name(), shot, loser.getOpponentMessage()));
    }

    private void changeTurn(){
        Player previousCurrentPlayer = getCurrentPlayer();
        getCurrentPlayer().setTurn(false);
        (getOpponent(previousCurrentPlayer)).setTurn(true);
    }

    public void notifyTurn() {
           sendMessage(getCurrentPlayer(), "fire", "It's your turn, Fire.");
//           sendMessage(getOpponent(getCurrentPlayer()), "wait", "It is " + getCurrentPlayer().getUsername() +  " turn!");
    }

    private ObjectNode createShotMessage(Boolean opponent,String fireResultName, String shot, String message)
    {
        ObjectNode result = Json.newObject();
        result.put("opponent", opponent);
        result.put("subtype", fireResultName);
        result.put("shot", shot);
        result.put("message", message);
        return result;
    }
    
    private FireResult checkFire(Player player, String shot){
        FireResult fireResult = getFireResult(getOpponent(player), shot);
        sendMessage(player,"game", createShotMessage(false,fireResult.name(), shot,fireResult.getCurrentPlayerMessage()));
        sendMessage(getOpponent(player),"game", createShotMessage(true,fireResult.name(), shot,fireResult.getOpponentMessage()));
        return  fireResult;
    }


    private FireResult getFireResult (Player opponentPlayer, String shot){

        if(opponentPlayer.getShots().contains(shot)){
            return FireResult.ALREADY_SHOT;
        }

        else{

            List<Ship> ships = opponentPlayer.getShips();
            for (Ship ship : ships) {
                for (int i = 0; i < ship.getPosition().length; i++) {
                    if (shot.equals(ship.getPosition()[i])) {
                        ship.setHit(ship.getHit() + 1);
                        if (ship.isSunk()) {
                            opponentPlayer.addShot(shot);
                            return FireResult.SINK;
                        }
                        opponentPlayer.addShot(shot);
                        return FireResult.HIT;
                    }
                }
            }
            opponentPlayer.addShot(shot);
            return FireResult.WATER;
        }
    }

    public void drawShips(Player player) {
        List<Ship> ships = player.getShips();

        for (Ship ship : ships) {
            ObjectNode result = Json.newObject();
            result.put("shipType", ship.getName());
            for (int i = 0; i < ship.getPosition().length; i++) {
                result.put("position" + i, ship.getPosition()[i]);
            }

            sendMessage(player, "ship", result);
        }
    }

    public void setStrategyy(JsonNode jsonNode, Player player) {

        List<Ship> strategy = player.getShips();

        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        PatrolShip patrolShip = new PatrolShip();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        Destroyer destroyer = new Destroyer();
        String[] aircraftCarrierPosition = new String[aircraftCarrier.getSize()];
        String[] destroyerPosition = new String[destroyer.getSize()];
        String[] patrolShipPosition = new String[patrolShip.getSize()];
        String[] battleshipPosition = new String[battleship.getSize()];
        String[] submarinePosition = new String[submarine.getSize()];

        for (int j = 0; j < 5; j++) {
            JsonNode ship = jsonNode.get("messageText").get("ship" + j);
            String shipName = jsonNode.get("messageText").get("ship" + j).get("name").asText();


            if (shipName.equals("aircraftCarrier")) {
                String position = ship.get("orientation").asText();
                int x = Integer.valueOf(ship.get("position").get("x").asText());
                int y = Integer.valueOf(ship.get("position").get("y").asText());
                if (position.equals("horizontal")) {
                    for (int i = 0; i < aircraftCarrierPosition.length; i++)
                        aircraftCarrierPosition[i] = String.valueOf(x+i).concat(String.valueOf(y));
                } else {
                    for (int i = 0; i < aircraftCarrierPosition.length; i++)
                        aircraftCarrierPosition[i] = String.valueOf(x).concat(String.valueOf(y+i));
                }
                aircraftCarrier.setPosition(aircraftCarrierPosition);


            }
            if (shipName.equals("battleship")) {
                String position = ship.get("orientation").asText();
                int x = Integer.valueOf(ship.get("position").get("x").asText());
                int y = Integer.valueOf(ship.get("position").get("y").asText());
                if (position.equals("horizontal")) {
                    for (int i = 0; i < battleshipPosition.length; i++)
                        battleshipPosition[i] = String.valueOf(x+i).concat(String.valueOf(y));
                } else {
                    for (int i = 0; i < battleshipPosition.length; i++)
                        battleshipPosition[i] = String.valueOf(x).concat(String.valueOf(y+i));
                }
                battleship.setPosition(battleshipPosition);

            }
            if (shipName.equals("submarine")) {
                String position = ship.get("orientation").asText();
                int x = Integer.valueOf(ship.get("position").get("x").asText());
                int y = Integer.valueOf(ship.get("position").get("y").asText());
                if (position.equals("horizontal")) {
                    for (int i = 0; i < submarinePosition.length; i++)
                        submarinePosition[i] = String.valueOf(x+i).concat(String.valueOf(y));
                } else {
                    for (int i = 0; i < submarinePosition.length; i++)
                        submarinePosition[i] = String.valueOf(x).concat(String.valueOf(y+i));
                }
                submarine.setPosition(submarinePosition);

            }
            if (shipName.equals("destroyer")) {
                String position = ship.get("orientation").asText();
                int x = Integer.valueOf(ship.get("position").get("x").asText());
                int y = Integer.valueOf(ship.get("position").get("y").asText());
                if (position.equals("horizontal")) {
                    for (int i = 0; i < destroyerPosition.length; i++)
                        destroyerPosition[i] = String.valueOf(x+i).concat(String.valueOf(y));
                } else {
                    for (int i = 0; i < destroyerPosition.length; i++)
                        destroyerPosition[i] = String.valueOf(x).concat(String.valueOf(y+i));
                }
                destroyer.setPosition(destroyerPosition);

            }
            if (shipName.equals("patrolShip")) {

                String position = ship.get("orientation").asText();
                int x = Integer.valueOf(ship.get("position").get("x").asText());
                int y = Integer.valueOf(ship.get("position").get("y").asText());
                if (position.equals("horizontal")) {
                    for (int i = 0; i < patrolShipPosition.length; i++)
                        patrolShipPosition[i] = String.valueOf(x+i).concat(String.valueOf(y));
                } else {
                    for (int i = 0; i < patrolShipPosition.length; i++)
                        patrolShipPosition[i] = String.valueOf(x).concat(String.valueOf(y+i));
                }
                patrolShip.setPosition(patrolShipPosition);

            }


        }
        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(patrolShip);
        strategy.add(destroyer);

        player.setShips(strategy);
    }



    @Override
    public String toString() {
        return "Game{" +
                "playerOne=" + playerOne +
                ", playerTwo=" + playerTwo +
                ", nPlayer=" + nPlayer +
                '}';
    }

    public Player getOpponent(Player player){
        Player opponent = isPlayerOne(player) ? getPlayerTwo() : getPlayerOne();
        return opponent;
    }

    private boolean isPlayerOne(Player player) {
        return player == getPlayerOne();
    }

    public void leave(){
        nPlayer--;
    }

    public boolean isStart() {
       return isPlayerOneDefined() && isPlayerTwoDefined();
    }

    public boolean playerLeaves() {
        return nPlayer == 0;
    }

    public boolean isFinish(){
        return playerOne.isDefeated() || playerTwo.isDefeated();
    }

    private Player getCurrentPlayer(){
        return playerOne.isTurn() ? playerOne : playerTwo;
    }

    public String getGameId() {
        return gameId;
    }

    public Player getPlayerOne() {
        return playerOne;
    }

    public Player getPlayerTwo() {
        return playerTwo;
    }


    public void setPlayerOne(Player playerOne) {
        this.playerOne = playerOne;
    }

    public void setPlayerTwo(Player playerTwo) {
        this.playerTwo = playerTwo;
    }

    public boolean isPlayerOneDefined() {
        return playerOne != null;
    }


    public boolean isPlayerTwoDefined() {
        return playerTwo != null;
    }

    private void setTurn() {
        playerOne.setTurn(turn());
        playerOne.setTurn(!playerTwo.isTurn());
    }

    public boolean turn(){
        Random random = new Random();
        boolean turn = random.nextBoolean();
        return turn;
    }





}
