package models;

import org.codehaus.jackson.JsonNode;
import play.libs.F;
import play.mvc.WebSocket;

import java.util.ArrayList;

public class GameManager {
    private static ArrayList<Game> games = new ArrayList<Game>();


    public static void join(String username, WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
        Game game = getGame();
        if (!game.isPlayerOneDefined()) {
            Player playerOne = new Player(username, out, game.getGameId());
            game.setPlayerOne(playerOne);

            bingInWebSocket(in, playerOne);
        } else if (!game.isPlayerTwoDefined()) {
            Player player = new Player(username, out, game.getGameId());
            game.setPlayerTwo(player);
            bingInWebSocket(in, player);
            game.startGame();

        } else {
            game = new Game();
            games.add(game);
            join(username, in, out);
        }
    }
    
    private static Game getGame(){
        Game game;
        if(games.isEmpty()){
            game = new Game();
            games.add(game);
        }
        else{
            game = games.get(games.size()-1);
            
        }
        return game;
    }

    private static void bingInWebSocket(WebSocket.In<JsonNode> in, final Player player) {

        in.onMessage(new F.Callback<JsonNode>() {
            public void invoke(JsonNode jsonNode) throws Throwable {
                Game game = getGameById(player.getGameId());
                String messageType = jsonNode.get("type").asText();
                if (game.isStart()) {
                    if (messageType.equals("chat")) {
//                        Chat behavior
                        final String talk = jsonNode.get("text").asText();
                        game.chat(player, talk);
                    }
                } else {
//                    Waiting for another player
                    game.chat(player, "");
                }

            }
        });

        in.onClose(new F.Callback0() {
            public void invoke() throws Throwable {
                Game game = getGameById(player.getGameId());
                game.leave(player);
                if (game.isEmpty()) {
                    games.remove(games.indexOf(game));
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


}
