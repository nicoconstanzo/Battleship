package models;

import org.codehaus.jackson.JsonNode;
import play.libs.F;
import play.mvc.WebSocket;

import java.util.ArrayList;

import static models.Message.sendChat;
import static models.Message.sendMessage;
import static models.Message.usernameAlreadyChosen;

public class GameManager {
    private static ArrayList<Game> games = new ArrayList<Game>();


    public static void join(String username, WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
        Game game = getGame();
        if (!game.isPlayerOneDefined()) {
            Player playerOne = new Player(username, out, game.getGameId());
            sendMessage(playerOne, "start", "Welcome to Boom Boom Splash");
            sendMessage(playerOne, "wait", "Waiting for a player to start the game");
            sendMessage(playerOne, "strategy", "Meanwhile why don' we define our strategy? Drag & Drop the ships into the board");
            game.setPlayerOne(playerOne);
            openWebSocket(in, playerOne);

        } else if (!game.isPlayerTwoDefined()) {
            //TODO verify username playerTwo is not = playerOne
            if (game.getPlayerOne().getUsername().equals(username)) {
                usernameAlreadyChosen(out);
                //TODO we have to redirect to the index;
            }
            Player playerTwo = new Player(username, out, game.getGameId());
            game.setPlayerTwo(playerTwo);
            openWebSocket(in, playerTwo);
            sendMessage(playerTwo, "start", "Welcome to Boom Boom Splash");
            sendMessage(playerTwo, "strategy", "It's time to define our strategy? Drag & Drop the ships into the board");
            sendMessage(game.getOpponent(playerTwo), "start", playerTwo + "has entered the room");
            game.startGame();

        } else {
            createGame();
            join(username, in, out);
        }
    }

    private static void openWebSocket(WebSocket.In<JsonNode> in, final Player player) {

        in.onMessage(new F.Callback<JsonNode>() {
            public void invoke(JsonNode jsonNode) throws Throwable {
                Game game = getGameById(player.getGameId());
                String messageType = jsonNode.get("kind").asText();
                String messageText = jsonNode.get("messageText").asText();
                if (messageType.equals("strategy")) {
                    game.setStrategyy(jsonNode, player);
                    game.drawShips(player);

                }

                if (!game.isStart()) {
                    if (messageType.equals("chat")) {

                        sendMessage(player, "chat", "Still waiting for opponent. " + messageText);
                    }

                } else {


                    if (messageType.equals("chat")) {
                        sendChat(player, game.getOpponent(player), messageText);
                    }
                    if (messageType.equals("hit")) {
                        game.play(player, messageText);
                    }
                }
            }
        });

        in.onClose(new F.Callback0() {
            public void invoke() throws Throwable {
                Game game = getGameById(player.getGameId());
                Player opponent = game.getOpponent(player);
                game.leave();
                if (game.playerLeaves()) {
                    games.remove(games.indexOf(game));
                }
                if (!game.isFinish()) {
                    sendMessage(opponent, "leave", opponent.getUsername() + " has left the game!! You are the WINNER!");
                }


            }
        });
    }

    private static Game getGameById(String gameId) {
        for (Game game : games) {
            if (game.getGameId().equals(gameId)) {
                return game;
            }
        }
        return null;
    }

    private static Game createGame() {
        Game game = new Game();
        games.add(game);
        return game;
    }

    private static Game getGame() {
        Game game;
        if (games.isEmpty()) {
            game = createGame();
        } else {
            game = games.get(games.size() - 1);

        }
        return game;
    }



}
