package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:09
 * To change this template use File | Settings | File Templates.
 */
public class Submarine extends Ship{

    private String name = "submarine";
    public Submarine(){
        setName(name);
        setSize(3);
        setHit(0);
    }

    @Override
    public String toString() {
        return name;
    }
}
