package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:08
 * To change this template use File | Settings | File Templates.
 */
public class Battleship extends Ship{
    @Override
    public String getName() {
        return "Battleship";
    }

    @Override
    public int getSize() {
        return 4;
    }
}
