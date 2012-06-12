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
            FireResult fireResult = getFireResult(player, shot);
            if(fireResult.isAlreadyShot()){
                sendMessage(getCurrentPlayer(), "fire", "You already shot here, try again!");
                sendMessage(getOpponent(getCurrentPlayer()), "turn", "They already shot here, we will give him another chance");
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
        sendMessage(player,"finish", createShotMessage(false, win.name(), win.getActionAutoPlay(), shot, null, null,false, win.getCurrentPlayerMessage()));
        FireResult loser = FireResult.LOSER;
        sendMessage(getOpponent(player),"finish", createShotMessage(true, loser.name(), win.getActionAutoPlay(), shot,null, null,false, loser.getOpponentMessage()));
    }

    private void changeTurn(){
        Player previousCurrentPlayer = getCurrentPlayer();
        getCurrentPlayer().setTurn(false);
        (getOpponent(previousCurrentPlayer)).setTurn(true);
    }

    public void notifyTurn() {
           sendMessage(getCurrentPlayer(), "fire", "It's your turn, Fire.");
           sendMessage(getOpponent(getCurrentPlayer()), "wait", "It is " + getCurrentPlayer().getUsername() +  " turn!");
    }

    private ObjectNode createShotMessage(Boolean opponent,String fireResultName, String actionAutoPlay, String shot, String shipNameHit,String shipPositionHit, boolean horizontal, String message)
    {
        ObjectNode result = Json.newObject();
        result.put("opponent", opponent);
        result.put("subtype", fireResultName);
        result.put("autoplay", actionAutoPlay);
        result.put("shot", shot);
        result.put("ship", createShipMessage(shipNameHit,shipPositionHit,horizontal));
        result.put("message", message);
        return result;
    }
    
    private ObjectNode createShipMessage(String shipNameHit, String shipPositionHit, boolean horizontal){

        ObjectNode result = Json.newObject();
        result.put("shipNameHit", shipNameHit);
        result.put("shipPositionHit", shipPositionHit);
        result.put("horizontal", horizontal);
        return result;
    }


    private FireResult getFireResult (Player player, String shot){

        Object[] result = new String[4];
        Player opponent = getOpponent(player);
        FireResult fireResult;
//        if(player.getShots().contains(shot)){
//            result[2]=FireResult.ALREADY_SHOT.name();
//            return result;
//        }

//        else{

            List<Ship> ships = opponent.getShips();
            for (Ship ship : ships) {
                for (int i = 0; i < ship.getPosition().length; i++) {
                    if (shot.equals(ship.getPosition()[i])) {
                        ship.setHit(ship.getHit() + 1);
                        if (ship.isSunk()) {
                            player.addShot(shot);
                            opponent.addShipsSunk(ship);
                            fireResult = FireResult.SINK;
                            sendMessage(player,"game", createShotMessage(false,fireResult.name(),ship.getName(), shot, ship.getName(), String.valueOf(i),ship.isHorizontal(), fireResult.getCurrentPlayerMessage()));
                            sendMessage(getOpponent(player),"game", createShotMessage(true,fireResult.name(),fireResult.getActionAutoPlay(), shot, ship.getName(), String.valueOf(i),ship.isHorizontal(), fireResult.getOpponentMessage()));
                            return fireResult;
                        }
                        player.addShot(shot);
                        fireResult = FireResult.HIT;
                        sendMessage(player,"game", createShotMessage(false,fireResult.name(),fireResult.getActionAutoPlay(), shot, ship.getName(), String.valueOf(i),ship.isHorizontal(), fireResult.getCurrentPlayerMessage()));
                        sendMessage(getOpponent(player),"game", createShotMessage(true,fireResult.name(),fireResult.getActionAutoPlay(), shot, ship.getName(), String.valueOf(i),ship.isHorizontal(), fireResult.getOpponentMessage()));
                        return fireResult;

                    }
                }
            }
        fireResult = FireResult.WATER;
        sendMessage(player,"game", createShotMessage(false,fireResult.name(),fireResult.getActionAutoPlay(), shot, null, null,false, fireResult.getCurrentPlayerMessage()));
        sendMessage(getOpponent(player),"game", createShotMessage(true,fireResult.name(),fireResult.getActionAutoPlay(), shot, null, null,false, fireResult.getOpponentMessage()));
        return fireResult;
//        }
    }

    public void drawShips(Player player) {
        List<Ship> ships = player.getShips();

        for (Ship ship : ships) {
            ObjectNode result = Json.newObject();
            result.put("shipType", ship.getName());
            result.put("shipSize", ship.getSize());
            result.put("horizontal", ship.isHorizontal());
            for (int i = 0; i < ship.getPosition().length; i++) {
                result.put("position"+i, ship.getPosition()[i]);
            }

            sendMessage(player, "ship", result);
        }
    }
    
    public void randomStrategy(Player player){

        List<Ship> strategy = player.getShips();
        List<String> allPositions = new ArrayList<String>();

        AircraftCarrier aircraftCarrier = (AircraftCarrier) setStrategy(new AircraftCarrier(), allPositions);
        Battleship battleship = (Battleship) setStrategy(new Battleship(), allPositions);
        Submarine submarine = (Submarine) setStrategy(new Submarine(), allPositions);
        PatrolShip patrolShip = (PatrolShip) setStrategy(new PatrolShip(), allPositions);
        Destroyer destroyer = (Destroyer) setStrategy(new Destroyer(), allPositions);

        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(patrolShip);
        strategy.add(destroyer);

        player.setShips(strategy);
        
    }
    
    public Ship setStrategy(Ship ship,List<String> allPositions){
        int size = ship.getSize();
        String[] shipPosition = new String[size];
        Random random = new Random();
        int positionY = random.nextInt(11-size); //11 because it exclude the result number
        int positionX = random.nextInt(11-size); //11 because it exclude the result number
        boolean orientation = random.nextBoolean();
        
        for(int i=0; i<shipPosition.length; i++){
            ship.setHorizontal(orientation);
            String position;
            if(ship.isHorizontal()){
                position = String.valueOf(positionX + i).concat(String.valueOf(positionY));
             }else{
                position = String.valueOf(positionX).concat(String.valueOf(positionY+i));
            }
             if(allPositions.contains(position)){
                ship = setStrategy(ship, allPositions);
                break;
            }else{
                allPositions.add(position);
                shipPosition[i]= position;
            }

        }
        if(ship.getPosition()==null){
            ship.setPosition(shipPosition);
        }
        return ship;
    }

    public void setStrategy(JsonNode jsonNode, Player player) {
        player.addShips();
        for(Ship ship: player.getShips()){
            String[] position = new String[ship.getSize()];
            JsonNode shipJson = jsonNode.get(ship.getName());
            String orientation = shipJson.get("orientation").asText();
            JsonNode positionJson = shipJson.get("position");
            if(orientation.equals("horizontal")){
                ship.setHorizontal(true);
            }else{
                ship.setHorizontal(false);
            }
            for(int i=0; i<ship.getSize(); i++){
                int positionX = Integer.valueOf(positionJson.get(Integer.toString(i)).get("x").asText());
                int positionY = Integer.valueOf(positionJson.get(Integer.toString(i)).get("y").asText());
                position[i]=String.valueOf(positionX).concat(String.valueOf(positionY));
                
            }
            ship.setPosition(position);
         }
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
