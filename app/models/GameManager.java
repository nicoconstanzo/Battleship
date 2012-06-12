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
            sendMessage(playerOne, "waitOpponent", "Waiting for a player to start the game");
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
            sendMessage(game.getPlayerOne(), "opponentReady");
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
                JsonNode jsonMessageText = jsonNode.get("messageText");
                String messageText = jsonNode.get("messageText").asText();
                if (messageType.equals("strategy")) {
                    game.setStrategy(jsonMessageText, player);
                    drawShips(game,player);

                }
                if(messageType.equals("randomStrategy")){
                    game.randomStrategy(player);
                    drawShips(game,player);
                }

                if (!game.isStart()) {
                    if (messageType.equals("chat")) {

                        sendMessage(player, "chat", "Still waiting for opponent. " + messageText);
                    }

                } else {


                       Player opponent = game.getOpponent(player);
                    if (messageType.equals("chat")) {
                        sendChat(player, opponent, messageText);
                    }
                    if (messageType.equals("hit")) {
                        if(player.isStrategyReady() && game.getOpponent(player).isStrategyReady()){
                            game.play(player, messageText);
                        }
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
    
    private static void drawShips(Game game, Player player) {
        game.drawShips(player);
        if(!game.getOpponent(player).isStrategyReady()){
            sendMessage(player, "waitOpponent", game.getOpponent(player).getUsername() + " is still defining the strategy");
        }else{
            sendMessage(game.getOpponent(player),"opponentReady");
        }
    }



}
