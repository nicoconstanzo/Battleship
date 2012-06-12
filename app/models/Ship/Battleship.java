package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:08
 * To change this template use File | Settings | File Templates.
 */
public class Battleship extends Ship{

    private String name = "battleship";

    public Battleship(){
        setName(name);
        setSize(4);
        setHit(0);

    }

    @Override
    public String toString() {
        return name;
    }
}
