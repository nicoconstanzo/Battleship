package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:02
 * To change this template use File | Settings | File Templates.
 */
public class AircraftCarrier extends Ship {


    @Override
    public String getName() {
        return "Aircraft Carrier";
    }

    @Override
    public int getSize() {
        return 5;
    }
}
