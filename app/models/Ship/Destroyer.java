package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 01:10
 * To change this template use File | Settings | File Templates.
 */
public class Destroyer extends Ship{

    private String name = "destroyer";
    
    public Destroyer(){
        setName(name);
        setSize(2);
        setHit(0);

    }


    @Override
    public String toString() {
        return name;
    }
}
