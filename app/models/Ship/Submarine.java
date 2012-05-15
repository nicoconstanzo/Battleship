package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:09
 * To change this template use File | Settings | File Templates.
 */
public class Submarine extends Ship{
    @Override
    public String getName() {
        return "Submarine";
    }

    @Override
    public int getSize() {
        return 3;
    }
}
