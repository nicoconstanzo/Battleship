package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:02
 * To change this template use File | Settings | File Templates.
 */
public class AircraftCarrier extends Ship {

    private String name = "carrier";
    
    public AircraftCarrier(){
        setName(name);
        setSize(5);
        setHit(0);

    }


    @Override
    public String toString() {
        return name;
    }
}
