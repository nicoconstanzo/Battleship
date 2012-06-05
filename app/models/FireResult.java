package models;


public enum FireResult {

    WATER("Water, you missed", "Calm, it was water!"),
    SINK("You sunk it!", "Ohhh noo, your ship was sunk!"),
    HIT("You hit it", "Ohh noo, your ship was hit!"),
    ALREADY_SHOT("You already shot here", "They already shot here!"),
    WIN("Good, you win the game!", ""),
    LOSER("", "HA HA, you are a looser!");

    private String currentPlayerMessage;
    private String opponentMessage;

    private FireResult(String currentPlayerMessage, String opponentMessage) {
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