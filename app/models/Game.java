package models;

import models.Ship.*;
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
        setStrategy();
        drawShips();
        notifyTurn();
    }

    private void notifyOponent() {
        sendMessage(getPlayerOne(), "start", "Let's play Boom Boom Splash, you are playing against " + getPlayerTwo().getUsername());
        sendMessage(getPlayerTwo(), "start", "Let's play Boom Boom Splash, you are playing against " + getPlayerOne().getUsername());
    }

    public void play(Player player, String shot){
        if (getCurrentPlayer() == player) {
            checkFire(player, shot);
            if(!player.isDefeated()){
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

    private void notifyTurn() {
           sendMessage(getCurrentPlayer(), "fire", "It's your turn, Fire.");
           sendMessage(getOpponent(getCurrentPlayer()), "wait", "It is " + getCurrentPlayer().getUsername() +  " turn!");

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

    private ObjectNode drawAircraftCarrier(Player player)
    {
        ObjectNode result = Json.newObject();
        AircraftCarrier aircraftCarrier = (AircraftCarrier) player.getShips().get(0);
        result.put("shipType", aircraftCarrier.getName());
        String[] position = aircraftCarrier.getPosition();
        for(int i=0; i< position.length; i++){
                result.put("position"+i, position[i]);
        }




//        List<Ship> ships = player.getShips();
//        for(Ship ship: ships){
//            result.put("shipType", ship.getName());
//            for(int i=0; i<ships.get(0).getPosition().length; i++){
//                result.put("position"+i, ship.getPosition()[i]);
//            }
//        }
        
        return result;
    }

    private ObjectNode drawBattleship(Player player)
    {
        ObjectNode result = Json.newObject();
        Battleship battleship = (Battleship) player.getShips().get(1);
        result.put("shipType", battleship.getName());
        String[] position = battleship.getPosition();
        for(int i=0; i< position.length; i++){
            result.put("position"+i, position[i]);
        }


        return result;
    }
    private ObjectNode drawSubmarine(Player player)
    {
        ObjectNode result = Json.newObject();
        Submarine submarine = (Submarine) player.getShips().get(2);
        result.put("shipType", submarine.getName());
        String[] position = submarine.getPosition();
        for(int i=0; i< position.length; i++){
            result.put("position"+i, position[i]);
        }

        return result;
    }
    private ObjectNode drawDestoyer(Player player)
    {
        ObjectNode result = Json.newObject();
        Destroyer destroyer = (Destroyer) player.getShips().get(4);
        result.put("shipType", destroyer.getName());
        String[] position = destroyer.getPosition();
        for(int i=0; i< position.length; i++){
            result.put("position"+i, position[i]);
        }

        return result;
    }

    private ObjectNode drawCruiser(Player player)
    {
        ObjectNode result = Json.newObject();
        PatrolShip cruiser = (PatrolShip) player.getShips().get(3);
        result.put("shipType", cruiser.getName());
        String[] position = cruiser.getPosition();
        for(int i=0; i< position.length; i++){
            result.put("position"+i, position[i]);
        }
        return result;
    }

    
    private void checkFire(Player player, String shot){
        FireResult fireResult = getFireResult(player, shot);
        sendMessage(player,"game", createShotMessage(false,fireResult.name(), shot,fireResult.getCurrentPlayerMessage()));
        sendMessage(getOpponent(player),"game", createShotMessage(true,fireResult.name(), shot,fireResult.getOpponentMessage()));
    }


    private FireResult getFireResult (Player player, String shot){
    
        //TODO falta verificar si ya le dio a esa position
        
        List<Ship> ships = player.getShips();
        for(Ship ship: ships){
            for(int i = 0; i<ship.getPosition().length; i++){
                if(shot.equals(ship.getPosition()[i])){
                    ship.setHit(ship.getHit()+1);
                    if(ship.isSunk()){
                        return FireResult.SINK;
                    }
                    return FireResult.HIT;
                }
            }
        }

        return FireResult.WATER;
    }

    private void drawShips () {

        Player playerOne = getPlayerOne();
        Player playerTwo = getPlayerTwo();

        drawShipss(playerOne);
        drawShipss(playerTwo);

//        sendMessage(playerTwo,"ship",drawAircraftCarrier(playerOne));
//        sendMessage(playerTwo,"ship",drawBattleship(playerOne));
//        sendMessage(playerTwo,"ship",drawSubmarine(playerOne));
//        sendMessage(playerTwo,"ship",drawCruiser(playerOne));
//        sendMessage(playerTwo,"ship",drawDestoyer(playerOne));
//        sendMessage(playerOne,"ship",drawAircraftCarrier(playerTwo));
//        sendMessage(playerOne,"ship",drawBattleship(playerTwo));
//        sendMessage(playerOne,"ship",drawSubmarine(playerTwo));
//        sendMessage(playerOne,"ship",drawCruiser(playerTwo));
//        sendMessage(playerOne,"ship",drawDestoyer(playerTwo));
//        Player player1 = getPlayerOne();
//        ObjectNode ships1 = Json.newObject();
//        ships1.put("aircraft", "4C, 4D, 4E, 4F, 4G");
//        ships1.put("battleship", "6G,7G,8G,9G");
//        ships1.put("submarine", "1I, 2I, 3I");
//        ships1.put("cruiser", "1B, 1C");
//        ships1.put("destroyer", "8B, 8C");
//        sendMessage(player1, "ship1", ships1);
//
//        Player player2 = getPlayerTwo();
//        ObjectNode ships2 = Json.newObject();
//        ships2.put("aircraft", "2B, 2C, 2D, 2E, 2F");
//        ships2.put("battleship", "10F, 10G, 10H, 10I");
//        ships2.put("submarine", "5D, 5E,5F");
//        ships2.put("cruiser", "6J,7J");
//        ships2.put("destroyer", "9B,9C");
//        sendMessage(player2, "ship2", ships2);
    }

    private void drawShipss(Player player) {
        List<Ship> ships = player.getShips();

        for(Ship ship: ships){
            ObjectNode result = Json.newObject();
            result.put("shipType", ship.getName());
            for(int i=0; i<ship.getPosition().length; i++){
                result.put("position"+i, ship.getPosition()[i]);
            }
            sendMessage(player,"ship",result);
        }
    }


    private List<Ship> getDefaultStrategyA(){

        List<Ship> strategy = new ArrayList<Ship>();

        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        PatrolShip patrolShip = new PatrolShip();
        Destroyer destroyer = new Destroyer();

        String[] aircraftPosition = new String[5];
        aircraftPosition[0] = "4C";
        aircraftPosition[1] = "4D";
        aircraftPosition[2] = "4E";
        aircraftPosition[3] = "4F";
        aircraftPosition[4] = "4G";
        aircraftCarrier.setPosition(aircraftPosition);

        String[] battleshipPosition = new String[4];
        battleshipPosition[0] = "6G";
        battleshipPosition[1] = "7G";
        battleshipPosition[2] = "8G";
        battleshipPosition[3] = "9G";
        battleship.setPosition(battleshipPosition);

        String[] submarinePosition = new String[3];
        submarinePosition[0] = "1I";
        submarinePosition[1] = "2I";
        submarinePosition[2] = "3I";
        submarine.setPosition(submarinePosition);

        String[] patrolShipPosition = new String[2];
        patrolShipPosition[0] = "1B";
        patrolShipPosition[1] = "1C";
        patrolShip.setPosition(patrolShipPosition);

        String[] destroyerPosition = new String[2];
        destroyerPosition[0] = "8B";
        destroyerPosition[1] = "8C";
        destroyer.setPosition(destroyerPosition);

        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(patrolShip);
        strategy.add(destroyer);

        return strategy;

    }

    private List<Ship> getDefaultStrategyB(){

        List<Ship> strategy = new ArrayList<Ship>();

        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        PatrolShip patrolShip = new PatrolShip();
        Destroyer destroyer = new Destroyer();

        String[] aircraftPosition = new String[5];
        aircraftPosition[0] = "2B";
        aircraftPosition[1] = "2C";
        aircraftPosition[2] = "2D";
        aircraftPosition[3] = "2E";
        aircraftPosition[4] = "2F";
        aircraftCarrier.setPosition(aircraftPosition);

        String[] battleshipPosition = new String[4];
        battleshipPosition[0] = "10F";
        battleshipPosition[1] = "10G";
        battleshipPosition[2] = "10H";
        battleshipPosition[3] = "10I";
        battleship.setPosition(battleshipPosition);

        String[] submarinePosition = new String[3];
        submarinePosition[0] = "5D";
        submarinePosition[1] = "5E";
        submarinePosition[2] = "5F";
        submarine.setPosition(submarinePosition);

        String[] patrolShipPosition = new String[2];
        patrolShipPosition[0] = "6J";
        patrolShipPosition[1] = "7J";
        patrolShip.setPosition(patrolShipPosition);

        String[] destroyerPosition = new String[2];
        destroyerPosition[0] = "9B";
        destroyerPosition[1] = "9C";
        destroyer.setPosition(destroyerPosition);

        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(patrolShip);
        strategy.add(destroyer);

        return strategy;

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

    private void setStrategy() {
        playerOne.setShips(getDefaultStrategyA());
        playerTwo.setShips(getDefaultStrategyB());
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
