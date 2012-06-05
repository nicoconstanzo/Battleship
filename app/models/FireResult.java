package models;


public enum FireResult {

    WATER("miss","Water, you missed", "Calm, it was water!"),
    SINK("sunk","You sunk it!", "Ohhh noo, your ship was sunk!"),
    HIT("hit","You hit it", "Ohh noo, your ship was hit!"),
    ALREADY_SHOT("already,shot","You already shot here", "They already shot here!"),
    WIN("win","Good, you win the game!", ""),
    LOSER("loser", "","HA HA, you are a looser!");

    private String currentPlayerMessage;
    private String opponentMessage;

    private FireResult(String name, String currentPlayerMessage, String opponentMessage) {
        this.currentPlayerMessage = currentPlayerMessage;
        this.opponentMessage = opponentMessage;
    }

    public String getCurrentPlayerMessage() {
        return currentPlayerMessage;
    }

    public String getOpponentMessage() {
        return opponentMessage;
    }

    public boolean isAlreadyShot() {
        return equals(ALREADY_SHOT);
    }
}