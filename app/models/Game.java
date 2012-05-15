package models;

import models.Ship.*;

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
        notifyTurn();
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


    private void notifyOponent() {
        sendMessage(getPlayerOne(), "start", "Let's play Boom Boom Splash, you are playing against " + getPlayerTwo().getUsername());
        sendMessage(getPlayerTwo(), "start", "Let's play Boom Boom Splash, you are playing against " + getPlayerOne().getUsername());
    }

    public void play(Player player, String position){
        if (getCurrentPlayer() == player) {
            sendMessage(getOpponent(getCurrentPlayer()),"game", getCurrentPlayer().getUsername() + " have fire to " + position);
            sendMessage(getCurrentPlayer(),"hit",position);
            checkFire(player, position);
            changeTurn();
            notifyTurn();
        } else {
            sendMessage(getOpponent(getCurrentPlayer()), "wait", "Wait, is not your turn!");
        }

    }

    private void changeTurn(){
        Player previousCurrentPlayer = getCurrentPlayer();
        getCurrentPlayer().setTurn(false);
        (getOpponent(previousCurrentPlayer)).setTurn(true);
    }

    private void notifyTurn() {
           sendMessage(getCurrentPlayer(), "game", "It's your turn, Fire.");
           sendMessage(getOpponent(getCurrentPlayer()), "wait", "It is " + getCurrentPlayer().getUsername() +  " turn!");

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

    public boolean isFinish() {
        return nPlayer == 0;
    }

    private Player getCurrentPlayer(){
        return playerOne.isTurn() ? playerOne : playerTwo;
    }
    
    private void checkFire(Player player, String shot){
        FireResult fireResult = getFireResult(player, shot);
        sendMessage(player,"game",fireResult.getCurrentPlayerMessage());
        sendMessage(getOpponent(player),"game",fireResult.getOpponentMessage());
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
                //TODO Si estan todos los barcos hundidos --> GANO
            }
        }
        //TODO Nunca llega hasta aca
        if(ships.get(1).isSunk() && ships.get(2).isSunk() && ships.get(3).isSunk() && ships.get(4).isSunk() && ships.get(5).isSunk()){
            return FireResult.WIN;
        }
        return FireResult.WATER;
    }

    private List<Ship> getDefaultStrategyA(){

        List<Ship> strategy = new ArrayList<Ship>();

        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        Cruiser cruiser = new Cruiser();
        Destroyer destroyer = new Destroyer();

        String[] aircraftPosition = new String[5];
        aircraftPosition[0] = "4.C";
        aircraftPosition[1] = "4.D";
        aircraftPosition[2] = "4.E";
        aircraftPosition[3] = "4.F";
        aircraftPosition[4] = "4.G";
        aircraftCarrier.setPosition(aircraftPosition);

        String[] battleshipPosition = new String[4];
        battleshipPosition[0] = "6.G";
        battleshipPosition[1] = "7.G";
        battleshipPosition[2] = "8.G";
        battleshipPosition[3] = "9.G";
        battleship.setPosition(battleshipPosition);

        String[] submarinePosition = new String[3];
        submarinePosition[0] = "1.I";
        submarinePosition[1] = "2.I";
        submarinePosition[2] = "3.I";
        submarine.setPosition(submarinePosition);

        String[] cruiserPosition = new String[2];
        cruiserPosition[0] = "1.B";
        cruiserPosition[1] = "1.C";
        cruiser.setPosition(cruiserPosition);

        String[] destroyerPosition = new String[2];
        battleshipPosition[0] = "8.B";
        battleshipPosition[1] = "8.C";
        destroyer.setPosition(destroyerPosition);

        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(cruiser);
        strategy.add(destroyer);

        return strategy;

    }

    private List<Ship> getDefaultStrategyB(){

        List<Ship> strategy = new ArrayList<Ship>();

        AircraftCarrier aircraftCarrier = new AircraftCarrier();
        Battleship battleship = new Battleship();
        Submarine submarine = new Submarine();
        Cruiser cruiser = new Cruiser();
        Destroyer destroyer = new Destroyer();

        String[] aircraftPosition = new String[5];
        aircraftPosition[0] = "2.B";
        aircraftPosition[1] = "2.C";
        aircraftPosition[2] = "2.D";
        aircraftPosition[3] = "2.E";
        aircraftPosition[4] = "2.F";
        aircraftCarrier.setPosition(aircraftPosition);

        String[] battleshipPosition = new String[4];
        battleshipPosition[0] = "10.F";
        battleshipPosition[1] = "10.G";
        battleshipPosition[2] = "10.H";
        battleshipPosition[3] = "10.I";
        battleship.setPosition(battleshipPosition);

        String[] submarinePosition = new String[3];
        submarinePosition[0] = "5.D";
        submarinePosition[1] = "5.E";
        submarinePosition[2] = "5.F";
        submarine.setPosition(submarinePosition);

        String[] cruiserPosition = new String[2];
        cruiserPosition[0] = "6.J";
        cruiserPosition[1] = "7.J";
        cruiser.setPosition(cruiserPosition);

        String[] destroyerPosition = new String[2];
        battleshipPosition[0] = "9.B";
        battleshipPosition[1] = "9.C";
        destroyer.setPosition(destroyerPosition);

        strategy.add(aircraftCarrier);
        strategy.add(battleship);
        strategy.add(submarine);
        strategy.add(cruiser);
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


}
