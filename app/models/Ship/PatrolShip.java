package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:10
 * To change this template use File | Settings | File Templates.
 */
public class PatrolShip extends Ship{
    
    String name = "patrol";

    public PatrolShip(){
        setName(name);
        setSize(2);
        setHit(0);

    }

    @Override
    public String toString() {
        return name;
    }
}
