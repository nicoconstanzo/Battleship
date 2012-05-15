package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:10
 * To change this template use File | Settings | File Templates.
 */
public class Destroyer extends Ship{
    @Override
    public String getName() {
        return "Destroyer";
    }

    @Override
    public int getSize() {
        return 2;
    }
}
